import { NextRequest, NextResponse } from 'next/server';
import { externalValuationService, VehicleInfo } from '@/lib/external-apis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { vin, year, make, model, mileage, condition, location } = body;

    // Validate required fields
    if (!vin || !year || !make || !model || !mileage) {
      return NextResponse.json(
        { error: 'Missing required fields: vin, year, make, model, mileage' },
        { status: 400 }
      );
    }

    const vehicleInfo: VehicleInfo = {
      vin,
      year: parseInt(year),
      make,
      model,
      mileage: parseInt(mileage),
      condition: condition || 'good',
      location: location || 'US',
    };

    // Get market valuations from external sources
    const marketData = await externalValuationService.getMarketValuation(vehicleInfo);

    return NextResponse.json({
      success: true,
      data: marketData,
      vehicle: vehicleInfo,
    });
  } catch (error) {
    console.error('External valuation API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch external valuations' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vin = searchParams.get('vin');

    if (!vin) {
      return NextResponse.json(
        { error: 'VIN parameter is required' },
        { status: 400 }
      );
    }

    // Get vehicle specifications from NHTSA
    const specifications = await externalValuationService.getVehicleSpecifications(vin);

    return NextResponse.json({
      success: true,
      data: specifications,
    });
  } catch (error) {
    console.error('Vehicle specifications API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicle specifications' },
      { status: 500 }
    );
  }
}

