import { PublicLayout } from "@/components/layouts/public-layout";
import Link from "next/link";

export default function About() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
            About <span className="text-primary">CarSellMax</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            We&apos;re revolutionizing the way people sell their vehicles. 
            Fast, fair, and hassle-free car buying since 2020.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-base sm:prose-lg mx-auto max-w-none">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Our Story</h2>
            <div className="space-y-4 sm:space-y-6 text-base sm:text-lg">
              <p className="text-muted-foreground leading-relaxed">
                CarSellMax was founded with a simple mission: to make selling your vehicle as easy as possible. 
                We noticed that traditional car selling methods were time-consuming, stressful, and often 
                resulted in unfair prices for sellers.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our team of automotive experts and technology professionals came together to create a 
                solution that puts the seller first. We use advanced valuation algorithms, market data, 
                and our extensive industry knowledge to ensure you get the best possible price for your vehicle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 sm:py-20 md:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Our Values</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              These core principles guide everything we do at CarSellMax.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Transparency</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">No hidden fees, no surprises. We believe in honest, upfront pricing.</p>
            </div>
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Speed</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Get your quote in minutes, not hours. We value your time.</p>
            </div>
            <div className="text-center bg-background rounded-lg p-6 sm:p-8 shadow-sm sm:col-span-2 md:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Customer First</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Your satisfaction is our priority. We&apos;re here to help every step of the way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose CarSellMax */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Why Choose CarSellMax?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We&apos;ve helped thousands of customers sell their vehicles quickly and profitably.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Experience You Can Trust</h3>
              <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5 flex-shrink-0">✓</span>
                  <span className="leading-relaxed">Over 10,000 vehicles purchased since 2020</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5 flex-shrink-0">✓</span>
                  <span className="leading-relaxed">Average 24-hour turnaround from quote to payment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5 flex-shrink-0">✓</span>
                  <span className="leading-relaxed">Licensed and insured in all states we operate</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5 flex-shrink-0">✓</span>
                  <span className="leading-relaxed">A+ rating with the Better Business Bureau</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2 mt-0.5 flex-shrink-0">✓</span>
                  <span className="leading-relaxed">Free vehicle pickup and paperwork handling</span>
                </li>
              </ul>
            </div>
            <div className="bg-card border rounded-lg p-6 sm:p-8">
              <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Ready to Get Started?</h4>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                Join thousands of satisfied customers who chose CarSellMax for their vehicle sale.
              </p>
              <Link 
                href="/sell-car"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium transition-colors inline-block text-center text-sm sm:text-base"
              >
                Get My Quote Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
