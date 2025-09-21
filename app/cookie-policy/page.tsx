import { PublicLayout } from "@/components/layouts/public-layout";

export default function CookiePolicy() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-background py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 sm:mb-6 text-foreground">
            Cookie Policy
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground/70 max-w-lg mx-auto">
            Learn about how we use cookies and similar technologies to enhance your experience.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Cookie Policy Content */}
      <section className="py-12 sm:py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-gray max-w-none">
            
            {/* Introduction */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and personalizing content and advertisements.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This Cookie Policy explains what cookies we use, why we use them, and how you can manage your cookie preferences.
              </p>
            </div>

            {/* Types of Cookies */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Essential Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    These cookies are necessary for our website to function properly. They enable core functionality such as security, network management, and accessibility.
                  </p>
                  <p className="text-sm text-muted-foreground"><strong>Examples:</strong> Session management, authentication, form submissions</p>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Performance Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    These cookies help us understand how visitors interact with our website by collecting anonymous information about pages visited, time spent on the site, and any error messages.
                  </p>
                  <p className="text-sm text-muted-foreground"><strong>Examples:</strong> Google Analytics, page load times, error tracking</p>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Functional Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    These cookies allow our website to remember choices you make and provide enhanced, more personal features such as remembering your preferences and settings.
                  </p>
                  <p className="text-sm text-muted-foreground"><strong>Examples:</strong> Language preferences, theme settings, saved searches</p>
                </div>

                <div className="bg-muted/30 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Targeting/Advertising Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    These cookies are used to deliver relevant advertisements and track advertising campaign performance. They may be set by our advertising partners through our site.
                  </p>
                  <p className="text-sm text-muted-foreground"><strong>Examples:</strong> Google Ads, Facebook Pixel, retargeting campaigns</p>
                </div>
              </div>
            </div>

            {/* Managing Cookies */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Managing Your Cookie Preferences</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">Browser Settings</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You can control and manage cookies through your browser settings. Most browsers allow you to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-muted-foreground space-y-2">
                <li>View and delete cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block all cookies</li>
                <li>Set preferences for different types of cookies</li>
                <li>Clear cookies when you close your browser</li>
              </ul>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>Important:</strong> Disabling certain cookies may affect the functionality of our website and your user experience.
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
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



