import { NextRequest, NextResponse } from 'next/server';
import { externalValuationService } from '@/lib/external-apis';

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

    // Validate VIN format
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      return NextResponse.json(
        { error: 'Invalid VIN format. VIN should be 17 characters long and contain only letters (except I, O, Q) and numbers.' },
        { status: 400 }
      );
    }

    // Get vehicle specifications from NHTSA
    const specifications = await externalValuationService.getVehicleSpecifications(vin);

    if (!specifications) {
      return NextResponse.json(
        { error: 'No vehicle specifications found for this VIN' },
        { status: 404 }
      );
    }

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

