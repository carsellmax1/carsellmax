import { PublicLayout } from "@/components/layouts/public-layout";
import { HeroSection } from "@/components/homepage/hero-section";
import { QuickValuationCTA } from "@/components/homepage/quick-valuation-cta";
import Image from "next/image";

export default function SellMyVan() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <HeroSection 
        vehicleType="Van"
        title="Sell Your <span class='text-primary'>Van</span> Today"
        description="Get top dollar for your van, minivan, or cargo van. We buy passenger vans, commercial vehicles, and family minivans."
        heroImage="/hero-van.jpg"
        features={["All Van Types", "Commercial & Personal", "High Mileage OK"]}
      />

      {/* Why Choose Us for Vans */}
      <section className="py-12 sm:py-14 md:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Van Specialists</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              We understand the van market - from family minivans to commercial cargo vans and everything in between.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Family Van Experts</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We understand the value of family minivans and their importance for growing families.
              </p>
            </div>
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Commercial Vehicle Buyers</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We buy cargo vans, work vans, and commercial vehicles with competitive business pricing.
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
                High mileage commercial vans or well-maintained family vans - we buy them all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Van Types */}
      <section className="py-12 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">We Buy All Types of Vans</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: "Minivans", description: "Family passenger vans and minivans" },
              { title: "Cargo Vans", description: "Commercial delivery and cargo vans" },
              { title: "Passenger Vans", description: "Large capacity passenger vans" },
              { title: "Conversion Vans", description: "Custom and recreational vans" }
            ].map((type, index) => (
              <div key={index} className="bg-card border rounded-lg p-4 sm:p-6 text-center">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">{type.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Van Brands */}
      <section className="py-12 sm:py-14 md:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Popular Van Brands We Buy</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              From family minivans to commercial cargo vans, we purchase all major van brands.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {[
              { name: "Honda", logo: "Honda.svg" },
              { name: "Toyota", logo: "Toyota.svg" },
              { name: "Ford", logo: "Ford.svg" },
              { name: "Chevrolet", logo: "Chevrolet.svg" },
              { name: "Nissan", logo: "Nissan.svg" },
              { name: "Mercedes", logo: "Mercedes Benz.svg" },
              { name: "RAM", logo: "RAM.svg" },
              { name: "GMC", logo: "GMC.svg" },
              { name: "Dodge", logo: "Dodge.svg" },
              { name: "Hyundai", logo: "Hyundai.svg" },
              { name: "Kia", logo: "Kia.svg" },
              { name: "Volkswagen", logo: "Volkswagen.svg" }
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
              Family minivans, cargo vans, and commercial vehicles - we buy them all!
            </p>
          </div>
        </div>
      </section>

      {/* Quick Valuation CTA */}
      <QuickValuationCTA
        title="Ready to Sell Your Van?"
        subtitle="Get your instant valuation now"
        description="Get a competitive quote for your van today. Family minivans, cargo vans, and everything in between."
      />
    </PublicLayout>
  );
}



