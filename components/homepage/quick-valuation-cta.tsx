import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface QuickValuationCTAProps {
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

export const QuickValuationCTA: React.FC<QuickValuationCTAProps> = ({
  title = "Get Your Car's Value",
  subtitle = "Get instant alerts on your car's market value",
  description = "Ready to see what your car is worth? Get started with our free valuation tool.",
  className = ""
}) => {

  return (
    <section className={`py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-muted/30 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 text-primary">
            {title}
          </h2>
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 md:mb-6">
            {subtitle}
          </h3>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 md:mb-12 max-w-xl md:max-w-2xl mx-auto opacity-70">
            {description}
          </p>
        </div>

        {/* CTA Button */}
        <div className="mb-6 sm:mb-8">
          <Link href="/#valuation-form">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium transition-colors inline-flex items-center gap-2">
              Start Your Valuation
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center">
            <span className="text-primary mr-2">✓</span>
            <span>Instant Results</span>
          </div>
          <div className="flex items-center">
            <span className="text-primary mr-2">✓</span>
            <span>No Spam</span>
          </div>
          <div className="flex items-center">
            <span className="text-primary mr-2">✓</span>
            <span>100% Free</span>
          </div>
        </div>
      </div>
    </section>
  );
};


