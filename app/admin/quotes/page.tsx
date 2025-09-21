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
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Calculator
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface QuoteSubmission {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vin: string;
  mileage: number;
  condition: string;
  estimated_value: number;
  status: string;
  additional_notes: string;
  created_at: string;
  updated_at: string;
  customers?: {
    name: string;
    email: string;
  };
  vehicles?: {
    make: string;
    model: string;
    year: number;
  };
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending_review", label: "Pending Review" },
    { value: "under_review", label: "Under Review" },
    { value: "quote_sent", label: "Quote Sent" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending_review':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'under_review':
        return <Badge variant="outline">Under Review</Badge>;
      case 'quote_sent':
        return <Badge variant="default">Quote Sent</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: ((currentPage - 1) * itemsPerPage).toString()
      });
      
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/admin/quotes?${params}`);
      const data = await response.json();
      
      if (data.error) {
        console.error("Error fetching quotes:", data.error);
        return;
      }

      setQuotes(data.data || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  const createValuation = async (quoteId: string) => {
    try {
      const response = await fetch('/api/admin/valuations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quote_submission_id: quoteId
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("Error creating valuation:", data.error);
        
        // If valuation already exists, redirect to valuations list
        if (data.error.includes("already exists")) {
          alert("A valuation already exists for this submission. Redirecting to valuations list...");
          window.location.href = '/admin/valuations';
          return;
        }
        
        alert('Error creating valuation: ' + data.error);
        return;
      }

      // Redirect to the new valuation
      window.location.href = `/admin/valuations/${data.data.id}`;
    } catch (error) {
      console.error("Error creating valuation:", error);
      alert('Error creating valuation');
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [currentPage, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredQuotes = quotes.filter(quote => {
    const customerName = quote.customers?.name || '';
    const customerEmail = quote.customers?.email || '';
    const vehicleMake = quote.vehicles?.make || '';
    const vehicleModel = quote.vehicles?.model || '';
    
    return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
           vehicleMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
           vehicleModel.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quote Submissions</h1>
            <p className="text-muted-foreground">
              Manage and review customer quote submissions
            </p>
          </div>
          <div className="flex space-x-2">
            <Button>
              <Mail className="h-4 w-4 mr-2" />
              Send Bulk Quotes
            </Button>
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
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quotes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Submissions ({totalCount})</CardTitle>
            <CardDescription>
              Review and manage customer quote requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Estimated Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{quote.customers?.name || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">{quote.customers?.email || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">{quote.customers?.phone || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{quote.vehicles?.year || 'N/A'} {quote.vehicles?.make || 'N/A'} {quote.vehicles?.model || 'N/A'}</div>
                            <div className="text-sm text-muted-foreground">{quote.vehicles?.mileage?.toLocaleString() || 'N/A'} miles</div>
                            <div className="text-sm text-muted-foreground">VIN: {quote.vehicles?.vin || 'N/A'}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${quote.estimated_value?.toLocaleString() || 'N/A'}
                        </TableCell>
                        <TableCell>{getStatusBadge(quote.status)}</TableCell>
                        <TableCell>
                          {new Date(quote.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Link href={`/admin/quotes/${quote.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            </Link>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => createValuation(quote.id)}
                            >
                              <Calculator className="h-4 w-4 mr-1" />
                              Valuation
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4 mr-1" />
                              Quote
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} results
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
