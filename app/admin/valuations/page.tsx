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
  Plus,
  Car,
  Calculator,
  TrendingUp,
  FileText,
  Clock,
  DollarSign,
  Target,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Valuation {
  id: string;
  quote_submission_id: string;
  version: number;
  status: string;
  market_value: number;
  condition_adjustment: number;
  mileage_adjustment: number;
  final_valuation: number;
  admin_notes: string;
  market_trends: string;
  comparable_vehicles: Record<string, unknown>[];
  created_at: string;
  updated_at: string;
  quote_submission?: {
    customer_name: string;
    customer_email: string;
    vehicle_make: string;
    vehicle_model: string;
    vehicle_year: number;
    vehicle_mileage: number;
    vehicle_condition: string;
  };
}

interface ValuationMetrics {
  totalValuations: number;
  pendingValuations: number;
  completedValuations: number;
  averageValuationTime: number;
  averageValuationAmount: number;
  valuationAccuracy: number;
  topPerformingModels: Array<{model: string, count: number, averageValue: number}>;
  valuationTrends: Array<{date: string, count: number, averageValue: number}>;
  period: string;
}

export default function ValuationsPage() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [metrics, setMetrics] = useState<ValuationMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "final", label: "Final" },
    { value: "revised", label: "Revised" },
    { value: "void", label: "Void" }
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'final':
        return <Badge variant="default">Final</Badge>;
      case 'revised':
        return <Badge variant="outline">Revised</Badge>;
      case 'void':
        return <Badge variant="destructive">Void</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const fetchValuations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/valuations');
      const data = await response.json();
      
      if (data.error) {
        console.error("Error fetching valuations:", data.error);
        return;
      }

      setValuations(data.data || []);
    } catch (error) {
      console.error("Error fetching valuations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/valuations/metrics?days=30');
      const data = await response.json();
      
      if (data.error) {
        console.error("Error fetching metrics:", data.error);
        return;
      }

      setMetrics(data.data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  useEffect(() => {
    fetchValuations();
    fetchMetrics();
  }, []);

  const filteredValuations = valuations.filter(valuation => {
    const matchesSearch = 
      valuation.quote_submission?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      valuation.quote_submission?.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      valuation.quote_submission?.vehicle_make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      valuation.quote_submission?.vehicle_model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || valuation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Valuations</h1>
            <p className="text-muted-foreground">
              Manage vehicle valuations and market analysis
            </p>
          </div>
          <div className="flex space-x-2">
            <Link href="/admin/valuations/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Valuation
              </Button>
            </Link>
          </div>
        </div>

        {/* Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Valuations</CardTitle>
                <Calculator className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalValuations}</div>
                <p className="text-xs text-muted-foreground">
                  Last {metrics.period}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.pendingValuations}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting completion
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Value</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.averageValuationAmount.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Per valuation
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.valuationAccuracy}%</div>
                <p className="text-xs text-muted-foreground">
                  Market accuracy
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Performing Models */}
        {metrics && metrics.topPerformingModels.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Top Performing Models
              </CardTitle>
              <CardDescription>
                Most frequently valued vehicle models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.topPerformingModels.slice(0, 5).map((model, index) => (
                  <div key={model.model} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{model.model}</div>
                        <div className="text-sm text-muted-foreground">
                          {model.count} valuations • ${model.averageValue.toLocaleString()} avg
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{model.count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Valuations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Valuations ({filteredValuations.length})</CardTitle>
            <CardDescription>
              Vehicle valuations and market analysis
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
                    <TableHead>Market Value</TableHead>
                    <TableHead>Adjustments</TableHead>
                    <TableHead>Final Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredValuations.map((valuation) => (
                    <TableRow key={valuation.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{valuation.quote_submission?.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{valuation.quote_submission?.customer_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {valuation.quote_submission?.vehicle_year} {valuation.quote_submission?.vehicle_make} {valuation.quote_submission?.vehicle_model}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {valuation.quote_submission?.vehicle_mileage?.toLocaleString()} miles • {valuation.quote_submission?.vehicle_condition}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${valuation.market_value?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Condition: {valuation.condition_adjustment > 0 ? '+' : ''}${valuation.condition_adjustment}</div>
                          <div>Mileage: {valuation.mileage_adjustment > 0 ? '+' : ''}${valuation.mileage_adjustment}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-lg">
                        ${valuation.final_valuation?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(valuation.status)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">v{valuation.version}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/admin/valuations/${valuation.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
