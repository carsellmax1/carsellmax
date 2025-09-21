import { PublicLayout } from "@/components/layouts/public-layout";
import { HeroSection } from "@/components/homepage/hero-section";
import { QuickValuationCTA } from "@/components/homepage/quick-valuation-cta";
import Image from "next/image";

export default function SellMySUV() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <HeroSection 
        vehicleType="SUV"
        title="Sell Your <span class='text-primary'>SUV</span> Today"
        description="Get top dollar for your SUV or crossover. We buy family SUVs, luxury models, and off-road vehicles."
        heroImage="/hero-suv.jpg"
        features={["All SUV Types", "Luxury & Economy", "High Mileage OK"]}
      />

      {/* Why Choose Us for SUVs */}
      <section className="py-12 sm:py-14 md:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">SUV Specialists</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              We understand the SUV market and provide competitive pricing for all types of sport utility vehicles and crossovers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Family SUV Experts</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                We understand the value of family SUVs and their importance for growing families.
              </p>
            </div>
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Luxury SUV Buyers</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                From BMW X5s to Cadillac Escalades, we buy high-end SUVs with competitive luxury pricing.
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
                High mileage crossovers or well-maintained luxury SUVs - we buy them all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SUV Types */}
      <section className="py-12 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">We Buy All Types of SUVs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: "Compact SUVs", description: "CR-V, RAV4, Escape, and similar" },
              { title: "Mid-Size SUVs", description: "Pilot, Highlander, Explorer" },
              { title: "Full-Size SUVs", description: "Tahoe, Suburban, Expedition" },
              { title: "Luxury SUVs", description: "BMW X5, Mercedes GLE, Lexus GX" }
            ].map((type, index) => (
              <div key={index} className="bg-card border rounded-lg p-4 sm:p-6 text-center">
                <h3 className="font-semibold mb-2 text-sm sm:text-base">{type.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular SUV Brands */}
      <section className="py-12 sm:py-14 md:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Popular SUV Brands We Buy</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              From compact crossovers to luxury SUVs, we purchase all major SUV brands.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {[
              { name: "Toyota", logo: "Toyota.svg" },
              { name: "Honda", logo: "Honda.svg" },
              { name: "Ford", logo: "Ford.svg" },
              { name: "Chevrolet", logo: "Chevrolet.svg" },
              { name: "Nissan", logo: "Nissan.svg" },
              { name: "Jeep", logo: "Jeep.svg" },
              { name: "BMW", logo: "BMW.svg" },
              { name: "Mercedes", logo: "Mercedes Benz.svg" },
              { name: "Audi", logo: "Audi.svg" },
              { name: "Lexus", logo: "Lexus.svg" },
              { name: "Acura", logo: "Acura.svg" },
              { name: "Infiniti", logo: "Infiniti.svg" },
              { name: "Cadillac", logo: "Cadillac.svg" },
              { name: "Lincoln", logo: "Lincoln.svg" },
              { name: "Volvo", logo: "Volvo.svg" },
              { name: "Mazda", logo: "Mazda.svg" },
              { name: "Subaru", logo: "Subaru.svg" },
              { name: "Hyundai", logo: "Hyundai.svg" }
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
              Family crossovers, luxury SUVs, and everything in between - we buy them all!
            </p>
          </div>
        </div>
      </section>

      {/* Quick Valuation CTA */}
      <QuickValuationCTA
        title="Ready to Sell Your SUV?"
        subtitle="Get your instant valuation now"
        description="Get a competitive quote for your SUV today. Family crossovers, luxury SUVs, and everything in between."
      />
    </PublicLayout>
  );
}



