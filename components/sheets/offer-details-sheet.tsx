"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { 
  Eye, 
  Edit, 
  Mail, 
  Send, 
  Save, 
  Clock, 
  DollarSign, 
  User, 
  Car,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OfferDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  offerId: string | null;
}

interface OfferDetails {
  id: string;
  quote_submission_id: string;
  status: string;
  offer_amount: number;
  expiry_date: string;
  terms_conditions: string;
  inspection_required: boolean;
  payment_method: string;
  notes: string;
  tracking_token: string;
  created_at: string;
  updated_at: string;
  quote_submissions?: {
    customers?: {
      name: string;
      email: string;
      phone: string;
    };
    vehicles?: {
      year: number;
      make: string;
      model: string;
      mileage: number;
      vin: string;
    };
  };
}

export default function OfferDetailsSheet({ isOpen, onClose, offerId }: OfferDetailsSheetProps) {
  const [offer, setOffer] = useState<OfferDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string | null }>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    offer_amount: 0,
    terms_conditions: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen && offerId) {
      fetchOfferDetails();
    }
  }, [isOpen, offerId]);

  const fetchOfferDetails = async () => {
    if (!offerId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/offers/${offerId}`);
      if (response.ok) {
        const data = await response.json();
        setOffer(data);
        setEditData({
          offer_amount: data.offer_amount,
          terms_conditions: data.terms_conditions,
          notes: data.notes
        });
      } else {
        setStatus({ type: 'error', message: 'Failed to fetch offer details' });
      }
    } catch (error) {
      console.error('Error fetching offer:', error);
      setStatus({ type: 'error', message: 'Failed to fetch offer details' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!offer) return;
    
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/offers/${offer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Offer updated successfully!' });
        setIsEditing(false);
        fetchOfferDetails(); // Refresh data
      } else {
        const error = await response.json();
        setStatus({ type: 'error', message: error.error || 'Failed to update offer' });
      }
    } catch (error) {
      console.error('Error updating offer:', error);
      setStatus({ type: 'error', message: 'Failed to update offer' });
    } finally {
      setSaving(false);
    }
  };

  const handleSend = async () => {
    if (!offer) return;
    
    setSending(true);
    try {
      const response = await fetch('/api/admin/offers/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer_id: offer.id })
      });

      if (response.ok) {
        setStatus({ type: 'success', message: 'Offer sent successfully!' });
        fetchOfferDetails(); // Refresh data
      } else {
        const error = await response.json();
        setStatus({ type: 'error', message: error.error || 'Failed to send offer' });
      }
    } catch (error) {
      console.error('Error sending offer:', error);
      setStatus({ type: 'error', message: 'Failed to send offer' });
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'sent':
        return <Badge variant="default">Sent</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-500">Accepted</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      case 'expired':
        return <Badge variant="outline">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[50vw] sm:w-[60vw] lg:w-[50vw]">
          <SheetHeader>
            <SheetTitle>Loading Offer Details</SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading offer details...</span>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  if (!offer) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-[50vw] sm:w-[60vw] lg:w-[50vw]">
          <SheetHeader>
            <SheetTitle>Offer Not Found</SheetTitle>
          </SheetHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Offer not found or failed to load.
            </AlertDescription>
          </Alert>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[50vw] sm:w-[60vw] lg:w-[50vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Offer Details
            {getStatusBadge(offer.status)}
          </SheetTitle>
          <SheetDescription>
            View and manage offer for {offer.quote_submissions?.customers?.name || 'Customer'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
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

          {/* Customer & Vehicle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer & Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Customer</h4>
                  <p className="font-medium">{offer.quote_submissions?.customers?.name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{offer.quote_submissions?.customers?.email || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{offer.quote_submissions?.customers?.phone || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Vehicle</h4>
                  <p className="font-medium">
                    {offer.quote_submissions?.vehicles?.year} {offer.quote_submissions?.vehicles?.make} {offer.quote_submissions?.vehicles?.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {offer.quote_submissions?.vehicles?.mileage?.toLocaleString()} miles
                  </p>
                  <p className="text-sm text-muted-foreground">
                    VIN: {offer.quote_submissions?.vehicles?.vin || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Offer Details
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="ml-auto"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Offer Amount</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.offer_amount}
                      onChange={(e) => setEditData(prev => ({ ...prev, offer_amount: Number(e.target.value) }))}
                      className="w-full mt-1 px-3 py-2 border rounded-md"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-green-600">${offer.offer_amount.toLocaleString()}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                  <p className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(offer.expiry_date)}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Terms & Conditions</label>
                {isEditing ? (
                  <textarea
                    value={editData.terms_conditions}
                    onChange={(e) => setEditData(prev => ({ ...prev, terms_conditions: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-md h-24"
                    placeholder="Enter terms and conditions..."
                  />
                ) : (
                  <p className="mt-1 text-sm whitespace-pre-wrap">{offer.terms_conditions}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Internal Notes</label>
                {isEditing ? (
                  <textarea
                    value={editData.notes}
                    onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 border rounded-md h-20"
                    placeholder="Add internal notes..."
                  />
                ) : (
                  <p className="mt-1 text-sm whitespace-pre-wrap">{offer.notes || 'No notes'}</p>
                )}
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {offer.status === 'draft' && (
                  <Button onClick={handleSend} disabled={sending}>
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Offer
                      </>
                    )}
                  </Button>
                )}
                
                {offer.status === 'sent' && (
                  <Button variant="outline" disabled>
                    <Mail className="h-4 w-4 mr-2" />
                    Offer Sent
                  </Button>
                )}

                <Button variant="outline" asChild>
                  <a href={`/offer/${offer.tracking_token}`} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 mr-2" />
                    View Customer Portal
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{formatDate(offer.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{formatDate(offer.updated_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tracking Token:</span>
                <span className="font-mono text-xs">{offer.tracking_token}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
