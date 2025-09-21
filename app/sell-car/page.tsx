import { PublicLayout } from "@/components/layouts/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Car, Camera, FileText, CheckCircle } from "lucide-react";

export default function SellCarPage() {
  const steps = [
    {
      icon: FileText,
      title: "Fill Details",
      description: "Enter your car information and specifications"
    },
    {
      icon: Camera,
      title: "Upload Photos",
      description: "Add high-quality photos of your vehicle"
    },
    {
      icon: CheckCircle,
      title: "Get Offers",
      description: "Receive competitive offers from buyers"
    }
  ];

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Sell Your Car</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get the best price for your car with our simple listing process
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Car Listing Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Car Information</CardTitle>
            <CardDescription>
              Tell us about your car to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input id="make" placeholder="e.g., Toyota" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="e.g., Camry" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" placeholder="e.g., 2020" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input id="mileage" type="number" placeholder="e.g., 50000" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuel">Fuel Type</Label>
                <Input id="fuel" placeholder="e.g., Petrol" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Input id="transmission" placeholder="e.g., Automatic" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Describe your car's condition, features, and any additional information..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Asking Price</Label>
              <Input id="price" type="number" placeholder="e.g., 15000" />
            </div>

            <div className="pt-4">
              <Button className="w-full" size="lg">
                <Car className="h-5 w-5 mr-2" />
                List My Car
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Why List with CarSellMax?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2">Free Listing</h3>
              <p className="text-sm text-muted-foreground">
                No upfront costs to list your car
              </p>
            </div>
            <div className="p-6 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2">Professional Photos</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ll help you showcase your car properly
              </p>
            </div>
            <div className="p-6 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-2">Multiple Offers</h3>
              <p className="text-sm text-muted-foreground">
                Get competitive offers from verified buyers
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
