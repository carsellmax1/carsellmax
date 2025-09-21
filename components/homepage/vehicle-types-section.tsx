"use client";

import React from "react";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { CalendarIcon } from "lucide-react";

interface CarListing {
  name: string;
  miles: string;
  location: string;
  value: string;
  year: string;
  image: string;
}

interface CarListingsProps {
  carListings?: CarListing[];
}

// Fallback data using actual car images we have
const fallbackCarListings: CarListing[] = [
  {
    name: "2020 Toyota Camry",
    miles: "45,000 miles",
    location: "Los Angeles, CA",
    value: "$18,500",
    year: "2020",
    image: "/cars/toyota-camry.jpg"
  },
  {
    name: "2021 Honda CR-V",
    miles: "32,000 miles",
    location: "San Francisco, CA",
    value: "$22,000",
    year: "2021",
    image: "/cars/crv.png"
  },
  {
    name: "2019 Ford Fusion",
    miles: "58,000 miles",
    location: "Austin, TX",
    value: "$15,000",
    year: "2019",
    image: "/cars/ford-fusion.jpg"
  },
  {
    name: "2022 Nissan Altima",
    miles: "28,000 miles",
    location: "Miami, FL",
    value: "$24,500",
    year: "2022",
    image: "/cars/nissan-altima.jpg"
  }
];

export const CarLists = ({ carListings: propCarListings }: CarListingsProps) => {
  const carListings = propCarListings || fallbackCarListings;

  return (
    <section className="w-full bg-background py-12 sm:py-16 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
            Recently Valued Cars in Your Area
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            Explore real, recent car valuations from local sellers just like you. See what your neighbors are getting for their vehicles and get inspired to check yours today!
          </p>
        </div>

        {/* Car Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1,
          }}
          className="w-full relative"
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {carListings.map((car: CarListing, index: number) => (
              <CarouselItem 
                key={index} 
                className="pl-3 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <div className="relative w-full bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                  {/* Image with consistent AspectRatio */}
                  <div className="relative overflow-hidden">
                    <AspectRatio ratio={4/3} className="w-full">
                      <Image
                        src={car.image}
                        alt={car.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority={index === 0}
                      />
                    </AspectRatio>
                    
                    {/* Year Badge - positioned properly within image area */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold py-1.5 px-3 rounded-full flex items-center gap-1.5 shadow-lg">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{car.year}</span>
                      </div>
                    </div>

                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground leading-tight mb-3">
                      {car.name}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{car.miles}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{car.location}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-medium">Estimated Value</span>
                        <span className="text-xl sm:text-2xl font-bold text-primary">
                          {car.value}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Arrows */}
          <div className="hidden md:flex justify-center gap-2 mt-8">
            <CarouselPrevious className="relative left-0 top-0 translate-y-0 bg-background border-border hover:bg-muted hover:border-primary/50 transition-colors" />
            <CarouselNext className="relative right-0 top-0 translate-y-0 bg-background border-border hover:bg-muted hover:border-primary/50 transition-colors" />
          </div>
          
          {/* Mobile navigation dots could be added here if needed */}
        </Carousel>
      </div>
    </section>
  );
};
