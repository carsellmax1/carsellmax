import { getJson } from 'serpapi';

export interface VehicleImageSearchParams {
  year: string;
  make: string;
  model: string;
}

export interface VehicleImageResult {
  url: string;
  thumbnail: string;
  title: string;
  source: string;
  width?: number;
  height?: number;
}

export interface SerpApiImageResponse {
  images_results?: Array<{
    position: number;
    thumbnail: string;
    original: string;
    title: string;
    source: string;
    original_width?: number;
    original_height?: number;
  }>;
}

class SerpApiService {
  private apiKey: string;
  private imageCache: Map<string, VehicleImageResult[]> = new Map();

  constructor() {
    this.apiKey = process.env.SERPAPI_KEY || '';
    if (!this.apiKey) {
      console.warn('SERPAPI_KEY not found in environment variables');
    }
  }

  // Check if we have cached SerpAPI results for this vehicle
  private getCachedImage(params: VehicleImageSearchParams): VehicleImageResult | null {
    const cacheKey = `${params.year}-${params.make}-${params.model}`.toLowerCase();
    
    if (this.imageCache.has(cacheKey)) {
      const cachedResults = this.imageCache.get(cacheKey)!;
      if (cachedResults.length > 0) {
        console.log(`Using cached SerpAPI image for ${cacheKey}`);
        return cachedResults[0];
      }
    }

    return null;
  }

  async searchVehicleImages(params: VehicleImageSearchParams): Promise<VehicleImageResult[]> {
    const cacheKey = `${params.year}-${params.make}-${params.model}`.toLowerCase();
    
    // Check cache first
    if (this.imageCache.has(cacheKey)) {
      console.log(`Using cached image for ${cacheKey}`);
      return this.imageCache.get(cacheKey)!;
    }

    // Try cached image
    const cachedImage = this.getCachedImage(params);
    if (cachedImage) {
      return [cachedImage];
    }

    if (!this.apiKey) {
      console.warn('SerpAPI key not available, returning empty results');
      return [];
    }

    try {
      // Create search query for the specific vehicle
      const query = `${params.year} ${params.make} ${params.model} car`;
      
      console.log(`Searching for vehicle images: ${query}`);

      // Search for transparent PNG images specifically
      const searchParams = {
        engine: "google_images",
        q: `${query} transparent png`,
        api_key: this.apiKey,
        hl: "en",
        gl: "us",
        // Search for transparent PNG images
        tbs: "ift:png,ic:trans", // PNG format with transparent background
        safe: "active",
        num: 5 // Get more results to find transparent ones
      };

      const response = await getJson(searchParams) as SerpApiImageResponse;
      
      if (!response.images_results || response.images_results.length === 0) {
        console.log('No image results found');
        return [];
      }

      // Filter for transparent PNG images and prioritize quality
      const results: VehicleImageResult[] = response.images_results
        .filter(image => {
          const hasValidUrl = image.original && image.thumbnail;
          const isRelevantSize = !image.original_width || image.original_width >= 300;
          const isPng = image.original?.toLowerCase().includes('.png') || 
                       image.original?.toLowerCase().includes('png') ||
                       image.title?.toLowerCase().includes('png') ||
                       image.title?.toLowerCase().includes('transparent');
          return hasValidUrl && isRelevantSize && isPng;
        })
        .sort((a, b) => {
          // Prioritize images with "transparent" in title or URL
          const aTransparent = (a.title?.toLowerCase().includes('transparent') || 
                               a.original?.toLowerCase().includes('transparent')) ? 1 : 0;
          const bTransparent = (b.title?.toLowerCase().includes('transparent') || 
                               b.original?.toLowerCase().includes('transparent')) ? 1 : 0;
          if (aTransparent !== bTransparent) return bTransparent - aTransparent;
          
          // Then sort by size
          const aSize = (a.original_width || 0) * (a.original_height || 0);
          const bSize = (b.original_width || 0) * (b.original_height || 0);
          return bSize - aSize;
        })
        .slice(0, 1) // Return the best transparent result
        .map(image => ({
          url: image.original,
          thumbnail: image.thumbnail,
          title: image.title || `${params.year} ${params.make} ${params.model}`,
          source: image.source || 'Unknown',
          width: image.original_width,
          height: image.original_height
        }));

      // Cache the result
      this.imageCache.set(cacheKey, results);
      console.log(`Found ${results.length} vehicle images and cached`);
      return results;

    } catch (error) {
      console.error('Error searching for vehicle images:', error);
      return [];
    }
  }

  async searchVehicleImagesWithFallback(params: VehicleImageSearchParams): Promise<VehicleImageResult[]> {
    // First try with PNG filter for transparent backgrounds
    let results = await this.searchVehicleImages(params);
    
    if (results.length === 0) {
      console.log('No PNG transparent results found, trying without format filter');
      // Fallback: search without PNG filter but prioritize transparent images
      try {
        const query = `${params.year} ${params.make} ${params.model} car`;
        
        const searchParams = {
          engine: "google_images",
          q: query,
          api_key: this.apiKey,
          hl: "en",
          gl: "us",
          // Fallback: try without PNG filter but prioritize transparent images
          tbs: "ic:trans",
          imgar: "w", // Wide aspect ratio for better vehicle display
          safe: "active",
          num: 10
        };

        const response = await getJson(searchParams) as SerpApiImageResponse;
        
        if (response.images_results) {
          results = response.images_results
            .filter(image => {
              const isRelevantSize = !image.original_width || image.original_width >= 300;
              const hasValidUrl = image.original && image.thumbnail;
              const hasGoodAspectRatio = !image.original_width || !image.original_height || 
                (image.original_width / image.original_height) >= 1.2;
              return isRelevantSize && hasValidUrl && hasGoodAspectRatio;
            })
            .sort((a, b) => {
              const aSize = (a.original_width || 0) * (a.original_height || 0);
              const bSize = (b.original_width || 0) * (b.original_height || 0);
              return bSize - aSize;
            })
            .slice(0, 5)
            .map(image => ({
              url: image.original,
              thumbnail: image.thumbnail,
              title: image.title || `${params.year} ${params.make} ${params.model}`,
              source: image.source || 'Unknown',
              width: image.original_width,
              height: image.original_height
            }));
        }
      } catch (error) {
        console.error('Error in fallback search:', error);
      }
    }

    // If still no results, try a final fallback with any image type but still prefer transparency
    if (results.length === 0) {
      console.log('No transparent results found, trying any image type');
      try {
        const query = `${params.year} ${params.make} ${params.model} car transparent`;
        
        const searchParams = {
          engine: "google_images",
          q: query,
          api_key: this.apiKey,
          hl: "en",
          gl: "us",
          imgar: "w",
          safe: "active",
          num: 10
        };

        const response = await getJson(searchParams) as SerpApiImageResponse;
        
        if (response.images_results) {
          results = response.images_results
            .filter(image => {
              const isRelevantSize = !image.original_width || image.original_width >= 300;
              const hasValidUrl = image.original && image.thumbnail;
              const hasGoodAspectRatio = !image.original_width || !image.original_height || 
                (image.original_width / image.original_height) >= 1.2;
              return isRelevantSize && hasValidUrl && hasGoodAspectRatio;
            })
            .sort((a, b) => {
              const aSize = (a.original_width || 0) * (a.original_height || 0);
              const bSize = (b.original_width || 0) * (b.original_height || 0);
              return bSize - aSize;
            })
            .slice(0, 5)
            .map(image => ({
              url: image.original,
              thumbnail: image.thumbnail,
              title: image.title || `${params.year} ${params.make} ${params.model}`,
              source: image.source || 'Unknown',
              width: image.original_width,
              height: image.original_height
            }));
        }
      } catch (error) {
        console.error('Error in final fallback search:', error);
      }
    }

    return results;
  }
}

export const serpApiService = new SerpApiService();
