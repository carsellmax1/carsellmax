'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Car, DollarSign, Calendar, FileText, Phone } from 'lucide-react';

interface OfferData {
  id: string;
  offer_amount: number;
  expiry_date: string;
  status: string;
  terms_conditions: string;
  inspection_required: boolean;
  payment_method: string;
  notes: string;
  created_at: string;
  sent_at: string;
  quote_submissions: {
    id: string;
    status: string;
    customers: {
      name: string;
      email: string;
      phone: string;
    };
    vehicles: {
      make: string;
      model: string;
      year: number;
      vin: string;
      mileage: number;
      color: string;
      condition: string;
    };
    valuations: {
      final_valuation: number;
      market_value: number;
    };
  };
}

export default function OfferPage({ params }: { params: Promise<{ token: string }> }) {
  const [offer, setOffer] = useState<OfferData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const response = await fetch(`/api/offer/${resolvedParams.token}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setOffer(data.data);
        }
      } catch (error) {
        console.error('Error fetching offer:', error);
        setError('Failed to load offer');
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, [params]);

  const handleAccept = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/offer/${(offer as unknown as Record<string, unknown>)?.tracking_token}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.error) {
        alert('Error accepting offer: ' + data.error);
      } else {
        alert('Offer accepted! We will contact you soon to arrange pickup and payment.');
        // Refresh offer data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('Error accepting offer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(`/api/offer/${(offer as unknown as Record<string, unknown>)?.tracking_token}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.error) {
        alert('Error declining offer: ' + data.error);
      } else {
        alert('Offer declined. Thank you for your time.');
        // Refresh offer data
        window.location.reload();
      }
    } catch (error) {
      console.error('Error declining offer:', error);
      alert('Error declining offer');
    } finally {
      setActionLoading(false);
    }
  };

  const isExpired = offer ? new Date(offer.expiry_date) < new Date() : false;
  const isAccepted = offer?.status === 'accepted';
  const isDeclined = offer?.status === 'declined';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your offer...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Offer Not Found</h2>
              <p className="text-gray-600">
                {error || 'The offer you are looking for could not be found or may have expired.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Car Offer</h1>
          <p className="text-gray-600">Review the details and take action on your offer</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Offer Card */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Offer Details</CardTitle>
                  <div className="flex items-center gap-2">
                    {isExpired && <Badge variant="destructive">Expired</Badge>}
                    {isAccepted && <Badge variant="default" className="bg-green-600">Accepted</Badge>}
                    {isDeclined && <Badge variant="secondary">Declined</Badge>}
                    {!isExpired && !isAccepted && !isDeclined && <Badge variant="outline">Active</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    ${offer.offer_amount.toLocaleString()}
                  </div>
                  <p className="text-gray-600">For your {String((((offer as unknown as Record<string, unknown>)?.quote_submissions as unknown as Record<string, unknown>)?.vehicles as unknown as Record<string, unknown>)?.year || '')} {String((((offer as unknown as Record<string, unknown>)?.quote_submissions as unknown as Record<string, unknown>)?.vehicles as unknown as Record<string, unknown>)?.make || '')} {String((((offer as unknown as Record<string, unknown>)?.quote_submissions as unknown as Record<string, unknown>)?.vehicles as unknown as Record<string, unknown>)?.model || '')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Expires</p>
                      <p className="font-medium">{new Date(offer.expiry_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Based on Valuation</p>
                      <p className="font-medium">${(((offer as unknown as Record<string, unknown>)?.quote_submissions as unknown as Record<string, unknown>)?.valuations as unknown as Record<string, unknown>)?.base_value?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {!isExpired && !isAccepted && !isDeclined && (
                  <div className="flex gap-4 justify-center">
                    <Button 
                      onClick={handleAccept}
                      disabled={actionLoading}
                      className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Accept Offer
                    </Button>
                    <Button 
                      onClick={handleDecline}
                      disabled={actionLoading}
                      variant="outline"
                      className="px-8 py-3"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Decline Offer
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{offer.terms_conditions}</p>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Inspection Required: {offer.inspection_required ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Payment Method: {offer.payment_method.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>

                {offer.notes && (
                  <>
                    <Separator className="my-4" />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                      <p className="text-gray-700">{offer.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Details Sidebar */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium">{offer.quote_submissions?.vehicles?.year} {offer.quote_submissions?.vehicles?.make} {offer.quote_submissions?.vehicles?.model}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mileage</p>
                    <p className="font-medium">{offer.quote_submissions?.vehicles?.mileage?.toLocaleString()} miles</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Condition</p>
                    <p className="font-medium capitalize">{offer.quote_submissions?.vehicles?.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-medium capitalize">{offer.quote_submissions?.vehicles?.color}</p>
                  </div>
                  {offer.quote_submissions?.vehicles?.vin && (
                    <div>
                      <p className="text-sm text-gray-600">VIN</p>
                      <p className="font-medium font-mono text-sm">{offer.quote_submissions?.vehicles?.vin}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{offer.quote_submissions?.customers?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{offer.quote_submissions?.customers?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{offer.quote_submissions?.customers?.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
