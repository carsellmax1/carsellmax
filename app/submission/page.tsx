import { PublicLayout } from "@/components/layouts/public-layout";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Submission() {
  return (
    <PublicLayout>
      {/* Success Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
            Thank You for Your <span className="text-primary">Submission</span>!
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed">
            We&apos;ve received your vehicle information and our team is working on your valuation. 
            You&apos;ll hear from us within 24 hours with your personalized offer.
          </p>

          {/* What Happens Next */}
          <div className="bg-card border rounded-lg p-6 sm:p-8 mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">What Happens Next?</h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm sm:text-base font-semibold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-1">Review & Analysis</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Our experts review your vehicle details and analyze current market data.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm sm:text-base font-semibold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-1">Personalized Offer</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    You&apos;ll receive a competitive offer based on your vehicle&apos;s condition and market value.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm sm:text-base font-semibold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-1">Schedule Inspection</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    If you accept our offer, we&apos;ll schedule a convenient inspection at your location.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm sm:text-base font-semibold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base mb-1">Complete Sale</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    We handle all paperwork and payment, then pick up your vehicle at your convenience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-muted/50 rounded-lg p-6 sm:p-8 mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Need to Update Your Information?</h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
              If you need to modify your vehicle details or have questions, our team is here to help.
            </p>
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
              <p><strong>Email:</strong> support@carsellmax.com</p>
              <p><strong>Phone:</strong> 1-800-CARSELLMAX</p>
              <p><strong>Response Time:</strong> Within 24 hours</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Return to Home
            </Link>
            <Link 
              href="/contact"
              className="bg-muted text-muted-foreground hover:bg-muted/80 px-8 py-3 rounded-md text-lg font-medium transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}



