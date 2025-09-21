import { PublicLayout } from "@/components/layouts/public-layout";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { QuickValuationCTA } from "@/components/homepage/quick-valuation-cta";

export default function HowItWorks() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Desktop aspect ratio */}
        <div className="hidden md:block">
          <AspectRatio ratio={16/9} className="w-full">
            <div className="relative w-full h-full">
              <Image
                src="/images/hero-how-it-works.jpg"
                alt="Car background"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-white/30"></div>
            </div>
          </AspectRatio>
        </div>
        
        {/* Mobile aspect ratio */}
        <div className="block md:hidden">
          <AspectRatio ratio={4/3} className="w-full">
            <div className="relative w-full h-full">
              <Image
                src="/images/hero-how-it-works.jpg"
                alt="Car background"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-white/30"></div>
            </div>
          </AspectRatio>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 text-white">
              Selling your car has never been easier
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 max-w-xl md:max-w-2xl mx-auto leading-relaxed">
              CarSellMax makes selling your car fast, fair, and stress-free. Get an instant valuation, accept the best offer, and enjoy free home collection with same-day payment.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3 sm:mb-4 md:mb-6">
              How CarSellMax Works – Fast, Fair & Easy
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl md:max-w-2xl mx-auto">
              A simple 4-step process to sell your car hassle-free.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20 xl:space-y-24">
            {/* Step 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
              <div className="order-1 lg:order-1">
                <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 md:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary text-white rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 md:mr-6 flex-shrink-0">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Get your instant valuation</h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  Provide your car&apos;s VIN, mileage, and details. We&apos;ll instantly scan real-time market data to give you an accurate valuation.
                </p>
              </div>
              <div className="order-2 lg:order-2">
                <AspectRatio ratio={4/3} className="w-full">
                  <Image
                    src="/images/step-1-valuation.jpg"
                    alt="Get instant valuation"
                    fill
                    className="object-cover rounded-lg"
                  />
                </AspectRatio>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
              <div className="order-1 lg:order-2">
                <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 md:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary text-white rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 md:mr-6 flex-shrink-0">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Accept the best offer</h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  We&apos;ll search top sources for the highest offer available—so you don&apos;t have to.
                </p>
              </div>
              <div className="order-2 lg:order-1">
                <AspectRatio ratio={4/3} className="w-full">
                  <Image
                    src="/images/step-2-offer.jpg"
                    alt="Accept the best offer"
                    fill
                    className="object-cover rounded-lg"
                  />
                </AspectRatio>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
              <div className="order-1 lg:order-1">
                <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 md:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary text-white rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 md:mr-6 flex-shrink-0">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Free home collection</h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  Schedule a pickup that&apos;s convenient for you. Our team will collect your car for free—no hidden fees.
                </p>
              </div>
              <div className="order-2 lg:order-2">
                <AspectRatio ratio={4/3} className="w-full">
                  <Image
                    src="/images/step-3-collection.jpg"
                    alt="Free home collection"
                    fill
                    className="object-cover rounded-lg"
                  />
                </AspectRatio>
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center">
              <div className="order-1 lg:order-2">
                <div className="flex flex-col sm:flex-row sm:items-center mb-3 sm:mb-4 md:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary text-white rounded-full flex items-center justify-center mb-3 sm:mb-0 sm:mr-4 md:mr-6 flex-shrink-0">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold">4</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">Get paid the same day</h3>
                </div>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
                  Once we collect your car, you&apos;ll receive your payment immediately—fast and secure.
                </p>
              </div>
              <div className="order-2 lg:order-1">
                <AspectRatio ratio={4/3} className="w-full">
                  <Image
                    src="/images/step-4-paid.jpg"
                    alt="Free home collection"
                    fill
                    className="object-cover rounded-lg"
                  />
                </AspectRatio>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Valuation CTA */}
      <QuickValuationCTA
        title="Start Your Valuation"
        subtitle="See what your car is worth today"
        description="Enter your VIN, plate, or vehicle details to get an instant market valuation. Free, fast, and no obligations."
      />

     
    </PublicLayout>
  );
}
