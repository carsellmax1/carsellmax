"use client";

import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Mail,
  Plus,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Archive,
  ArchiveRestore
} from "lucide-react";
import { useState, useEffect } from "react";
import OfferDetailsSheet from "@/components/sheets/offer-details-sheet";
import { OfferManagementActions } from "@/components/admin/offer-management-actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Offer {
  id: string;
  quote_submission_id: string;
  valuation_id: string | null;
  status: string;
  offer_amount: number;
  valid_until: string | null;
  terms_conditions: string;
  created_at: string;
  updated_at: string;
  quote_submissions?: {
    customers?: {
      name: string;
      email: string;
      phone: string;
    };
    vehicles?: {
      make: string;
      model: string;
      year: number;
      mileage: number;
      vin: string;
    };
  };
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "sent", label: "Sent" },
    { value: "viewed", label: "Viewed" },
    { value: "accepted", label: "Accepted" },
    { value: "declined", label: "Declined" },
    { value: "expired", label: "Expired" },
    { value: "archived", label: "Archived" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'sent':
        return <Badge variant="outline">Sent</Badge>;
      case 'viewed':
        return <Badge variant="default">Viewed</Badge>;
      case 'accepted':
        return <Badge variant="default" className="bg-green-600">Accepted</Badge>;
      case 'declined':
        return <Badge variant="destructive">Declined</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-500">Expired</Badge>;
      case 'archived':
        return <Badge variant="outline" className="bg-gray-600">Archived</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="bg-red-500">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-700">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <Edit className="h-4 w-4" />;
      case 'sent':
        return <Mail className="h-4 w-4" />;
      case 'viewed':
        return <Eye className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-gray-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-700" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/offers');
      const data = await response.json();
      
      console.log("Offers API response:", data);
      
      if (data.error) {
        console.error("Error fetching offers:", data.error);
        return;
      }

      console.log("Setting offers:", data.data);
      setOffers(data.data || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleViewOffer = (offerId: string) => {
    setSelectedOfferId(offerId);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedOfferId(null);
    // Refresh offers when sheet closes
    fetchOffers();
  };



  const filteredOffers = offers.filter(offer => {
    const matchesSearch = 
      offer.quote_submissions?.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.quote_submissions?.customers?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.quote_submissions?.vehicles?.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.quote_submissions?.vehicles?.model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || offer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Offers</h1>
            <p className="text-muted-foreground">
              Manage and track customer offers
            </p>
          </div>
          <div className="flex space-x-2">
            <p className="text-sm text-muted-foreground">
              Create offers from the Valuations page
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by customer name, email, or vehicle..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Offers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Offers ({filteredOffers.length})</CardTitle>
            <CardDescription>
              Track and manage customer offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Offer Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Valid Until</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                <TableBody>
                  {filteredOffers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{offer.quote_submissions?.customers?.name}</div>
                          <div className="text-sm text-muted-foreground">{offer.quote_submissions?.customers?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {offer.quote_submissions?.vehicles?.year} {offer.quote_submissions?.vehicles?.make} {offer.quote_submissions?.vehicles?.model}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${offer.offer_amount?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(offer.status)}
                          {getStatusBadge(offer.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {offer.valid_until ? new Date(offer.valid_until).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {new Date(offer.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <OfferManagementActions
                          offerId={offer.id}
                          currentStatus={offer.status}
                          onStatusChange={fetchOffers}
                          onView={() => handleViewOffer(offer.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Offer Details Sheet */}
      <OfferDetailsSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        offerId={selectedOfferId}
      />
    </AdminLayout>
  );
}
