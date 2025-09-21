"use client";

import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Car, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  Edit,
  Eye
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface QuoteSubmission {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  vehicle: string;
  vin: string;
  mileage: string;
  condition: string;
  estimatedValue: string;
  status: string;
  submittedAt: string;
  images: number;
}

export default function AdminDashboard() {
  const [quoteSubmissions, setQuoteSubmissions] = useState<QuoteSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with real data later
  const stats = [
    { label: "Total Quote Submissions", value: "1,247", icon: FileText, color: "text-blue-600", change: "+12%" },
    { label: "Pending Reviews", value: "23", icon: Clock, color: "text-yellow-600", change: "+8%" },
    { label: "Quotes Sent", value: "856", icon: Mail, color: "text-green-600", change: "+15%" },
    { label: "Total Revenue", value: "$124,500", icon: TrendingUp, color: "text-orange-600", change: "+23%" },
  ];

  const recentQuoteSubmissions = [
    {
      id: 1,
      customerName: "John Doe",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      vehicle: "2020 Toyota Camry",
      vin: "1HGBH41JXMN109186",
      mileage: "45,000",
      condition: "Good",
      estimatedValue: "$18,500",
      status: "Pending Review",
      submittedAt: "2024-01-15T10:30:00Z",
      images: 8
    },
    {
      id: 2,
      customerName: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 (555) 987-6543",
      vehicle: "2019 Honda Civic",
      vin: "2HGFB2F59KH123456",
      mileage: "32,000",
      condition: "Excellent",
      estimatedValue: "$15,200",
      status: "Quote Sent",
      submittedAt: "2024-01-14T14:20:00Z",
      images: 12
    },
    {
      id: 3,
      customerName: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1 (555) 456-7890",
      vehicle: "2018 Ford Focus",
      vin: "1FAHP3F28JL123456",
      mileage: "58,000",
      condition: "Fair",
      estimatedValue: "$12,800",
      status: "Under Review",
      submittedAt: "2024-01-13T09:15:00Z",
      images: 6
    }
  ];

  useEffect(() => {
    // Simulate loading quote submissions
    const loadQuoteSubmissions = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setQuoteSubmissions(recentQuoteSubmissions);
        setLoading(false);
      }, 1000);
    };

    loadQuoteSubmissions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };


  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your car selling platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.label}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage quote submissions and platform content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link href="/admin/quotes">
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Review Quote Submissions
                </Button>
              </Link>
              <Link href="/admin/valuations">
                <Button variant="outline">
                  <Car className="h-4 w-4 mr-2" />
                  Manage Valuations
                </Button>
              </Link>
              <Link href="/admin/content">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Content
                </Button>
              </Link>
              <Link href="/admin/emails">
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Quotes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Quote Submissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Quote Submissions</CardTitle>
                <CardDescription>
                  Latest vehicle quote requests from customers
                </CardDescription>
              </div>
              <Link href="/admin/quotes">
                <Button variant="outline" size="sm">
                  View All Submissions
                </Button>
              </Link>
            </div>
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
                    <TableHead>Estimated Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentQuoteSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{submission.customerName}</div>
                          <div className="text-sm text-muted-foreground">{submission.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{submission.vehicle}</div>
                          <div className="text-sm text-muted-foreground">{submission.mileage} miles</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{submission.estimatedValue}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/admin/quotes/${submission.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>


        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>
              Important notifications and pending actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">23 quote submissions pending review</p>
                  <p className="text-sm text-yellow-700">New vehicle quotes require admin evaluation</p>
                </div>
                <Link href="/admin/quotes">
                  <Button size="sm" variant="outline" className="ml-auto">
                    Review Now
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">8 valuations ready for quotes</p>
                  <p className="text-sm text-blue-700">Evaluated submissions ready to send quotes</p>
                </div>
                <Link href="/admin/emails">
                  <Button size="sm" variant="outline" className="ml-auto">
                    Send Quotes
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">15 quotes sent this week</p>
                  <p className="text-sm text-green-700">Customer quotes successfully delivered</p>
                </div>
                <Link href="/admin/analytics">
                  <Button size="sm" variant="outline" className="ml-auto">
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

