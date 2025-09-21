"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Mail, Phone, Calendar } from 'lucide-react';
import { useCarStore } from '@/lib/car-store';

function SubmissionConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { foundCar, valuation, marketData } = useCarStore();
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSubmissionId(id);
    }
    setIsLoading(false);
  }, [searchParams]);

  const handleTrackQuote = () => {
    if (submissionId) {
      router.push(`/track-quote/${submissionId}`);
    }
  };

  const handleNewValuation = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quote Submission Confirmed!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for submitting your vehicle for valuation. We&apos;ll review your submission and get back to you soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submission Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Submission Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Submission ID</p>
                <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                  {submissionId || 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Vehicle</p>
                <p className="font-medium">
                  {foundCar?.year} {foundCar?.make} {foundCar?.model}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Mileage</p>
                <p className="font-medium">
                  {(foundCar as unknown as Record<string, unknown>)?.mileage?.toLocaleString()} miles
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Estimated Value</p>
                <p className="font-medium text-green-600">
                  {String((valuation as unknown as Record<string, unknown>)?.estimatedPrice || (marketData as unknown as Record<string, unknown>)?.estimatedPrice || 'Calculating...')}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  Under Review
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                What Happens Next?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Review & Analysis</p>
                  <p className="text-sm text-gray-600">
                    Our team will review your vehicle details and photos within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Final Valuation</p>
                  <p className="text-sm text-gray-600">
                    We&apos;ll provide you with a detailed valuation and competitive offer.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Offer Delivery</p>
                  <p className="text-sm text-gray-600">
                    You&apos;ll receive your offer via email with next steps to proceed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-blue-600">4</span>
                </div>
                <div>
                  <p className="font-medium">Decision & Pickup</p>
                  <p className="text-sm text-gray-600">
                    Accept the offer and we&apos;ll schedule pickup within 24 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-gray-600">quotes@carsellmax.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-gray-600">(404) 555-0123</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={handleTrackQuote}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            disabled={!submissionId}
          >
            Track My Quote
          </Button>
          <Button 
            onClick={handleNewValuation}
            variant="outline"
            className="px-8 py-3"
          >
            Value Another Car
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SubmissionConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubmissionConfirmationContent />
    </Suspense>
  );
}
