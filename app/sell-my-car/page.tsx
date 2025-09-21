import { PublicLayout } from "@/components/layouts/public-layout";
import { HeroSection } from "@/components/homepage/hero-section";
import { QuickValuationCTA } from "@/components/homepage/quick-valuation-cta";
import Link from "next/link";
import Image from "next/image";

export default function SellMyCar() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <HeroSection 
        vehicleType="Car"
        title="Sell Your <span class='text-primary'>Car</span> Today"
        description="Get an instant quote for your car and complete the sale in 24 hours. No haggling, no hassle, just fair prices."
        heroImage="/hero-car-new.jpg"
        features={["Instant Online Quote", "Free Vehicle Pickup", "Same Day Payment"]}
      />

      {/* Why Choose Us for Cars */}
      <section className="py-12 sm:py-14 md:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Why Sell Your Car to CarSellMax?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              We specialize in buying all types of cars, from economy to luxury vehicles.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Fair Market Value</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Our pricing algorithm analyzes current market data to ensure you get top dollar for your car.
              </p>
            </div>
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Quick Process</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                From quote to payment in 24 hours. No waiting weeks for a buyer or dealing with test drives.
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
                Running or not, we buy cars in any condition. Accident damage, high mileage, or mechanical issues - we&apos;ll take it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Car Brands We Buy */}
      <section className="py-12 sm:py-14 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">We Buy All Car Makes & Models</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              From economy cars to luxury vehicles, we purchase all brands and models.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
            {[
              { name: "Toyota", logo: "Toyota.svg" },
              { name: "Honda", logo: "Honda.svg" },
              { name: "Ford", logo: "Ford.svg" },
              { name: "Chevrolet", logo: "Chevrolet.svg" },
              { name: "Nissan", logo: "Nissan.svg" },
              { name: "BMW", logo: "BMW.svg" },
              { name: "Mercedes", logo: "Mercedes Benz.svg" },
              { name: "Audi", logo: "Audi.svg" },
              { name: "Volkswagen", logo: "Volkswagen.svg" },
              { name: "Hyundai", logo: "Hyundai.svg" },
              { name: "Kia", logo: "Kia.svg" },
              { name: "Mazda", logo: "Mazda.svg" },
              { name: "Subaru", logo: "Subaru.svg" },
              { name: "Acura", logo: "Acura.svg" },
              { name: "Lexus", logo: "Lexus.svg" },
              { name: "Infiniti", logo: "Infiniti.svg" },
              { name: "Volvo", logo: "Volvo.svg" },
              { name: "Jeep", logo: "Jeep.svg" }
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
              Don&apos;t see your car&apos;s make? <Link href="/contact" className="text-primary hover:underline">Contact us</Link> - we buy all brands!
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-14 md:py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-background border rounded-lg p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="flex text-primary">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                &quot;Sold my 2018 Honda Civic in less than a day! The process was incredibly smooth and the price was fair. Much better than dealing with dealerships.&quot;
              </p>
              <p className="font-semibold text-sm sm:text-base">- Sarah M.</p>
            </div>
            <div className="bg-background border rounded-lg p-4 sm:p-6">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="flex text-primary">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                &quot;My car had some mechanical issues but CarSellMax still gave me a great offer. They handled all the paperwork and picked it up from my driveway.&quot;
              </p>
              <p className="font-semibold text-sm sm:text-base">- Mike R.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Valuation CTA */}
      <QuickValuationCTA
        title="Ready to Sell Your Car?"
        subtitle="Get your instant valuation now"
        description="Join thousands of satisfied customers who got top dollar for their vehicles. Start with our free, no-obligation quote today."
      />
    </PublicLayout>
  );
}



