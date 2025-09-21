import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface CarSubmissionData {
  // Customer information
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  
  // Vehicle information
  vehicle: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    vin?: string;
    color: string;
    condition: string;
    additional_notes?: string;
  };
  
  // Valuation information
  valuation: {
    estimated_value: number;
    market_data?: Record<string, unknown>;
  };
  
  // Photos
  photos: Array<{
    category: string;
    filename: string;
    size: number;
    type: string;
  }>;
}

// Comprehensive submission data interface
interface ComprehensiveSubmissionData {
  userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  vehicleDetails: {
    condition: string;
    transmission: string;
    fuelType: string;
    interiorColor: string;
    exteriorColor: string;
    driveTrain: string;
    additionalInfo: string;
  };
  exteriorImages: {
    front?: string;
    rear?: string;
    driverSide?: string;
    passengerSide?: string;
  };
  interiorImages: {
    dashboard?: string;
    frontSeats?: string;
    odometer?: string;
  };
  engineVideo: {
    engineVideo?: string;
    engineSound?: string;
  };
  carData: {
    year: string;
    make_model: string;
    mileage: string;
    vin: string;
    color: string;
    type: string;
    estimated_value: number;
  };
}

// Rate limiting (in-memory for simplicity)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Disposable email domains (basic list)
const disposableEmailDomains = [
  '10minutemail.com',
  'tempmail.org',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email'
];

function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? disposableEmailDomains.includes(domain) : false;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0] || realIP || '127.0.0.1';
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);
  
  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 }); // 1 hour window
    return true;
  }
  
  if (limit.count >= 10) { // 10 submissions per hour
    return false;
  }
  
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const rawData = await request.json();
    console.log('Received submission data:', { type: typeof rawData, hasUserDetails: !!rawData.userDetails });

    // Determine if this is a comprehensive submission or legacy
    const isComprehensive = rawData.userDetails && rawData.vehicleDetails && rawData.exteriorImages;
    
    if (isComprehensive) {
      return handleComprehensiveSubmission(rawData as ComprehensiveSubmissionData, clientIP);
    } else {
      return handleLegacySubmission(rawData as CarSubmissionData, clientIP);
    }

  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process submission. Please try again.' },
      { status: 500 }
    );
  }
}

async function handleComprehensiveSubmission(data: ComprehensiveSubmissionData, clientIP: string) {
  try {
    const { userDetails, vehicleDetails, exteriorImages, interiorImages, engineVideo, carData } = data;

    // Initialize Supabase client
    const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Use actual user details from the form
    let customerData = {
      name: `${userDetails.firstName} ${userDetails.lastName}`,
      email: userDetails.email,
      phone: userDetails.phone,
      address: {
        street: 'N/A', // Not collected in current form
        city: 'N/A',
        state: 'N/A',
        zip: 'N/A'
      }
    };

    // Check for existing customer or create new one
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerData.email)
      .eq('org_id', '00000000-0000-0000-0000-000000000001')
      .single();

    if (existingCustomer) {
      // Update existing customer with new information
      const { data: updatedCustomer, error: updateError } = await supabase
        .from('customers')
        .update({
          name: customerData.name,
          phone: customerData.phone,
          address: customerData.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCustomer.id)
        .select()
        .single();

      if (updateError) {
        console.error('Customer update error:', updateError);
        throw new Error('Failed to update customer record');
      }
      customerData = updatedCustomer;
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert([{
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          address: customerData.address,
          org_id: '00000000-0000-0000-0000-000000000001'
        }])
        .select()
        .single();

      if (customerError) {
        console.error('Customer creation error:', customerError);
        throw new Error('Failed to create customer record');
      }
      customerData = newCustomer;
    }

    // Check for existing vehicle or create new one
    let vehicleData;
    if (carData.vin) {
      const { data: existingVehicle } = await supabase
        .from('vehicles')
        .select('*')
        .eq('vin', carData.vin)
        .eq('org_id', '00000000-0000-0000-0000-000000000001')
        .single();

      if (existingVehicle) {
        // Update existing vehicle with new information
        const { data: updatedVehicle, error: updateError } = await supabase
          .from('vehicles')
          .update({
            make: carData.make_model.split(' ')[0] || 'Unknown',
            model: carData.make_model.split(' ').slice(1).join(' ') || 'Unknown',
            year: parseInt(carData.year),
            mileage: parseInt(carData.mileage.replace(/,/g, '')),
            color: carData.color,
            condition: vehicleDetails.condition,
            transmission: vehicleDetails.transmission,
            fuel_type: vehicleDetails.fuelType,
            body_type: carData.type,
            interior_color: vehicleDetails.interiorColor,
            exterior_color: vehicleDetails.exteriorColor,
            drive_train: vehicleDetails.driveTrain,
            additional_info: vehicleDetails.additionalInfo,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingVehicle.id)
          .select()
          .single();

        if (updateError) {
          console.error('Vehicle update error:', updateError);
          throw new Error('Failed to update vehicle record');
        }
        vehicleData = updatedVehicle;
      } else {
        // Create new vehicle
        const { data: newVehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .insert([{
            make: carData.make_model.split(' ')[0] || 'Unknown',
            model: carData.make_model.split(' ').slice(1).join(' ') || 'Unknown',
            year: parseInt(carData.year),
            vin: carData.vin,
            mileage: parseInt(carData.mileage.replace(/,/g, '')),
            color: carData.color,
            condition: vehicleDetails.condition,
            transmission: vehicleDetails.transmission,
            fuel_type: vehicleDetails.fuelType,
            body_type: carData.type,
            interior_color: vehicleDetails.interiorColor,
            exterior_color: vehicleDetails.exteriorColor,
            drive_train: vehicleDetails.driveTrain,
            additional_info: vehicleDetails.additionalInfo,
            org_id: '00000000-0000-0000-0000-000000000001'
          }])
          .select()
          .single();

        if (vehicleError) {
          console.error('Vehicle creation error:', vehicleError);
          throw new Error('Failed to create vehicle record');
        }
        vehicleData = newVehicle;
      }
    } else {
      // Create new vehicle without VIN
      const { data: newVehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert([{
          make: carData.make_model.split(' ')[0] || 'Unknown',
          model: carData.make_model.split(' ').slice(1).join(' ') || 'Unknown',
          year: parseInt(carData.year),
          vin: null,
          mileage: parseInt(carData.mileage.replace(/,/g, '')),
          color: carData.color,
          condition: vehicleDetails.condition,
          transmission: vehicleDetails.transmission,
          fuel_type: vehicleDetails.fuelType,
          body_type: carData.type,
          interior_color: vehicleDetails.interiorColor,
          exterior_color: vehicleDetails.exteriorColor,
          drive_train: vehicleDetails.driveTrain,
          additional_info: vehicleDetails.additionalInfo,
          org_id: '00000000-0000-0000-0000-000000000001'
        }])
        .select()
        .single();

      if (vehicleError) {
        console.error('Vehicle creation error:', vehicleError);
        throw new Error('Failed to create vehicle record');
      }
      vehicleData = newVehicle;
    }

    // Create quote submission with comprehensive data
    const { data: quoteData, error: quoteError } = await supabase
      .from('quote_submissions')
      .insert([{
        customer_id: customerData.id,
        vehicle_id: vehicleData.id,
        estimated_value: carData.estimated_value,
        additional_notes: vehicleDetails.additionalInfo,
        status: 'pending_review',
        vehicle_condition_details: vehicleDetails,
        exterior_images: exteriorImages,
        interior_images: interiorImages,
        engine_videos: engineVideo,
        submission_step: 'completed',
        org_id: '00000000-0000-0000-0000-000000000001'
      }])
      .select()
      .single();

    if (quoteError) {
      console.error('Quote submission error:', quoteError);
      throw new Error('Failed to create quote submission');
    }

    // Create media assets for images
    const mediaAssets = [];
    
    // Process exterior images
    for (const [position, imageData] of Object.entries(exteriorImages)) {
      if (imageData) {
        mediaAssets.push({
          quote_submission_id: quoteData.id,
          file_name: `${position}_exterior.jpg`,
          file_path: `/uploads/${quoteData.id}/exterior/${position}.jpg`,
          file_type: 'image',
          file_size: 0, // Base64 size calculation would go here
          mime_type: 'image/jpeg',
          category: 'exterior',
          image_type: 'exterior',
          image_position: position,
          is_required: ['front', 'rear', 'driverSide', 'passengerSide'].includes(position),
          org_id: '00000000-0000-0000-0000-000000000001'
        });
      }
    }

    // Process interior images
    for (const [position, imageData] of Object.entries(interiorImages)) {
      if (imageData) {
        mediaAssets.push({
          quote_submission_id: quoteData.id,
          file_name: `${position}_interior.jpg`,
          file_path: `/uploads/${quoteData.id}/interior/${position}.jpg`,
          file_type: 'image',
          file_size: 0,
          mime_type: 'image/jpeg',
          category: 'interior',
          image_type: 'interior',
          image_position: position,
          is_required: ['dashboard', 'frontSeats', 'odometer'].includes(position),
          org_id: '00000000-0000-0000-0000-000000000001'
        });
      }
    }

    // Process engine videos
    if (engineVideo.engineVideo) {
      mediaAssets.push({
        quote_submission_id: quoteData.id,
        file_name: 'engine_video.mp4',
        file_path: `/uploads/${quoteData.id}/videos/engine_video.mp4`,
        file_type: 'video',
        file_size: 0,
        mime_type: 'video/mp4',
        category: 'engine_video',
        image_type: 'engine_video',
        image_position: 'main',
        is_required: true,
        org_id: '00000000-0000-0000-0000-000000000001'
      });
    }

    if (engineVideo.engineSound) {
      mediaAssets.push({
        quote_submission_id: quoteData.id,
        file_name: 'engine_sound.mp3',
        file_path: `/uploads/${quoteData.id}/audio/engine_sound.mp3`,
        file_type: 'audio',
        file_size: 0,
        mime_type: 'audio/mpeg',
        category: 'engine_audio',
        image_type: 'engine_audio',
        image_position: 'main',
        is_required: false,
        org_id: '00000000-0000-0000-0000-000000000001'
      });
    }

    // Insert media assets
    if (mediaAssets.length > 0) {
      const { error: mediaError } = await supabase
        .from('media_assets')
        .insert(mediaAssets);

      if (mediaError) {
        console.error('Media assets error:', mediaError);
        // Don't fail the entire submission for media errors
      }
    }

    console.log('Comprehensive submission created successfully:', {
      submissionId: quoteData.id,
      publicToken: quoteData.public_token,
      vehicle: `${carData.year} ${carData.make_model}`,
      ip: clientIP,
      timestamp: new Date().toISOString()
    });

    // Send confirmation email
    try {
      const { sendSubmissionConfirmationEmail } = await import('@/lib/email-service');
      const trackingUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/track-quote/${quoteData.public_token}`;
      const vehicleSummary = `${carData.year} ${carData.make_model}`;
      const estimatedValue = carData.estimated_value || 'Calculating...';
      
      await sendSubmissionConfirmationEmail(
        customerData.email,
        customerData.name,
        vehicleSummary,
        carData.mileage,
        estimatedValue,
        quoteData.id,
        trackingUrl
      );
      
      console.log('Confirmation email sent successfully to:', customerData.email);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the submission if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Your comprehensive submission has been received! Our team will review all the details and get back to you with a detailed offer.',
      public_token: quoteData.public_token,
      submission_id: quoteData.id,
      estimated_response_time: '24 hours',
      confirmation_url: `/submission-confirmation?id=${quoteData.id}`
    });

  } catch (error) {
    console.error('Comprehensive submission error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to submit comprehensive car information. Please try again.' },
      { status: 500 }
    );
  }
}

async function handleLegacySubmission(submissionData: CarSubmissionData, clientIP: string) {
  try {
    // Initialize Supabase client
    const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { customer, vehicle, valuation, photos } = submissionData;

    // Check for disposable email
    if (isDisposableEmail(customer.email)) {
      return NextResponse.json(
        { error: 'Please use a valid email address.' },
        { status: 400 }
      );
    }

    // Check for existing customer or create new one
    let customerData;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customer.email)
      .eq('org_id', '00000000-0000-0000-0000-000000000001')
      .single();

    if (existingCustomer) {
      // Update existing customer
      const { data: updatedCustomer, error: updateError } = await supabase
        .from('customers')
        .update({
          name: customer.name,
          phone: customer.phone,
          address: customer.address,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCustomer.id)
        .select()
        .single();

      if (updateError) {
        console.error('Customer update error:', updateError);
        throw new Error('Failed to update customer record');
      }
      customerData = updatedCustomer;
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert([{
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          org_id: '00000000-0000-0000-0000-000000000001'
        }])
        .select()
        .single();

      if (customerError) {
        console.error('Customer creation error:', customerError);
        throw new Error('Failed to create customer record');
      }
      customerData = newCustomer;
    }

    // Check for existing vehicle or create new one
    let vehicleData;
    if (vehicle.vin) {
      const { data: existingVehicle } = await supabase
        .from('vehicles')
        .select('*')
        .eq('vin', vehicle.vin)
        .eq('org_id', '00000000-0000-0000-0000-000000000001')
        .single();

      if (existingVehicle) {
        // Update existing vehicle
        const { data: updatedVehicle, error: updateError } = await supabase
          .from('vehicles')
          .update({
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            mileage: vehicle.mileage,
            color: vehicle.color,
            condition: vehicle.condition,
            additional_info: vehicle.additional_notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingVehicle.id)
          .select()
          .single();

        if (updateError) {
          console.error('Vehicle update error:', updateError);
          throw new Error('Failed to update vehicle record');
        }
        vehicleData = updatedVehicle;
      } else {
        // Create new vehicle
        const { data: newVehicle, error: vehicleError } = await supabase
          .from('vehicles')
          .insert([{
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            vin: vehicle.vin,
            mileage: vehicle.mileage,
            color: vehicle.color,
            condition: vehicle.condition,
            additional_info: vehicle.additional_notes,
            org_id: '00000000-0000-0000-0000-000000000001'
          }])
          .select()
          .single();

        if (vehicleError) {
          console.error('Vehicle creation error:', vehicleError);
          throw new Error('Failed to create vehicle record');
        }
        vehicleData = newVehicle;
      }
    } else {
      // Create new vehicle without VIN
      const { data: newVehicle, error: vehicleError } = await supabase
        .from('vehicles')
        .insert([{
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          vin: null,
          mileage: vehicle.mileage,
          color: vehicle.color,
          condition: vehicle.condition,
          additional_info: vehicle.additional_notes,
          org_id: '00000000-0000-0000-0000-000000000001'
        }])
        .select()
        .single();

      if (vehicleError) {
        console.error('Vehicle creation error:', vehicleError);
        throw new Error('Failed to create vehicle record');
      }
      vehicleData = newVehicle;
    }

    // Create quote submission
    const { data: quoteData, error: quoteError } = await supabase
      .from('quote_submissions')
      .insert([{
        customer_id: customerData.id,
        vehicle_id: vehicleData.id,
        estimated_value: valuation.estimated_value,
        additional_notes: vehicle.additional_notes,
        status: 'pending_review',
        submission_step: 'completed',
        org_id: '00000000-0000-0000-0000-000000000001'
      }])
      .select()
      .single();

    if (quoteError) {
      console.error('Quote submission error:', quoteError);
      throw new Error('Failed to create quote submission');
    }

    // Create media assets for photos
    if (photos && photos.length > 0) {
      const mediaAssets = photos.map(photo => ({
        quote_submission_id: quoteData.id,
        file_name: photo.filename,
        file_path: `/uploads/${quoteData.id}/${photo.filename}`,
        file_type: photo.type,
        file_size: photo.size,
        mime_type: photo.type,
        category: photo.category,
        image_type: photo.category,
        image_position: 'main',
        is_required: false,
        org_id: '00000000-0000-0000-0000-000000000001'
      }));

      const { error: mediaError } = await supabase
        .from('media_assets')
        .insert(mediaAssets);

      if (mediaError) {
        console.error('Media assets error:', mediaError);
        // Don't fail the entire submission for media errors
      }
    }

    console.log('Legacy submission created successfully:', {
      submissionId: quoteData.id,
      publicToken: quoteData.public_token,
      vehicle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      ip: clientIP,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: 'Your car submission has been received! Our team will review your vehicle and get back to you with a detailed offer.',
      public_token: quoteData.public_token,
      submission_id: quoteData.id,
      estimated_response_time: '24 hours'
    });

  } catch (error) {
    console.error('Legacy submission error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to submit car information. Please try again.' },
      { status: 500 }
    );
  }
}
