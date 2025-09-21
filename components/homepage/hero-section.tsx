"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Loader2 } from "lucide-react";
import { useCarStore } from '@/lib/car-store';
import { useImageLoading } from "@/lib/hooks/use-image-loading";
import { useRouter } from "next/navigation";

const placeholderMap = {
  VIN: "VIN Number",
};

interface HeroSectionProps {
  vehicleType?: string;
  title?: string;
  description?: string;
  heroImage?: string;
  features?: string[];
}

function ImageWithLoading({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const { isLoading, error } = useImageLoading(src);

  if (isLoading) {
    return (
      <div className={`${className} bg-muted animate-pulse rounded-lg flex items-center justify-center`}>
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-muted rounded-lg flex items-center justify-center`}>
        <span className="text-muted-foreground text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`${className} object-cover`}
      priority
      sizes="(max-width: 768px) 246px, 534px"
      quality={90}
    />
  );
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  vehicleType = "car",
  title = "Sell my car.<br />Fast, fair and<br />no fuss.",
  description = "Get a free valuation, get the best offer and free home collection with same-day payment.",
  heroImage = "/hero-car-new.jpg",
  features = ["Instant Online Quote", "Free Vehicle Pickup", "Same Day Payment"]
}) => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [mileage, setMileage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingImages, setLoadingImages] = useState(false);
  
  const {
    carFound,
    foundCar: car,
    setCarFound,
    setFoundCar,
    setImageUrl,
    imageUrl,
    vehicleImage,
    setVehicleImage,
    setVin,
    setMileage: setStoreMileage,
    setValuation: setStoreValuation,
    reset: resetStore,
    setMarketData,
  } = useCarStore();

  // Function to fetch vehicle images using SerpAPI
  const fetchVehicleImages = async (year: string, make: string, model: string) => {
    setLoadingImages(true);
    try {
      const response = await fetch('/api/vehicle-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, make, model })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.images.length > 0) {
          // Save the first image to local storage and state
          const firstImage = result.images[0];
          console.log('Setting vehicle image:', firstImage.url);
          setVehicleImage(firstImage.url);
          localStorage.setItem('vehicleImage', firstImage.url);
          console.log('Vehicle image saved to local storage');
        } else {
          console.log('No vehicle images found, using fallback');
          setVehicleImage('');
          localStorage.removeItem('vehicleImage');
        }
      } else {
        console.error('Failed to fetch vehicle images');
        setVehicleImage('');
        localStorage.removeItem('vehicleImage');
      }
    } catch (error) {
      console.error('Error fetching vehicle images:', error);
      setVehicleImage('');
      localStorage.removeItem('vehicleImage');
    } finally {
      setLoadingImages(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Clear previous vehicle image and data
    setVehicleImage('');
    localStorage.removeItem('vehicleImage');
    setMileage('');

    try {
      if (!searchInput) {
        throw new Error("Please enter a VIN number");
      }
      // Basic VIN validation
      if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(searchInput)) {
        throw new Error("Invalid VIN format. VIN should be 17 characters long and contain only letters (except I, O, Q) and numbers.");
      }

      // Create an AbortController for the fetch requests
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      try {
        // First fetch car data
        const response = await fetch('/api/search/vin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vin: searchInput }),
          signal: controller.signal
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || 'Failed to search vehicle');
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("No vehicle found. Please try again.");
        }

        // Store initial car data
        setVin(searchInput);
        const carData = result.data;
        
        // Set car data first
        setFoundCar(carData);
        setCarFound(true);
        setError("");

        clearTimeout(timeout);

        // Fetch vehicle images in the background (don't block the UI)
        fetchVehicleImages(carData.year, carData.make, carData.model);

      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      }
    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setFoundCar({
        id: '',
        vin: '',
        makeModel: '',
        make: '',
        model: '',
        year: '',
        color: '',
        bodyType: '',
        fuelType: '',
      });
      setCarFound(false);
      setImageUrl(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMileageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!car) {
        throw new Error("No car data available");
      }

      const mileageNum = parseInt(mileage.replace(/,/g, ''), 10);
      if (isNaN(mileageNum)) {
        throw new Error("Please enter a valid mileage number");
      }

      setMileage(mileageNum.toLocaleString());

      // Make market search API call
      const response = await fetch('/api/market-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          year: car.year,
          make: car.make,
          model: car.model,
          mileage: mileageNum,
          vin: car.vin,
          condition: 'good' // Default condition, can be enhanced later
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get market value');
      }

      const marketData = await response.json();
      
      // Store market data and valuation
      const valuation = parseInt(marketData.estimatedPrice.replace(/[$,]/g, ''));
      setStoreValuation(valuation);
      setStoreMileage(mileage);
      setMarketData({
        kbb_value: marketData.kbb_fair_value || 'N/A',
        edmunds_value: marketData.edmunds_value || 'N/A',
        carmax_value: marketData.carmax_value || 'N/A',
        carvana_value: marketData.carvana_value || 'N/A',
        confidence: marketData.confidence || 'medium',
        explanation: marketData.explanation || '',
        external_data: marketData.marketData || null,
        data_sources: marketData.marketData ? Object.keys(marketData.marketData).filter(key => key !== 'average' && key !== 'range') : []
      });

      // Navigate to valuation result page
      router.push('/valuation-result');
    } catch (err) {
      console.error('Mileage error:', err);
      setError(err instanceof Error ? err.message : "Failed to process mileage");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d,]/g, "");
    setMileage(value);
    setError("");
  };

  if (carFound && car) {
    return (
      <section className="w-full flex flex-col items-center bg-background dark:bg-background pt-8 pb-4 px-4 md:pt-16 md:pb-8 md:px-0">
        <div className="max-w-[1066px] w-full flex flex-col md:flex-row items-start justify-between gap-8">
          {/* Left: Content and form */}
          <div className="flex-1 min-w-0 flex flex-col items-center md:items-start justify-start">
            <h2 
              className="text-2xl md:text-3xl font-bold text-center md:text-left text-foreground mb-2" 
              tabIndex={0} 
              aria-label={car.makeModel}
            >
              {car.makeModel}
            </h2>
            <div className="text-base md:text-lg text-center md:text-left text-muted-foreground mb-2">
              {[
                car.year,
                car.color !== "Unknown" && car.color,
                car.bodyType !== "Unknown" && car.bodyType,
                car.fuelType !== "Unknown" && car.fuelType
              ].filter(Boolean).join(" – ")}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    resetStore();
                    setSearchInput("");
                    setError("");
                    localStorage.removeItem('vehicleImage');
                  }}
                  className="underline text-primary ml-1 hover:text-primary/80 transition-colors" 
                  tabIndex={0} 
                  aria-label="Not your car?"
                >
                  Not your {vehicleType.toLowerCase()}?
                </button>
              </div>
            </div>
            
            {/* Mileage input */}
            <form 
              className="w-full flex flex-col items-center md:items-start mt-6" 
              onSubmit={handleMileageSubmit}
            >
              <label 
                htmlFor="mileage" 
                className="text-muted-foreground text-base md:text-lg mb-2"
              >
                Your mileage
              </label>
              <div className="w-full max-w-[338px]">
                <input
                  id="mileage"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9,]*"
                  placeholder="e.g 50,000"
                  value={mileage}
                  onChange={handleMileageChange}
                  className="w-full bg-background dark:bg-card border border-border rounded-lg px-3 py-2 text-[20px] text-foreground placeholder:text-muted-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Enter your mileage"
                  tabIndex={0}
                />
                {error && (
                  <p className="text-red-500 text-sm mb-4">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium h-[38px] flex items-center justify-center gap-2"
                  tabIndex={0}
                  aria-label="Confirm Mileage"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Mileage
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
          {/* Right: Car image with selection */}
          <div className="w-full max-w-[246px] md:max-w-[534px] flex flex-col justify-center md:justify-end md:mt-[50px] mx-auto">
            <AspectRatio ratio={16/9} className="w-full mb-4">
              <div className="relative w-full h-full">
                {loadingImages ? (
                  <div className="w-full h-full bg-muted animate-pulse rounded-lg flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : vehicleImage ? (
                  <ImageWithLoading
                    src={vehicleImage}
                    alt={car ? `${car.year} ${car.makeModel}` : `Vehicle image`}
                    className="rounded-lg"
                  />
                ) : (
                  <ImageWithLoading
                    src={imageUrl || heroImage}
                    alt={car ? `${car.year} ${car.makeModel}` : `Hero ${vehicleType}`}
                    className="rounded-lg"
                  />
                )}
              </div>
            </AspectRatio>
            
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col items-center bg-background dark:bg-background pt-8 pb-4 px-4 md:pt-16 md:pb-8 md:px-0">
      <div className="max-w-[1066px] w-full flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Left: Content and form */}
        <div className="flex-1 min-w-0 flex flex-col items-center md:items-start justify-start">
          <h1 
            className="mb-3 text-center md:text-left text-foreground font-semibold text-[40px] md:text-[60px] leading-tight tracking-tight max-w-[406px]"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <p className="text-muted-foreground mb-4 max-w-[362px] text-center md:text-left text-base tracking-[0.5px] leading-[1.5]">
            {description}
          </p>
          
          {/* Features */}
          {features && features.length > 0 && (
            <div className="flex flex-wrap justify-center md:justify-start gap-4 sm:gap-6 text-sm mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-primary mr-2">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          )}

          {/* Search Bar */}
          <form id="valuation-form" className="w-full max-w-[338px]" onSubmit={handleSearch}>
            <div className="flex items-end gap-3 w-full">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={placeholderMap.VIN}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full bg-background dark:bg-card border-border text-sm text-foreground placeholder:text-muted-foreground px-3 py-2"
                  aria-label={placeholderMap.VIN}
                />
              </div>
              <Button
                variant="default"
                aria-label={`Value your ${vehicleType.toLowerCase()}`}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium h-[38px] flex items-center gap-2"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    Value your {vehicleType.toLowerCase()}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </form>
        </div>
        {/* Right: Hero Image */}
        <div className="w-full max-w-[246px] md:max-w-[534px] flex justify-center md:justify-end md:mt-[50px] mx-auto">
          <AspectRatio ratio={16/9} className="w-full">
            <div className="relative w-full h-full">
              <ImageWithLoading
                src={heroImage}
                alt={`Hero ${vehicleType}`}
                className="rounded-lg"
              />
            </div>
          </AspectRatio>
        </div>
      </div>
    </section>
  );
};
