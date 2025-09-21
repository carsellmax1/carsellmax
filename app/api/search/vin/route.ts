import { NextRequest, NextResponse } from 'next/server';


interface NHTSAResult {
  Variable: string;
  Value: string | null;
}

interface NHTSAResponse {
  Results: NHTSAResult[];
}

export async function POST(req: NextRequest) {
  try {
    const { vin } = await req.json();
    
    if (!vin) {
      return NextResponse.json(
        { success: false, error: 'VIN is required' },
        { status: 400 }
      );
    }

    // Basic VIN validation
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return NextResponse.json(
        { success: false, error: 'Invalid VIN format' },
        { status: 400 }
      );
    }

    // Call NHTSA API to decode VIN with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    let response;
    try {
      response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to fetch VIN data');
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      throw error;
    }

    const data: NHTSAResponse = await response.json();
    
    if (!data.Results || data.Results.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No vehicle found with this VIN' },
        { status: 404 }
      );
    }

    // Extract relevant information from NHTSA response
    const results = data.Results;
    
    const make = results.find((r: NHTSAResult) => r.Variable === 'Make' && r.Value)?.Value;
    const model = results.find((r: NHTSAResult) => r.Variable === 'Model' && r.Value)?.Value;
    const year = results.find((r: NHTSAResult) => r.Variable === 'Model Year' && r.Value)?.Value;
    const color = results.find((r: NHTSAResult) => r.Variable === 'Exterior Color' && r.Value)?.Value;
    const bodyType = results.find((r: NHTSAResult) => r.Variable === 'Body Class' && r.Value)?.Value;
    const fuelType = results.find((r: NHTSAResult) => r.Variable === 'Fuel Type - Primary' && r.Value)?.Value;
    
    // If essential data is missing, return error
    if (!make || !model || !year) {
      return NextResponse.json(
        { success: false, error: 'Incomplete vehicle data from VIN. Make, model, or year not found.' },
        { status: 404 }
      );
    }
    
    // Create makeModel by combining make and model
    const makeModel = `${make} ${model}`;
    
    const carData = {
      id: vin,
      vin,
      makeModel,
      make,
      model,
      year,
      color: color || 'Unknown',
      bodyType: bodyType || 'Unknown',
      fuelType: fuelType || 'Unknown'
    };

    return NextResponse.json({
      success: true,
      data: carData
    });

  } catch (error) {
    console.error('VIN search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search VIN' },
      { status: 500 }
    );
  }
}
