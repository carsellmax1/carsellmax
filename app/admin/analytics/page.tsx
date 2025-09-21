'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  RefreshCw,
  Users,
  Car,
  Mail,
  FileText
} from 'lucide-react';

interface OpsMetrics {
  slaMetrics: {
    submissionToReview: {
      total: number;
      within24h: number;
      within48h: number;
      over48h: number;
      avgHours: number;
    };
    reviewToSend: {
      total: number;
      within24h: number;
      within48h: number;
      over48h: number;
      avgHours: number;
    };
  };
  acceptanceMetrics: {
    totalOffers: number;
    accepted: number;
    declined: number;
    expired: number;
    pending: number;
    acceptanceRate: number;
  };
  discountMetrics: {
    totalValuations: number;
    totalDiscount: number;
    avgDiscount: number;
    avgDiscountPercentage: number;
  };
  channelMetrics: {
    total: number;
    bySource: Record<string, number>;
  };
}

interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
  data: Record<string, unknown>[];
}

interface CohortData {
  byVehicle: {
    byMake: Record<string, unknown>;
    byModel: Record<string, unknown>;
    byYear: Record<string, unknown>;
    byMakeModel: Record<string, unknown>;
  };
  bySource: Record<string, unknown>;
  byGeography: {
    byState: Record<string, unknown>;
    byCity: Record<string, unknown>;
  };
  funnel: {
    submissions: number;
    underReview: number;
    valuationReady: number;
    offerSent: number;
    accepted: number;
    declined: number;
    rates: Record<string, number>;
  };
}

export default function AnalyticsPage() {
  const [opsMetrics, setOpsMetrics] = useState<OpsMetrics | null>(null);
  const [cohortData, setCohortData] = useState<CohortData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [opsResponse, cohortResponse, alertsResponse] = await Promise.all([
        fetch(`/api/admin/analytics/ops-metrics?days=${selectedPeriod}`),
        fetch(`/api/admin/analytics/cohorts-funnels?days=${selectedPeriod}`),
        fetch('/api/admin/analytics/alerts')
      ]);

      const [opsData, cohortData, alertsData] = await Promise.all([
        opsResponse.json(),
        cohortResponse.json(),
        alertsResponse.json()
      ]);

      if (opsData.data) setOpsMetrics(opsData.data);
      if (cohortData.data) setCohortData(cohortData.data);
      if (alertsData.data) setAlerts(alertsData.data.alerts);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: string) => {
    try {
      const response = await fetch(`/api/admin/analytics/export?type=${type}&format=csv&days=${selectedPeriod}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <FileText className="h-4 w-4 text-blue-500" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics & Reporting</h1>
            <p className="text-muted-foreground">
              Insights and operational metrics for your car selling platform
            </p>
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
              className="px-3 py-2 border rounded-md"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <Button onClick={fetchAnalyticsData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => handleExport('finance')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Finance
            </Button>
            <Button onClick={() => handleExport('daily-summary')} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Daily Summary
            </Button>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Alerts & Notifications</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {alerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      {getAlertIcon(alert.type)}
                      <CardTitle className="text-sm">{alert.title}</CardTitle>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.count}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Tabs defaultValue="ops" className="space-y-4">
          <TabsList>
            <TabsTrigger value="ops">Operations</TabsTrigger>
            <TabsTrigger value="cohorts">Cohorts & Funnels</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Operations Metrics Tab */}
          <TabsContent value="ops" className="space-y-6">
            {opsMetrics && (
              <>
                {/* SLA Metrics */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-5 w-5" />
                        <span>Submission to Review SLA</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Within 24h:</span>
                          <span className="font-medium">{opsMetrics.slaMetrics.submissionToReview.within24h}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Within 48h:</span>
                          <span className="font-medium">{opsMetrics.slaMetrics.submissionToReview.within48h}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Over 48h:</span>
                          <span className="font-medium text-red-600">{opsMetrics.slaMetrics.submissionToReview.over48h}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Hours:</span>
                          <span className="font-medium">{opsMetrics.slaMetrics.submissionToReview.avgHours.toFixed(1)}h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Mail className="h-5 w-5" />
                        <span>Review to Send SLA</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Within 24h:</span>
                          <span className="font-medium">{opsMetrics.slaMetrics.reviewToSend.within24h}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Within 48h:</span>
                          <span className="font-medium">{opsMetrics.slaMetrics.reviewToSend.within48h}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Over 48h:</span>
                          <span className="font-medium text-red-600">{opsMetrics.slaMetrics.reviewToSend.over48h}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Avg Hours:</span>
                          <span className="font-medium">{opsMetrics.slaMetrics.reviewToSend.avgHours.toFixed(1)}h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Acceptance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Acceptance Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{opsMetrics.acceptanceMetrics.totalOffers}</div>
                        <div className="text-sm text-muted-foreground">Total Offers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{opsMetrics.acceptanceMetrics.accepted}</div>
                        <div className="text-sm text-muted-foreground">Accepted</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{opsMetrics.acceptanceMetrics.declined}</div>
                        <div className="text-sm text-muted-foreground">Declined</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{opsMetrics.acceptanceMetrics.pending}</div>
                        <div className="text-sm text-muted-foreground">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{opsMetrics.acceptanceMetrics.acceptanceRate.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Acceptance Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Discount Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Discount Analysis</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{opsMetrics.discountMetrics.totalValuations}</div>
                        <div className="text-sm text-muted-foreground">Total Valuations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">${opsMetrics.discountMetrics.avgDiscount.toFixed(0)}</div>
                        <div className="text-sm text-muted-foreground">Avg Discount</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{opsMetrics.discountMetrics.avgDiscountPercentage.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">Avg Discount %</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Cohorts & Funnels Tab */}
          <TabsContent value="cohorts" className="space-y-6">
            {cohortData && (
              <>
                {/* Funnel Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Funnel</CardTitle>
                    <CardDescription>Track the flow from submission to acceptance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">Submissions</span>
                        </div>
                        <div className="text-2xl font-bold">{cohortData.funnel.submissions}</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-yellow-600" />
                          <span className="font-medium">Under Review</span>
                        </div>
                        <div className="text-2xl font-bold">{cohortData.funnel.underReview}</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Car className="h-5 w-5 text-purple-600" />
                          <span className="font-medium">Valuation Ready</span>
                        </div>
                        <div className="text-2xl font-bold">{cohortData.funnel.valuationReady}</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-5 w-5 text-green-600" />
                          <span className="font-medium">Offers Sent</span>
                        </div>
                        <div className="text-2xl font-bold">{cohortData.funnel.offerSent}</div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-5 w-5 text-emerald-600" />
                          <span className="font-medium">Accepted</span>
                        </div>
                        <div className="text-2xl font-bold">{cohortData.funnel.accepted}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Vehicles */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Makes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(cohortData.byVehicle.byMake)
                          .sort(([,a], [,b]) => b.total - a.total)
                          .slice(0, 5)
                          .map(([make, data]) => (
                            <div key={make} className="flex justify-between items-center">
                              <span>{make}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">{data.converted}/{data.total}</span>
                                <Badge variant="outline">{data.total}</Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Models</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(cohortData.byVehicle.byModel)
                          .sort(([,a], [,b]) => b.total - a.total)
                          .slice(0, 5)
                          .map(([model, data]) => (
                            <div key={model} className="flex justify-between items-center">
                              <span>{model}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">{data.converted}/{data.total}</span>
                                <Badge variant="outline">{data.total}</Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>Download data for external analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Finance Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed financial data including offers, valuations, and discounts
                    </p>
                    <Button onClick={() => handleExport('finance')} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Daily Summary</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Daily metrics and activity summary for team reporting
                    </p>
                    <Button onClick={() => handleExport('daily-summary')} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
