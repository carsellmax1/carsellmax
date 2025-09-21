import { NextRequest, NextResponse } from 'next/server';
import { serpApiService, VehicleImageSearchParams } from '@/lib/serpapi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, make, model } = body as VehicleImageSearchParams;

    // Validate required parameters
    if (!year || !make || !model) {
      return NextResponse.json(
        { error: 'Missing required parameters: year, make, model' },
        { status: 400 }
      );
    }

    console.log(`Searching for vehicle images: ${year} ${make} ${model}`);

    // Search for vehicle images using SerpAPI
    const images = await serpApiService.searchVehicleImagesWithFallback({
      year,
      make,
      model
    });

    return NextResponse.json({
      success: true,
      images,
      count: images.length
    });

  } catch (error) {
    console.error('Error in vehicle images API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search for vehicle images',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const make = searchParams.get('make');
  const model = searchParams.get('model');

  if (!year || !make || !model) {
    return NextResponse.json(
      { error: 'Missing required parameters: year, make, model' },
      { status: 400 }
    );
  }

  try {
    console.log(`Searching for vehicle images: ${year} ${make} ${model}`);

    const images = await serpApiService.searchVehicleImagesWithFallback({
      year,
      make,
      model
    });

    return NextResponse.json({
      success: true,
      images,
      count: images.length
    });

  } catch (error) {
    console.error('Error in vehicle images API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search for vehicle images',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

