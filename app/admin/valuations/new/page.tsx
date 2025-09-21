"use client";

import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Car, 
  Calculator, 
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

interface QuoteSubmission {
  id: string;
  status: string;
  customers?: {
    name: string;
    email: string;
    phone: string;
  };
  vehicles?: {
    make: string;
    model: string;
    year: number;
    vin?: string;
    mileage: number;
    color?: string;
    condition: string;
  };
}

export default function NewValuationPage() {
  const [quoteSubmissions, setQuoteSubmissions] = useState<QuoteSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchQuoteSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/quotes?limit=50');
      const data = await response.json();
      
      if (data.error) {
        console.error("Error fetching quote submissions:", data.error);
        return;
      }

      // Filter for submissions that need valuations
      const submissionsNeedingValuation = data.data.filter((submission: Record<string, unknown>) => 
        submission.status === 'under_review' || submission.status === 'pending_review'
      );

      setQuoteSubmissions(submissionsNeedingValuation);
    } catch (error) {
      console.error("Error fetching quote submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuoteSubmissions();
  }, []);

  const filteredSubmissions = quoteSubmissions.filter(submission => {
    const customerName = submission.customers?.name || '';
    const customerEmail = submission.customers?.email || '';
    const vehicleMake = submission.vehicles?.make || '';
    const vehicleModel = submission.vehicles?.model || '';
    
    return customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
           vehicleMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
           vehicleModel.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const createValuation = async (submissionId: string) => {
    try {
      setCreating(true);
      const response = await fetch('/api/admin/valuations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quote_submission_id: submissionId
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("Error creating valuation:", data.error);
        
        // If valuation already exists, show a better message and redirect to valuations list
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
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/admin/valuations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create New Valuation</h1>
            <p className="text-muted-foreground">
              Select a quote submission to create a valuation
            </p>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by customer name, email, or vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Quote Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Submissions Needing Valuation</CardTitle>
            <CardDescription>
              Select a submission to create a new valuation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Submissions Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'No submissions match your search criteria.' : 'No submissions are ready for valuation.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Car className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium">{submission.customers?.name}</h3>
                            <span className="text-sm text-muted-foreground">
                              {submission.customers?.email}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {submission.vehicles?.year} {submission.vehicles?.make} {submission.vehicles?.model} • 
                            {submission.vehicles?.mileage?.toLocaleString()} miles • 
                            {submission.vehicles?.condition}
                          </div>
                          {submission.vehicles?.vin && (
                            <div className="text-xs text-muted-foreground font-mono">
                              VIN: {submission.vehicles.vin}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => createValuation(submission.id)}
                        disabled={creating}
                        className="flex items-center"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        {creating ? 'Creating...' : 'Create Valuation'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
