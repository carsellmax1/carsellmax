'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send, Eye, TestTube, Car, DollarSign, Calendar, FileText } from 'lucide-react';

interface QuoteSubmission {
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
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export default function ComposeOfferPage() {
  const router = useRouter();
  const [quoteId, setQuoteId] = useState<string>('');
  const [quote, setQuote] = useState<QuoteSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [emailTemplate, setEmailTemplate] = useState<EmailTemplate | null>(null);

  // Offer form data
  const [offerData, setOfferData] = useState({
    offer_amount: '',
    expiry_days: 7,
    terms_conditions: 'Standard terms and conditions apply. Vehicle must pass inspection. Payment will be processed within 2-3 business days after acceptance.',
    inspection_required: true,
    payment_method: 'bank_transfer',
    notes: ''
  });

  const fetchQuote = async (id: string) => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/quotes/${id}`);
      const data = await response.json();
      
      if (data.error) {
        alert('Error fetching quote: ' + data.error);
        return;
      }
      
      setQuote(data.data);
      
      // Pre-fill offer amount based on valuation
      if (data.data.valuations?.final_valuation) {
        setOfferData(prev => ({
          ...prev,
          offer_amount: data.data.valuations.final_valuation.toString()
        }));
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
      alert('Error fetching quote');
    } finally {
      setLoading(false);
    }
  };

  const loadEmailTemplate = async () => {
    try {
      const response = await fetch('/api/admin/email-templates?type=offer_sent');
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        setEmailTemplate(data.data[0]);
      }
    } catch (error) {
      console.error('Error loading email template:', error);
    }
  };

  useEffect(() => {
    loadEmailTemplate();
  }, []);

  const handleCreateOffer = async () => {
    if (!quote) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quote_submission_id: quote.id,
          ...offerData
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        alert('Error creating offer: ' + data.error);
        return;
      }

      alert('Offer created successfully!');
      router.push('/admin/offers');
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('Error creating offer');
    } finally {
      setSaving(false);
    }
  };

  const handleSendEmail = async (isTest = false) => {
    if (!quote) return;
    
    try {
      setSending(true);
      
      // First create the offer if not already created
      const offerId = quote.id; // This would be the actual offer ID in a real implementation
      
      const response = await fetch('/api/admin/offers/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          offer_id: offerId,
          test_email: isTest ? testEmail : undefined
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        alert('Error sending email: ' + data.error);
        return;
      }

      alert(isTest ? 'Test email sent successfully!' : 'Offer email sent successfully!');
      if (!isTest) {
        router.push('/admin/offers');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email');
    } finally {
      setSending(false);
    }
  };

  const generatePreview = () => {
    if (!quote || !emailTemplate) return null;

    const vehicleSummary = `${quote.vehicles.year} ${quote.vehicles.make} ${quote.vehicles.model}`;
    const valuationValue = quote.valuations?.final_valuation || quote.valuations?.market_value || 0;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + offerData.expiry_days);
    const customerPortalUrl = `${window.location.origin}/offer/sample-token`;

    const variables = {
      '{{customer_name}}': quote.customers.name,
      '{{vehicle_summary}}': vehicleSummary,
      '{{valuation_value}}': `$${valuationValue.toLocaleString()}`,
      '{{offer_amount}}': `$${parseFloat(offerData.offer_amount || '0').toLocaleString()}`,
      '{{expiry_date}}': expiryDate.toLocaleDateString(),
      '{{customer_portal_url}}': customerPortalUrl,
      '{{tracking_token}}': 'sample-token'
    };

    let previewHtml = emailTemplate.html;
    Object.entries(variables).forEach(([placeholder, value]) => {
      previewHtml = previewHtml.replace(new RegExp(placeholder, 'g'), value);
    });

    return previewHtml;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quote...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Compose Offer</h1>
            <p className="text-gray-600">Create and send an offer to the customer</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      {!quote ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label htmlFor="quote-id">Quote Submission ID</Label>
              <div className="flex gap-2">
                <Input
                  id="quote-id"
                  value={quoteId}
                  onChange={(e) => setQuoteId(e.target.value)}
                  placeholder="Enter quote submission ID"
                />
                <Button onClick={() => fetchQuote(quoteId)}>
                  Load Quote
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quote Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Quote Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">Customer</Label>
                  <p className="font-medium">{quote.customers.name}</p>
                  <p className="text-sm text-gray-600">{quote.customers.email}</p>
                  <p className="text-sm text-gray-600">{quote.customers.phone}</p>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm text-gray-600">Vehicle</Label>
                  <p className="font-medium">{quote.vehicles.year} {quote.vehicles.make} {quote.vehicles.model}</p>
                  <p className="text-sm text-gray-600">{quote.vehicles.mileage.toLocaleString()} miles • {quote.vehicles.condition}</p>
                </div>
                
                <Separator />
                
                <div>
                  <Label className="text-sm text-gray-600">Valuation</Label>
                  <p className="font-medium text-green-600">
                    ${quote.valuations?.final_valuation?.toLocaleString() || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offer Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Offer Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="offer_amount">Offer Amount ($)</Label>
                  <Input
                    id="offer_amount"
                    type="number"
                    value={offerData.offer_amount}
                    onChange={(e) => setOfferData(prev => ({ ...prev, offer_amount: e.target.value }))}
                    placeholder="Enter offer amount"
                  />
                </div>

                <div>
                  <Label htmlFor="expiry_days">Expiry (Days)</Label>
                  <Input
                    id="expiry_days"
                    type="number"
                    value={offerData.expiry_days}
                    onChange={(e) => setOfferData(prev => ({ ...prev, expiry_days: parseInt(e.target.value) || 7 }))}
                  />
                </div>

                <div>
                  <Label htmlFor="terms_conditions">Terms & Conditions</Label>
                  <Textarea
                    id="terms_conditions"
                    value={offerData.terms_conditions}
                    onChange={(e) => setOfferData(prev => ({ ...prev, terms_conditions: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={offerData.notes}
                    onChange={(e) => setOfferData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Any additional notes for the customer..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Email Preview */}
      {previewMode && quote && emailTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Email Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="border rounded-lg p-4 max-h-96 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: generatePreview() || '' }}
            />
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {quote && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="test_email">Test Email (Optional)</Label>
                <Input
                  id="test_email"
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="admin@carsellmax.com"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSendEmail(true)}
                  disabled={sending || !testEmail}
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  Send Test
                </Button>
                
                <Button
                  onClick={handleCreateOffer}
                  disabled={saving}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {saving ? 'Creating...' : 'Create Offer'}
                </Button>
                
                <Button
                  onClick={() => handleSendEmail(false)}
                  disabled={sending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sending ? 'Sending...' : 'Send Offer'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
