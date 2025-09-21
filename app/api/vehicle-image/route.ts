import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

function normalizeSearchQuery(year: string, make: string, model: string): string {
  // Clean and normalize make/model
  const cleanMake = make.trim().replace(/[^\w\s]/g, '');
  const cleanModel = model.trim().replace(/[^\w\s]/g, '');

  // Search specifically on CarMax website
  return `${year} ${cleanMake} ${cleanModel}`;
}

function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Check URL length (max 2000 characters to avoid issues)
    if (url.length > 2000) {
      console.warn('URL too long:', url.length, 'characters');
      return false;
    }
    
    // Check for valid protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      console.warn('Invalid protocol:', urlObj.protocol);
      return false;
    }
    
    // Avoid problematic domains/patterns that often cause issues
    const problematicPatterns = [
      /build\.ford\.com.*%5B.*%5D/, // Ford build URLs with encoded brackets
      /configurator\./i,            // Car configurator URLs
      /\.aspx\?/i,                 // ASP.NET URLs with complex params
      /\?.*%7C.*%7C/,             // URLs with multiple encoded pipes
    ];
    
    const isProblematic = problematicPatterns.some(pattern => pattern.test(url));
    if (isProblematic) {
      console.warn('Problematic URL pattern detected:', url);
      return false;
    }
    
    // Check for valid image file extension or image-like URL
    const pathname = urlObj.pathname.toLowerCase();
    const hasImageExtension = /\.(jpg|jpeg|png|webp|gif)$/i.test(pathname);
    const isImagePath = pathname.includes('image') || pathname.includes('photo') || pathname.includes('picture');
    
    if (!hasImageExtension && !isImagePath) {
      console.warn('URL does not appear to be an image:', pathname);
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn('Invalid URL format:', error);
    return false;
  }
}

interface ImageResult {
  original?: string;
  [key: string]: unknown;
}

function findBestImageUrl(images: ImageResult[]): string | null {
  // Sort images by preference (avoid problematic sources)
  const sortedImages = images
    .filter(img => img.original && typeof img.original === 'string')
    .map(img => {
      const url = img.original as string; // We know it's string from filter above
      return {
        url,
        isValid: isValidImageUrl(url),
        // Prefer certain domains
        isDomainPreferred: /\.(jpg|jpeg|png|webp)$/i.test(url) && 
                          !/build\.ford\.com|configurator|dealer/i.test(url)
      };
    })
    .sort((a, b) => {
      // Prioritize valid URLs first
      if (a.isValid !== b.isValid) return b.isValid ? 1 : -1;
      // Then prioritize preferred domains
      if (a.isDomainPreferred !== b.isDomainPreferred) return b.isDomainPreferred ? 1 : -1;
      return 0;
    });

  return sortedImages.length > 0 ? sortedImages[0].url : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { year, make, model } = body;

    console.log('Vehicle image search input:', { year, make, model });

    // Validate required fields
    if (!year || !make || !model) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: year, make, and model are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SERPAPI_API_KEY;
    if (!apiKey) {
      console.error('Missing SerpApi key');
      return NextResponse.json({ imageUrl: '/hero-car.jpg' });
    }

    // Use SerpApi's Google engine with location for CarMax
    const searchQuery = normalizeSearchQuery(year, make, model);
    console.log('Search query:', searchQuery);

    const params = new URLSearchParams({
      engine: 'google_images',
      api_key: apiKey,
      q: searchQuery,
      google_domain: 'google.com',
      gl: 'us',
      hl: 'en',
      image_type: 'photo',
      image_color: 'trans',
    });

    const url = `https://serpapi.com/search.json?${params.toString()}`;
    const resp = await fetch(url);
    
    if (!resp.ok) {
      console.error('SerpApi error:', resp.status, resp.statusText);
      return NextResponse.json({ imageUrl: '/hero-car.jpg' });
    }

    const data = await resp.json();
    console.log('SerpApi response received, images count:', data.images_results?.length ?? 0);
    
    // Use inline_images from SerpApi response
    if (!data.images_results || !Array.isArray(data.images_results) || data.images_results.length === 0) {
      console.error('No images found in response');
      return NextResponse.json({ imageUrl: '/hero-car.jpg' });
    }

    // Find the best valid image URL
    const bestImageUrl = findBestImageUrl(data.images_results);
    if (!bestImageUrl) {
      console.error('No valid image URLs found after filtering');
      return NextResponse.json({ imageUrl: '/hero-car.jpg' });
    }

    console.log('Found valid image URL:', bestImageUrl);

    // Download and upload to Supabase with timeout and additional error handling
    let imageResponse: Response;
    try {
      // Add timeout to prevent hanging on problematic URLs
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      imageResponse = await fetch(bestImageUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!imageResponse.ok) {
        console.error('Failed to fetch image:', imageResponse.status, imageResponse.statusText);
        return NextResponse.json({ imageUrl: '/hero-car.jpg' });
      }
      
      // Check content type
      const contentType = imageResponse.headers.get('content-type');
      if (!contentType || !contentType.startsWith('image/')) {
        console.error('Invalid content type:', contentType);
        return NextResponse.json({ imageUrl: '/hero-car.jpg' });
      }
      
      // Check content length (avoid very large files)
      const contentLength = imageResponse.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
        console.error('Image too large:', contentLength, 'bytes');
        return NextResponse.json({ imageUrl: '/hero-car.jpg' });
      }
      
    } catch (fetchError) {
      console.error('Error fetching image:', fetchError);
      return NextResponse.json({ imageUrl: '/hero-car.jpg' });
    }
    const imageBuffer = await imageResponse.arrayBuffer();
    const filename = `${year}-${make}-${model}-${Date.now()}.jpg`;
    console.log('Uploading to Supabase:', filename);
    const supabase = createAdminClient();
    const { error: uploadError } = await supabase.storage
      .from('car-images')
      .upload(filename, imageBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
      });
    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json({ imageUrl: '/hero-car.jpg' });
    }
    const { data: { publicUrl } } = supabase.storage
      .from('car-images')
      .getPublicUrl(filename);
    console.log('Successfully uploaded, public URL:', publicUrl);
    return NextResponse.json({ imageUrl: publicUrl });

  } catch (error) {
    console.error('Vehicle image search error:', error);
    return NextResponse.json({ imageUrl: '/hero-car.jpg' });
  }
}



