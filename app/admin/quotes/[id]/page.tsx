"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Car, User, Camera, Video, FileText, Calendar, DollarSign } from "lucide-react";
import Image from "next/image";

interface QuoteSubmission {
  id: string;
  status: string;
  estimated_value: number;
  additional_notes: string;
  vehicle_condition_details: Record<string, unknown>;
  exterior_images: Record<string, string | null>;
  interior_images: Record<string, string | null>;
  engine_videos: Record<string, unknown>;
  submission_step: string;
  created_at: string;
  updated_at: string;
  customers: {
    name: string;
    email: string;
    phone: string;
    address: Record<string, unknown>;
  };
  vehicles: {
    make: string;
    model: string;
    year: number;
    vin: string;
    mileage: number;
    color: string;
    condition: string;
    transmission: string;
    fuel_type: string;
    interior_color: string;
    exterior_color: string;
    drive_train: string;
    additional_info: string;
  };
  valuations: any;
}

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<QuoteSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/admin/quotes/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quote');
        }
        const data = await response.json();
        setQuote(data.data);
      } catch (err) {
        console.error('Error fetching quote:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch quote');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchQuote();
    }
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_review': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'valuation_ready': return 'bg-green-100 text-green-800';
      case 'quote_sent': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-muted-foreground mb-6">{error || 'Quote not found'}</p>
            <Button onClick={() => router.push('/admin/quotes')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quotes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/quotes')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Quotes
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Quote Submission #{quote.id.slice(-8)}</h1>
              <p className="text-muted-foreground">
                {quote.vehicles.year} {quote.vehicles.make} {quote.vehicles.model}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(quote.status)}>
            {quote.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <p className="text-sm">{quote.customers.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-sm">{quote.customers.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Phone</label>
                        <p className="text-sm">{quote.customers.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Address</label>
                        <p className="text-sm">
                          {quote.customers.address?.street}, {quote.customers.address?.city}, {quote.customers.address?.state} {quote.customers.address?.zip}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submission Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Submission Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Estimated Value</label>
                        <p className="text-2xl font-bold text-green-600">${quote.estimated_value.toLocaleString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Submission Step</label>
                        <p className="text-sm">{quote.submission_step}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Created</label>
                        <p className="text-sm">{formatDate(quote.created_at)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                        <p className="text-sm">{formatDate(quote.updated_at)}</p>
                      </div>
                    </div>
                    {quote.additional_notes && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Additional Notes</label>
                        <p className="text-sm bg-muted p-3 rounded-md">{quote.additional_notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="vehicle" className="space-y-6">
                {/* Basic Vehicle Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car className="w-5 h-5" />
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Year</label>
                        <p className="text-sm">{quote.vehicles.year}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Make & Model</label>
                        <p className="text-sm">{quote.vehicles.make} {quote.vehicles.model}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">VIN</label>
                        <p className="text-sm font-mono">{quote.vehicles.vin || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Mileage</label>
                        <p className="text-sm">{quote.vehicles.mileage.toLocaleString()} miles</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Exterior Color</label>
                        <p className="text-sm capitalize">{quote.vehicles.exterior_color || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Interior Color</label>
                        <p className="text-sm capitalize">{quote.vehicles.interior_color || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Transmission</label>
                        <p className="text-sm capitalize">{quote.vehicles.transmission || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Fuel Type</label>
                        <p className="text-sm capitalize">{quote.vehicles.fuel_type || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Drive Train</label>
                        <p className="text-sm capitalize">{quote.vehicles.drive_train || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Condition</label>
                        <p className="text-sm capitalize">{quote.vehicles.condition}</p>
                      </div>
                    </div>
                    {quote.vehicles.additional_info && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Additional Information</label>
                        <p className="text-sm bg-muted p-3 rounded-md">{quote.vehicles.additional_info}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Vehicle Condition Details */}
                {quote.vehicle_condition_details && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Condition Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(quote.vehicle_condition_details).map(([key, value]) => (
                          <div key={key}>
                            <label className="text-sm font-medium text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                            <p className="text-sm capitalize">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="images" className="space-y-6">
                {/* Exterior Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Exterior Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(quote.exterior_images || {}).map(([position, imageData]) => (
                        <div key={position} className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground capitalize">
                            {position.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                            {imageData ? (
                              <Image
                                src={imageData}
                                alt={`${position} exterior view`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Interior Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Interior Photos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(quote.interior_images || {}).map(([position, imageData]) => (
                        <div key={position} className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground capitalize">
                            {position.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                            {imageData ? (
                              <Image
                                src={imageData}
                                alt={`${position} interior view`}
                                width={200}
                                height={200}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
                {/* Engine Videos */}
                {quote.engine_videos && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="w-5 h-5" />
                        Engine Videos & Audio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {quote.engine_videos.engineVideo && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Engine Video</label>
                          <div className="mt-2">
                            <video
                              src={quote.engine_videos.engineVideo}
                              controls
                              className="w-full max-w-md rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                      
                      {quote.engine_videos.engineSound && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Engine Sound</label>
                          <div className="mt-2">
                            <audio
                              src={quote.engine_videos.engineSound}
                              controls
                              className="w-full max-w-md"
                            />
                          </div>
                        </div>
                      )}

                      {quote.engine_videos.additionalVideos && quote.engine_videos.additionalVideos.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Additional Videos</label>
                          <div className="mt-2 space-y-2">
                            {quote.engine_videos.additionalVideos.map((video: string, index: number) => (
                              <video
                                key={index}
                                src={video}
                                controls
                                className="w-full max-w-md rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {quote.engine_videos.notes && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Video Notes</label>
                          <p className="text-sm bg-muted p-3 rounded-md mt-2">{quote.engine_videos.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  Create Valuation
                </Button>
                <Button className="w-full" variant="outline">
                  Send Offer
                </Button>
                <Button className="w-full" variant="outline">
                  Update Status
                </Button>
              </CardContent>
            </Card>

            {/* Submission Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Submission Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(quote.status)}>
                    {quote.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Value</span>
                  <span className="text-sm font-medium">${quote.estimated_value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Mileage</span>
                  <span className="text-sm font-medium">{quote.vehicles.mileage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Submitted</span>
                  <span className="text-sm font-medium">{formatDate(quote.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
