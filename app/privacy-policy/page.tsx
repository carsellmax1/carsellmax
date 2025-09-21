import { PublicLayout } from "@/components/layouts/public-layout";

export default function PrivacyPolicy() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-background py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 sm:mb-6 text-foreground">
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground/70 max-w-lg mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            
            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                CarSellMax (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our car selling platform and services.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect personal information that you voluntarily provide when using our services, including:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Contact information (name, email address, phone number)</li>
                <li>Vehicle information (VIN, make, model, year, mileage, condition)</li>
                <li>Location data (city, state, ZIP code)</li>
                <li>Financial information for payment processing</li>
                <li>Photos and documentation of your vehicle</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">Automatically Collected Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We automatically collect certain information when you visit our website:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website information</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Provide and maintain our car selling services</li>
                <li>Process vehicle valuations and offers</li>
                <li>Facilitate vehicle inspections and purchases</li>
                <li>Process payments and complete transactions</li>
                <li>Communicate with you about our services</li>
                <li>Send updates, confirmations, and notifications</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and enhance security</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>With service providers who assist in our operations</li>
                <li>With financial institutions for payment processing</li>
                <li>With vehicle inspection and transport partners</li>
                <li>When required by law or legal process</li>
                <li>To protect our rights, property, or safety</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </div>

            {/* Data Security */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication systems</li>
                <li>Employee training on data protection</li>
                <li>Secure payment processing systems</li>
              </ul>
            </div>

            {/* Your Rights */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Access: Request a copy of your personal information</li>
                <li>Correction: Request correction of inaccurate information</li>
                <li>Deletion: Request deletion of your personal information</li>
                <li>Portability: Request transfer of your information</li>
                <li>Opt-out: Unsubscribe from marketing communications</li>
                <li>Restrict processing: Limit how we use your information</li>
              </ul>
            </div>

            {/* Cookies */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience on our website. These technologies help us:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Improve our services and user experience</li>
                <li>Provide personalized content and offers</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                You can control cookie settings through your browser preferences. Please see our Cookie Policy for more detailed information.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Children&apos;s Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you believe we have collected information from a child under 18, please contact us immediately.
              </p>
            </div>

            {/* Changes to Privacy Policy */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-muted/50 p-6 rounded-lg">
                <p className="text-muted-foreground mb-2"><strong>Email:</strong> privacy@carsellmax.com</p>
                <p className="text-muted-foreground mb-2"><strong>Phone:</strong> 1-800-CARSELLMAX</p>
                <p className="text-muted-foreground"><strong>Address:</strong> CarSellMax Privacy Team, 123 Main Street, Suite 100, City, State 12345</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}



