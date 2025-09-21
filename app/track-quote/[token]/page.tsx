"use client";

import { PublicLayout } from "@/components/layouts/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Camera,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface QuoteSubmission {
  id: string;
  public_token: string;
  status: string;
  estimated_value: number;
  created_at: string;
  updated_at: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
    };
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    mileage: number;
    color: string;
    condition: string;
    additional_notes?: string;
  };
  photos: Array<{
    category: string;
    filename: string;
    url?: string;
  }>;
  valuation?: {
    market_value: number;
    final_valuation: number;
    admin_notes?: string;
  };
  offer?: {
    offer_amount: number;
    valid_until: string;
    terms_conditions: string;
  };
}

const STATUS_CONFIG = {
  pending_review: {
    label: "Pending Review",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: Clock,
    description: "Your quote request is being reviewed by our team"
  },
  under_review: {
    label: "Under Review",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: Clock,
    description: "Our experts are evaluating your vehicle"
  },
  valuation_ready: {
    label: "Valuation Ready",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    icon: CheckCircle,
    description: "Your vehicle has been valued and is ready for offer"
  },
  quote_sent: {
    label: "Quote Sent",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: CheckCircle,
    description: "Your personalized quote has been sent"
  },
  accepted: {
    label: "Accepted",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: CheckCircle,
    description: "You have accepted our offer"
  },
  declined: {
    label: "Declined",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: AlertCircle,
    description: "You have declined our offer"
  },
  withdrawn: {
    label: "Withdrawn",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    icon: AlertCircle,
    description: "This quote request has been withdrawn"
  }
};

export default function TrackQuotePage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const response = await fetch(`/api/track-quote/${resolvedParams.token}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Quote not found. Please check your tracking link.');
          }
          throw new Error('Failed to fetch quote details');
        }

        const data = await response.json();
        setQuote(data);
      } catch (err) {
        console.error('Error fetching quote:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quote details');
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [params]);

  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending_review;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
              <h1 className="text-xl font-semibold mb-2">Loading Quote Details</h1>
              <p className="text-muted-foreground">Please wait while we fetch your quote information...</p>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  if (error || !quote) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-semibold mb-2">Quote Not Found</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="space-y-2">
                <Button onClick={() => router.push('/')} className="w-full">
                  Get New Quote
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()} className="w-full">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  const statusConfig = getStatusConfig(quote.status);
  const StatusIcon = statusConfig.icon;

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="text-sm text-muted-foreground">
                Quote #{quote.id.slice(-8).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Status Card */}
          <Card className="max-w-4xl mx-auto mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Quote Status</CardTitle>
                  <CardDescription>Track your vehicle quote progress</CardDescription>
                </div>
                <Badge className={statusConfig.color}>
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {statusConfig.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{statusConfig.description}</p>
              <div className="text-sm text-muted-foreground">
                <p>Submitted: {formatDate(quote.created_at)}</p>
                <p>Last Updated: {formatDate(quote.updated_at)}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Vehicle Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">
                    {quote.vehicle.year} {quote.vehicle.make} {quote.vehicle.model}
                  </h3>
                  <p className="text-muted-foreground">{quote.vehicle.color}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Mileage:</span>
                    <p className="font-medium">{quote.vehicle.mileage.toLocaleString()} miles</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Condition:</span>
                    <p className="font-medium capitalize">{quote.vehicle.condition}</p>
                  </div>
                </div>

                {quote.vehicle.additional_notes && (
                  <div>
                    <span className="text-muted-foreground text-sm">Additional Notes:</span>
                    <p className="text-sm mt-1">{quote.vehicle.additional_notes}</p>
                  </div>
                )}

                {/* Photos */}
                {quote.photos.length > 0 && (
                  <div>
                    <span className="text-muted-foreground text-sm">Photos Uploaded:</span>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {quote.photos.map((photo, index) => (
                        <div key={index} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <Camera className="w-6 h-6 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{quote.customer.name}</p>
                    <p className="text-sm text-muted-foreground">{quote.customer.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm">{quote.customer.phone}</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p>{quote.customer.address.street}</p>
                    <p>{quote.customer.address.city}, {quote.customer.address.state} {quote.customer.address.zip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Valuation & Offer Information */}
          {(quote.valuation || quote.offer) && (
            <Card className="max-w-4xl mx-auto mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Valuation & Offer
                </CardTitle>
              </CardHeader>
              <CardContent>
                {quote.valuation && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Vehicle Valuation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground text-sm">Market Value:</span>
                        <p className="text-lg font-semibold">${quote.valuation.market_value?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-sm">Final Valuation:</span>
                        <p className="text-lg font-semibold text-primary">${quote.valuation.final_valuation?.toLocaleString() || 'N/A'}</p>
                      </div>
                    </div>
                    {quote.valuation.admin_notes && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <span className="text-muted-foreground text-sm">Admin Notes:</span>
                        <p className="text-sm mt-1">{quote.valuation.admin_notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {quote.offer && (
                  <div>
                    <h3 className="font-semibold mb-2">Your Offer</h3>
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">
                        ${quote.offer.offer_amount?.toLocaleString() || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4" />
                        Valid until: {formatDate(quote.offer.valid_until)}
                      </div>
                      {quote.offer.terms_conditions && (
                        <div className="text-sm">
                          <span className="font-medium">Terms & Conditions:</span>
                          <p className="mt-1">{quote.offer.terms_conditions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="text-center mt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => router.push('/')} variant="outline">
                Get New Quote
              </Button>
              {quote.status === 'quote_sent' && (
                <Button className="bg-primary hover:bg-primary/90">
                  Accept Offer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
