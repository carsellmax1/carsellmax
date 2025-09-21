"use client";

import { PublicLayout } from "@/components/layouts/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCarStore } from "@/lib/car-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, DollarSign, TrendingUp, CheckCircle, Car, Calendar, Fuel, Palette } from "lucide-react";

export default function ValuationResultPage() {
  const router = useRouter();
  const {
    foundCar: car,
    mileage,
    valuation,
    marketData,
    reset
  } = useCarStore();

  useEffect(() => {
    // Redirect to home if no car data
    if (!car) {
      router.push('/');
      return;
    }
  }, [car, router]);

  const handleStartOver = () => {
    reset();
    router.push('/');
  };

  const handleGetQuote = () => {
    router.push('/instant-valuation');
  };

  if (!car) {
    return null; // Will redirect
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={handleStartOver}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Start Over
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your Car Valuation is Ready!
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We&apos;ve analyzed your {car.year} {car.makeModel} and calculated a fair market value based on current market conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Main Valuation Card */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl md:text-3xl text-primary">
                    Estimated Market Value
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Based on {car.year} {car.makeModel} with {mileage} miles
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-primary mb-4">
                    {valuation ? `$${valuation.toLocaleString()}` : 'Calculating...'}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
                    <TrendingUp className="w-4 h-4" />
                    <span>Current market rate</span>
                  </div>
                  
                  {marketData && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-foreground">KBB Value</div>
                        <div className="text-muted-foreground">{marketData.kbb_value}</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-foreground">Edmunds</div>
                        <div className="text-muted-foreground">{marketData.edmunds_value}</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-foreground">CarMax</div>
                        <div className="text-muted-foreground">{marketData.carmax_value}</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="font-semibold text-foreground">Carvana</div>
                        <div className="text-muted-foreground">{marketData.carvana_value}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Car Details Card */}
            <div className="lg:col-span-1">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Vehicle Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Year</div>
                      <div className="text-sm text-muted-foreground">{car.year}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Make & Model</div>
                      <div className="text-sm text-muted-foreground">{car.makeModel}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Mileage</div>
                      <div className="text-sm text-muted-foreground">{mileage} miles</div>
                    </div>
                  </div>
                  
                  {car.color !== "Unknown" && (
                    <div className="flex items-center gap-3">
                      <Palette className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Color</div>
                        <div className="text-sm text-muted-foreground">{car.color}</div>
                      </div>
                    </div>
                  )}
                  
                  {car.bodyType !== "Unknown" && (
                    <div className="flex items-center gap-3">
                      <Car className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Body Type</div>
                        <div className="text-sm text-muted-foreground">{car.bodyType}</div>
                      </div>
                    </div>
                  )}
                  
                  {car.fuelType !== "Unknown" && (
                    <div className="flex items-center gap-3">
                      <Fuel className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Fuel Type</div>
                        <div className="text-sm text-muted-foreground">{car.fuelType}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mt-12 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGetQuote}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Get My Quote Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleStartOver}
                className="px-8 py-3 text-lg"
              >
                Value Another Car
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Ready to sell? Our team will review your vehicle and provide a competitive offer. 
              We handle everything from pickup to payment, making the process simple and stress-free.
            </p>
          </div>

          {/* Confidence Level */}
          {marketData && (
            <div className="mt-12 text-center">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-sm">
                      Confidence Level: {marketData.confidence}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {marketData.explanation}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}


