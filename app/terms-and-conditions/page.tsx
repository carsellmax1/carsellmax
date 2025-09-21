import { PublicLayout } from "@/components/layouts/public-layout";

export default function TermsAndConditions() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-background py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 sm:mb-6 text-foreground">
            Terms & Conditions
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground/70 max-w-lg mx-auto">
            These terms govern your use of our car selling platform and services.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            
            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you and CarSellMax (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) regarding your use of our car selling platform and services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
              </p>
            </div>

            {/* Services Description */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Our Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CarSellMax provides an online platform that connects vehicle owners with buyers, offering:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Instant vehicle valuations based on market data</li>
                <li>Vehicle inspection and appraisal services</li>
                <li>Purchase offers for qualified vehicles</li>
                <li>Vehicle pickup and transportation services</li>
                <li>Payment processing and transaction facilitation</li>
                <li>Customer support throughout the selling process</li>
              </ul>
            </div>

            {/* Eligibility */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Eligibility</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To use our services, you must:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Be at least 18 years of age</li>
                <li>Be the legal owner of the vehicle or have proper authorization</li>
                <li>Provide accurate and complete information</li>
                <li>Have the legal capacity to enter into contracts</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </div>

            {/* Vehicle Requirements */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Vehicle Requirements</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We purchase vehicles that meet certain criteria:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Clear title with no liens (or we can work with lienholders)</li>
                <li>Valid registration and documentation</li>
                <li>Accurate representation of condition and history</li>
                <li>Located within our service areas</li>
                <li>Meet minimum value thresholds</li>
              </ul>
            </div>

            {/* Valuation Process */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Valuation and Offers</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our valuation process includes:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Initial online valuation based on provided information</li>
                <li>Physical inspection to verify condition and details</li>
                <li>Final offer based on actual vehicle condition</li>
                <li>Market-based pricing using industry-standard sources</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                All offers are subject to physical inspection and verification. We reserve the right to adjust offers based on actual vehicle condition, market changes, or discovery of undisclosed information.
              </p>
            </div>

            {/* Payment Terms */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Payment Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Payment is processed according to the following terms:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Payment is made upon completion of vehicle transfer</li>
                <li>We offer bank transfer, certified check, or cash payment options</li>
                <li>Outstanding liens will be paid directly to lienholders</li>
                <li>Net proceeds are paid to the vehicle owner after lien satisfaction</li>
                <li>Payment processing may take 1-3 business days depending on method</li>
              </ul>
            </div>

            {/* User Responsibilities */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Your Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As a user of our services, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Provide accurate and truthful information about your vehicle</li>
                <li>Disclose all known defects, damage, or issues</li>
                <li>Maintain the vehicle in the disclosed condition until pickup</li>
                <li>Provide all necessary documentation and paperwork</li>
                <li>Be available for scheduled inspections and pickup</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use our services for fraudulent or illegal purposes</li>
              </ul>
            </div>

            {/* Prohibited Uses */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may not use our services to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Sell stolen, salvaged, or fraudulent vehicles</li>
                <li>Provide false or misleading information</li>
                <li>Interfere with our operations or other users</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to manipulate pricing or valuations</li>
                <li>Use our platform for any commercial resale purposes</li>
              </ul>
            </div>

            {/* Disclaimers */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Disclaimers</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our services are provided &quot;as is&quot; and &quot;as available.&quot; We make no warranties or representations regarding:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>The accuracy of valuations or market prices</li>
                <li>The availability of our services at all times</li>
                <li>The condition or history of purchased vehicles</li>
                <li>Third-party services or information</li>
                <li>The completeness or reliability of our website</li>
              </ul>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To the maximum extent permitted by law, CarSellMax shall not be liable for:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Any indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages exceeding the amount paid for our services</li>
                <li>Issues arising from third-party services or providers</li>
                <li>Market fluctuations or changes in vehicle values</li>
              </ul>
            </div>

            {/* Indemnification */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold CarSellMax harmless from any claims, damages, or expenses arising from your use of our services, violation of these Terms, or infringement of any third-party rights.
              </p>
            </div>

            {/* Termination */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may terminate or suspend your access to our services at any time for:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Providing false or misleading information</li>
                <li>Any other reason deemed necessary for our business operations</li>
              </ul>
            </div>

            {/* Governing Law */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of the state where CarSellMax is incorporated, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration or in the appropriate courts of that jurisdiction.
              </p>
            </div>

            {/* Changes to Terms */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes by updating the &quot;Last updated&quot; date and posting the revised Terms on our website. Continued use of our services after changes constitutes acceptance of the modified Terms.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about these Terms and Conditions, please contact us:
              </p>
              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="text-muted-foreground mb-2"><strong>Email:</strong> legal@carsellmax.com</p>
                <p className="text-muted-foreground mb-2"><strong>Phone:</strong> 1-800-CARSELLMAX</p>
                <p className="text-muted-foreground"><strong>Address:</strong> CarSellMax Legal Department, 123 Main Street, Suite 100, City, State 12345</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}



