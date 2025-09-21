import { PublicLayout } from "@/components/layouts/public-layout";
import { HeroSection } from "@/components/homepage/hero-section";
import { QuickValuationCTA } from "@/components/homepage/quick-valuation-cta";
import Image from "next/image";

export default function SellMyTruck() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <HeroSection 
        vehicleType="Truck"
        title="Sell Your <span class='text-primary'>Truck</span> Today"
        description="Get top dollar for your pickup truck, work truck, or commercial vehicle. We buy all truck types and conditions."
        heroImage="/hero-truck.jpg"
        features={["All Truck Types", "Work & Personal", "High Mileage OK"]}
      />

      {/* Why Choose Us for Trucks */}
      <section className="py-12 sm:py-14 md:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Truck Specialists</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              We understand the truck market and provide competitive pricing for all types of pickup trucks and commercial vehicles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Work Truck Buyers</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We specialize in commercial trucks and understand their value for business operations.
              </p>
            </div>
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Personal Truck Experts</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                From weekend haulers to daily drivers, we buy all personal pickup trucks.
              </p>
            </div>
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm md:col-span-3 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">All Conditions</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                High mileage work trucks or well-maintained personal trucks - we buy them all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Truck Brands */}
      <section className="py-12 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Popular Truck Brands We Buy</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              From pickup trucks to commercial vehicles, we purchase all major truck brands.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {[
              { name: "Ford", logo: "Ford.svg" },
              { name: "Chevrolet", logo: "Chevrolet.svg" },
              { name: "RAM", logo: "RAM.svg" },
              { name: "GMC", logo: "GMC.svg" },
              { name: "Toyota", logo: "Toyota.svg" },
              { name: "Nissan", logo: "Nissan.svg" },
              { name: "Honda", logo: "Honda.svg" },
              { name: "Jeep", logo: "Jeep.svg" },
              { name: "Mazda", logo: "Mazda.svg" },
              { name: "Mitsubishi", logo: "Mitsubishi.svg" },
              { name: "Dodge", logo: "Dodge.svg" },
              { name: "Cadillac", logo: "Cadillac.svg" }
            ].map((brand, index) => (
              <div key={index} className="p-4 sm:p-6 bg-background border rounded-xl hover:border-primary/50 hover:shadow-md transition-all duration-300 group">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
                    <Image
                      src={`/cars/logos svg/${brand.logo}`}
                      alt={`${brand.name} logo`}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="font-medium text-sm sm:text-base text-center">{brand.name}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <p className="text-sm sm:text-base text-muted-foreground">
              Commercial trucks, pickup trucks, and work vehicles - we buy them all!
            </p>
          </div>
        </div>
      </section>

      {/* Quick Valuation CTA */}
      <QuickValuationCTA
        title="Ready to Sell Your Truck?"
        subtitle="Get your instant valuation now"
        description="Get a competitive quote for your truck today. Work trucks, pickups, and commercial vehicles - we buy them all."
      />
    </PublicLayout>
  );
}



