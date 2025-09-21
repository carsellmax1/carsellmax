"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteSubmission: {
    id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    vehicle_year: number;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_mileage: number;
    estimated_value: number;
  };
  valuation?: {
    recommended_offer: number;
    offer_range_min: number;
    offer_range_max: number;
  };
}

export default function OfferModal({ isOpen, onClose, quoteSubmission, valuation }: OfferModalProps) {
  const [offerAmount, setOfferAmount] = useState(0);
  const [expiryDays, setExpiryDays] = useState(7);
  const [terms, setTerms] = useState('');
  const [conditions, setConditions] = useState('');
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string | null }>(null);

  // Update offer amount when valuation changes
  React.useEffect(() => {
    if (valuation?.recommended_offer) {
      setOfferAmount(valuation.recommended_offer);
    } else if (quoteSubmission.estimated_value) {
      setOfferAmount(quoteSubmission.estimated_value);
    }
  }, [valuation?.recommended_offer, quoteSubmission.estimated_value]);

  const handleSaveDraft = async () => {
    if (!offerAmount) return;

    setSaving(true);
    setStatus(null);

    try {
      const response = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote_submission_id: quoteSubmission.id,
          offer_amount: offerAmount,
          expiry_days: expiryDays,
          terms_conditions: `${terms}\n\nConditions:\n${conditions}`,
          notes: notes,
          status: 'draft'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: 'Draft saved successfully!' });
      } else {
        throw new Error(data.error || 'Failed to save draft');
      }

    } catch (error) {
      console.error('Error saving draft:', error);
      setStatus({ type: 'error', message: 'Failed to save draft. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSendOffer = async () => {
    if (!offerAmount) return;

    setSending(true);
    setStatus(null);

    try {
      // First, create the offer
      const createResponse = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quote_submission_id: quoteSubmission.id,
          offer_amount: offerAmount,
          expiry_days: expiryDays,
          terms_conditions: `${terms}\n\nConditions:\n${conditions}`,
          notes: notes
        })
      });

      const createData = await createResponse.json();

      let offerId;
      if (createResponse.ok) {
        offerId = createData.data.id;
      } else if (createResponse.status === 409) {
        // Offer already exists, get the existing offer ID
        const existingResponse = await fetch(`/api/admin/offers?quote_submission_id=${quoteSubmission.id}`);
        const existingData = await existingResponse.json();
        if (existingData.data && existingData.data.length > 0) {
          offerId = existingData.data[0].id;
          // Update the existing offer
          await fetch(`/api/admin/offers/${offerId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              offer_amount: offerAmount,
              terms_conditions: `${terms}\n\nConditions:\n${conditions}`,
              notes: notes
            })
          });
        } else {
          throw new Error('Failed to find existing offer');
        }
      } else {
        throw new Error(createData.error || 'Failed to create offer');
      }

      // Then, send the offer
      const sendResponse = await fetch('/api/admin/offers/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offer_id: offerId
        })
      });

      const sendData = await sendResponse.json();

      if (sendResponse.ok) {
        setStatus({ type: 'success', message: 'Offer sent successfully!' });
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          // Reset form
          setOfferAmount(valuation?.recommended_offer || quoteSubmission.estimated_value);
          setExpiryDays(7);
          setTerms('');
          setConditions('');
          setNotes('');
          setStatus(null);
        }, 2000);
      } else {
        setStatus({ type: 'error', message: sendData.error || 'Failed to send offer' });
      }
    } catch (error) {
      console.error('Error sending offer:', error);
      setStatus({ type: 'error', message: (error as Error).message || 'An unexpected error occurred' });
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      onClose();
      // Reset form
      setOfferAmount(valuation?.recommended_offer || quoteSubmission.estimated_value);
      setExpiryDays(7);
      setTerms('');
      setConditions('');
      setNotes('');
      setStatus(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Offer</DialogTitle>
          <DialogDescription>
            Send an offer to {quoteSubmission.customer_name} for their {quoteSubmission.vehicle_year} {quoteSubmission.vehicle_make} {quoteSubmission.vehicle_model}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer & Vehicle Info */}
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Customer & Vehicle Details:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Customer:</strong> {quoteSubmission.customer_name}</p>
                <p><strong>Email:</strong> {quoteSubmission.customer_email}</p>
                <p><strong>Phone:</strong> {quoteSubmission.customer_phone}</p>
              </div>
              <div>
                <p><strong>Vehicle:</strong> {quoteSubmission.vehicle_year} {quoteSubmission.vehicle_make} {quoteSubmission.vehicle_model}</p>
                <p><strong>Mileage:</strong> {quoteSubmission.vehicle_mileage.toLocaleString()} miles</p>
                <p><strong>Estimated Value:</strong> ${quoteSubmission.estimated_value.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Valuation Info */}
          {valuation && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Valuation Recommendation:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p><strong>Recommended:</strong> ${valuation.recommended_offer?.toLocaleString()}</p>
                </div>
                <div>
                  <p><strong>Range:</strong> ${valuation.offer_range_min?.toLocaleString()} - ${valuation.offer_range_max?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Offer Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="offerAmount">Offer Amount ($)</Label>
                <Input
                  id="offerAmount"
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  placeholder="Enter offer amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDays">Valid For (Days)</Label>
                <Select value={expiryDays.toString()} onValueChange={(value) => setExpiryDays(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Terms</Label>
              <Textarea
                id="terms"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Enter offer terms..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="conditions">Conditions</Label>
              <Textarea
                id="conditions"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="Enter offer conditions..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Internal Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes..."
                rows={2}
              />
            </div>
          </div>

          {/* Status Alert */}
          {status && (
            <Alert variant={status.type === 'success' ? 'default' : 'destructive'}>
              {status.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {status.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={sending || saving}>
              Cancel
            </Button>
            <Button 
              variant="outline"
              onClick={handleSaveDraft} 
              disabled={!offerAmount || sending || saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                'Save Draft'
              )}
            </Button>
            <Button 
              onClick={handleSendOffer} 
              disabled={!offerAmount || sending || saving}
            >
              {sending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Offer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
