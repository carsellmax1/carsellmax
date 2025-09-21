"use client";

import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calculator, 
  TrendingUp, 
  FileText, 
  Save, 
  History,
  CheckCircle,
  AlertCircle,
  Car,
  Send
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useCarStore } from "@/lib/car-store";
import OfferModal from "@/components/modals/offer-modal";

interface Valuation {
  id: string;
  quote_submission_id: string;
  version: number;
  status: string;
  vehicle_year: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_vin?: string;
  vehicle_mileage: number;
  vehicle_color?: string;
  vehicle_condition: string;
  base_value: number;
  condition_adjustment: number;
  mileage_adjustment: number;
  options_adjustment: number;
  market_adjustment: number;
  total_adjustments: number;
  adjusted_value: number;
  inspection_fee: number;
  processing_fee: number;
  total_fees: number;
  net_offer_min: number;
  net_offer_max: number;
  recommended_offer: number;
  justification_rationale?: string;
  calculation_notes?: string;
  market_analysis?: string;
  condition_assessment?: string;
  risk_factors?: string;
  market_data: Record<string, unknown>;
  comparable_sales: Record<string, unknown>[];
  market_trends: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  quote_submission?: {
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
  };
}

interface ValuationHistory {
  id: string;
  action: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  change_reason?: string;
  created_at: string;
  created_by?: {
    email: string;
  };
}

export default function ValuationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [valuation, setValuation] = useState<Valuation | null>(null);
  const [history, setHistory] = useState<ValuationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculation' | 'history'>('calculation');
  const [showOfferModal, setShowOfferModal] = useState(false);
  
  // Use store for valuation data
  const { 
    valuationData, 
    isCalculating, 
    calculationError,
    calculateValuation,
    setValuationData
  } = useCarStore();
  
  // Form state - sync with store
  const [formData, setFormData] = useState({
    base_value: 0,
    condition_adjustment: 0,
    mileage_adjustment: 0,
    options_adjustment: 0,
    market_adjustment: 0,
    inspection_fee: 150,
    processing_fee: 200,
    justification_rationale: '',
    calculation_notes: '',
    market_analysis: '',
    condition_assessment: '',
    risk_factors: ''
  });
  const fetchValuation = useCallback(async () => {
    try {
      setLoading(true);
      const resolvedParams = await params;
      const response = await fetch(`/api/admin/valuations/${resolvedParams.id}`);
      const data = await response.json();
      
      if (data.error) {
        console.error("Error fetching valuation:", data.error);
        return;
      }

      setValuation(data.data);
      if (data.data) {
        // Sync with store
        const storeData = {
          base_value: data.data.base_value || 0,
          condition_adjustment: data.data.condition_adjustment || 0,
          mileage_adjustment: data.data.mileage_adjustment || 0,
          options_adjustment: data.data.options_adjustment || 0,
          market_adjustment: data.data.market_adjustment || 0,
          total_adjustments: data.data.total_adjustments || 0,
          adjusted_value: data.data.adjusted_value || 0,
          inspection_fee: data.data.inspection_fee || 150,
          processing_fee: data.data.processing_fee || 200,
          total_fees: data.data.total_fees || 350,
          net_offer_min: data.data.net_offer_min || 0,
          net_offer_max: data.data.net_offer_max || 0,
          recommended_offer: data.data.recommended_offer || 0,
          justification_rationale: data.data.justification_rationale || '',
          calculation_notes: data.data.calculation_notes || '',
          market_analysis: data.data.market_analysis || '',
          condition_assessment: data.data.condition_assessment || '',
          risk_factors: data.data.risk_factors || '',
          market_data: data.data.market_data || null,
          ai_analysis: data.data.ai_analysis || null,
          confidence_level: data.data.confidence_level || 'medium',
          methodology_version: '2.0',
          last_calculated: new Date().toISOString()
        };
        
        setValuationData(storeData);
        
        setFormData({
          base_value: data.data.base_value || 0,
          condition_adjustment: data.data.condition_adjustment || 0,
          mileage_adjustment: data.data.mileage_adjustment || 0,
          options_adjustment: data.data.options_adjustment || 0,
          market_adjustment: data.data.market_adjustment || 0,
          inspection_fee: data.data.inspection_fee || 150,
          processing_fee: data.data.processing_fee || 200,
          justification_rationale: data.data.justification_rationale || '',
          calculation_notes: data.data.calculation_notes || '',
          market_analysis: data.data.market_analysis || '',
          condition_assessment: data.data.condition_assessment || '',
          risk_factors: data.data.risk_factors || ''
        });
      }
    } catch (error) {
      console.error("Error fetching valuation:", error);
    } finally {
      setLoading(false);
    }
  }, [params, setValuationData]);

  const fetchHistory = useCallback(async () => {
    try {
      const resolvedParams = await params;
      const response = await fetch(`/api/admin/valuations/${resolvedParams.id}/history`);
      const data = await response.json();
      
      if (data.error) {
        console.error("Error fetching history:", data.error);
        return;
      }

      setHistory(data.data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }, [params]);

  useEffect(() => {
    fetchValuation();
    fetchHistory();
  }, [params, fetchValuation, fetchHistory]);

  // Auto-calculate when valuation data is loaded
  useEffect(() => {
    if (valuation && formData.base_value === 0 && !valuationData) {
      console.log('Auto-calculating valuation for:', valuation);
      
      const vehicleData = {
        vehicle_year: valuation.vehicle_year,
        vehicle_make: valuation.vehicle_make,
        vehicle_model: valuation.vehicle_model,
        vehicle_mileage: valuation.vehicle_mileage,
        vehicle_condition: valuation.vehicle_condition,
        vehicle_vin: valuation.vehicle_vin,
        base_value: 0
      };

      calculateValuation(vehicleData);
    }
  }, [valuation, formData.base_value, valuationData, calculateValuation]);

  // Sync form data with store changes
  useEffect(() => {
    if (valuationData) {
      setFormData(prev => ({
        ...prev,
        base_value: valuationData.base_value,
        condition_adjustment: valuationData.condition_adjustment,
        mileage_adjustment: valuationData.mileage_adjustment,
        options_adjustment: valuationData.options_adjustment,
        market_adjustment: valuationData.market_adjustment,
        inspection_fee: valuationData.inspection_fee,
        processing_fee: valuationData.processing_fee,
        justification_rationale: valuationData.justification_rationale,
        calculation_notes: valuationData.calculation_notes,
        market_analysis: valuationData.market_analysis,
        condition_assessment: valuationData.condition_assessment,
        risk_factors: valuationData.risk_factors
      }));
    }
  }, [valuationData]);

  const calculateTotals = () => {
    const total_adjustments = formData.condition_adjustment + formData.mileage_adjustment + 
                            formData.options_adjustment + formData.market_adjustment;
    const adjusted_value = formData.base_value + total_adjustments;
    const total_fees = formData.inspection_fee + formData.processing_fee;
    const net_offer_min = Math.max(0, adjusted_value - total_fees - (adjusted_value * 0.1));
    const net_offer_max = Math.max(0, adjusted_value - total_fees + (adjusted_value * 0.1));
    const recommended_offer = Math.max(0, adjusted_value - total_fees);

    return {
      total_adjustments,
      adjusted_value,
      total_fees,
      net_offer_min,
      net_offer_max,
      recommended_offer
    };
  };


  const handleCalculateValuation = async () => {
    if (!valuation) return;

    const vehicleData = {
      vehicle_year: valuation.vehicle_year,
      vehicle_make: valuation.vehicle_make,
      vehicle_model: valuation.vehicle_model,
      vehicle_mileage: valuation.vehicle_mileage,
      vehicle_condition: valuation.vehicle_condition,
      base_value: formData.base_value || 0,
      market_data: valuation.market_data || {}
    };

    await calculateValuation(vehicleData);
    
    // Update form data when store data changes
    if (valuationData) {
      setFormData(prev => ({
        ...prev,
        base_value: valuationData.base_value,
        condition_adjustment: valuationData.condition_adjustment,
        mileage_adjustment: valuationData.mileage_adjustment,
        options_adjustment: valuationData.options_adjustment,
        market_adjustment: valuationData.market_adjustment,
        inspection_fee: valuationData.inspection_fee,
        processing_fee: valuationData.processing_fee,
        justification_rationale: valuationData.justification_rationale,
        calculation_notes: valuationData.calculation_notes,
        market_analysis: valuationData.market_analysis,
        condition_assessment: valuationData.condition_assessment,
        risk_factors: valuationData.risk_factors
      }));

      // Update valuation with market data
      setValuation(prev => prev ? {
        ...prev,
        market_data: (valuationData.market_data as unknown as Record<string, unknown>) || prev.market_data
      } : prev);
    }
  };

  const handleSave = async (status: 'draft' | 'final') => {
    try {
      setSaving(true);
      const resolvedParams = await params;
      const totals = calculateTotals();
      
      const response = await fetch(`/api/admin/valuations/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ...totals,
          status
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("Error saving valuation:", data.error);
        return;
      }

      // If marking as final, update quote status to valuation_ready
      if (status === 'final' && valuation?.quote_submission_id) {
        try {
          await fetch(`/api/admin/quotes/${valuation.quote_submission_id}/status`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'valuation_ready'
            }),
          });
        } catch (error) {
          console.error("Error updating quote status:", error);
        }
      }

      // Refresh data
      await fetchValuation();
      await fetchHistory();
    } catch (error) {
      console.error("Error saving valuation:", error);
    } finally {
      setSaving(false);
    }
  };

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

  const totals = calculateTotals();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!valuation) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Valuation Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested valuation could not be found.</p>
          <Link href="/admin/valuations">
            <Button>Back to Valuations</Button>
          </Link>
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
            <div className="flex items-center space-x-2 mb-2">
              <h1 className="text-3xl font-bold">Valuation Workspace</h1>
              {getStatusBadge(valuation.status)}
              <Badge variant="outline">v{valuation.version}</Badge>
            </div>
            <p className="text-muted-foreground">
              {valuation.quote_submission?.vehicles?.year} {valuation.quote_submission?.vehicles?.make} {valuation.quote_submission?.vehicles?.model}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleSave('draft')}
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={() => handleSave('final')}
              disabled={saving || valuation.status === 'final'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Final
            </Button>
            <Button 
              variant="default"
              onClick={() => setShowOfferModal(true)}
              disabled={!valuation}
            >
              <Send className="h-4 w-4 mr-2" />
              Create Offer
            </Button>
          </div>
        </div>

        {/* Vehicle Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Car className="h-5 w-5 mr-2" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Customer</Label>
                <p className="font-medium">{valuation.quote_submission?.customers?.name}</p>
                <p className="text-sm text-muted-foreground">{valuation.quote_submission?.customers?.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Vehicle</Label>
                <p className="font-medium">
                  {valuation.vehicle_year} {valuation.vehicle_make} {valuation.vehicle_model}
                </p>
                <p className="text-sm text-muted-foreground">
                  {valuation.vehicle_mileage.toLocaleString()} miles • {valuation.vehicle_condition}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">VIN</Label>
                <p className="font-mono text-sm">{valuation.vehicle_vin || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <Button
            variant={activeTab === 'calculation' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('calculation')}
            className="flex-1"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Valuation & Analysis
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('history')}
            className="flex-1"
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>

        {/* Calculation Tab */}
        {activeTab === 'calculation' && (
          <div className="space-y-6">
            {/* Market Data Validation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Market Data Validation
                </CardTitle>
                <CardDescription>Verify valuation against real market data sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Current Market Search:</span>
                    <Button onClick={handleCalculateValuation} variant="outline" size="sm" disabled={isCalculating}>
                      <Calculator className="h-4 w-4 mr-2" />
                      {isCalculating ? 'Calculating...' : 'Refresh Market Data'}
                    </Button>
                  </div>
                  
                  {(valuationData?.market_data || valuation.market_data) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Kelley Blue Book</div>
                        <div className="text-lg font-semibold">
                          {((valuationData?.market_data as unknown as Record<string, unknown>)?.kbb_fair_value as string) || ((valuation.market_data as unknown as Record<string, unknown>)?.kbb_fair_value as string) || 'N/A'}
                        </div>
                        <a 
                          href={`https://www.kbb.com/car-values/${valuation.vehicle_year}/${valuation.vehicle_make.toLowerCase()}/${valuation.vehicle_model.toLowerCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View on KBB →
                        </a>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Edmunds</div>
                        <div className="text-lg font-semibold">
                          {((valuationData?.market_data as unknown as Record<string, unknown>)?.edmunds_value as string) || ((valuation.market_data as unknown as Record<string, unknown>)?.edmunds_value as string) || 'N/A'}
                        </div>
                        <a 
                          href={`https://www.edmunds.com/appraisal/${valuation.vehicle_year}/${valuation.vehicle_make.toLowerCase()}/${valuation.vehicle_model.toLowerCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View on Edmunds →
                        </a>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">CarMax</div>
                        <div className="text-lg font-semibold">
                          {((valuationData?.market_data as unknown as Record<string, unknown>)?.carmax_value as string) || ((valuation.market_data as unknown as Record<string, unknown>)?.carmax_value as string) || 'N/A'}
                        </div>
                        <a 
                          href={`https://www.carmax.com/cars/${valuation.vehicle_year}/${valuation.vehicle_make.toLowerCase()}/${valuation.vehicle_model.toLowerCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View on CarMax →
                        </a>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Carvana</div>
                        <div className="text-lg font-semibold">
                          {((valuationData?.market_data as unknown as Record<string, unknown>)?.carvana_value as string) || ((valuation.market_data as unknown as Record<string, unknown>)?.carvana_value as string) || 'N/A'}
                        </div>
                        <a 
                          href={`https://www.carvana.com/cars/${valuation.vehicle_year}/${valuation.vehicle_make.toLowerCase()}/${valuation.vehicle_model.toLowerCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View on Carvana →
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {calculationError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium mb-2 text-red-800">Calculation Error</h4>
                      <p className="text-sm text-red-700">{calculationError}</p>
                    </div>
                  )}
                  
                  {(((valuationData?.market_data as unknown as Record<string, unknown>)?.explanation as string) || ((valuation.market_data as unknown as Record<string, unknown>)?.explanation as string)) && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2 text-foreground dark:text-foreground">AI Market Analysis</h4>
                    <p className="text-sm text-foreground dark:text-foreground leading-relaxed">
                      {((valuationData?.market_data as unknown as Record<string, unknown>)?.explanation as string) || ((valuation.market_data as unknown as Record<string, unknown>)?.explanation as string)}
                    </p>
                  </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inputs */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Valuation Inputs</CardTitle>
                      <CardDescription>Adjust the valuation parameters</CardDescription>
                    </div>
                  <Button onClick={handleCalculateValuation} variant="outline" disabled={isCalculating}>
                    <Calculator className="h-4 w-4 mr-2" />
                    {isCalculating ? 'Calculating...' : 'Auto Calculate'}
                  </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="base_value">Base Market Value</Label>
                    <Input
                      id="base_value"
                      type="number"
                      value={formData.base_value}
                      onChange={(e) => setFormData({...formData, base_value: parseFloat(e.target.value) || 0})}
                      placeholder="Enter base market value"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="condition_adjustment">Condition Adjustment</Label>
                      <Input
                        id="condition_adjustment"
                        type="number"
                        value={formData.condition_adjustment}
                        onChange={(e) => setFormData({...formData, condition_adjustment: parseFloat(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mileage_adjustment">Mileage Adjustment</Label>
                      <Input
                        id="mileage_adjustment"
                        type="number"
                        value={formData.mileage_adjustment}
                        onChange={(e) => setFormData({...formData, mileage_adjustment: parseFloat(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="options_adjustment">Options Adjustment</Label>
                      <Input
                        id="options_adjustment"
                        type="number"
                        value={formData.options_adjustment}
                        onChange={(e) => setFormData({...formData, options_adjustment: parseFloat(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="market_adjustment">Market Adjustment</Label>
                      <Input
                        id="market_adjustment"
                        type="number"
                        value={formData.market_adjustment}
                        onChange={(e) => setFormData({...formData, market_adjustment: parseFloat(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="inspection_fee">Inspection Fee</Label>
                      <Input
                        id="inspection_fee"
                        type="number"
                        value={formData.inspection_fee}
                        onChange={(e) => setFormData({...formData, inspection_fee: parseFloat(e.target.value) || 0})}
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <Label htmlFor="processing_fee">Processing Fee</Label>
                      <Input
                        id="processing_fee"
                        type="number"
                        value={formData.processing_fee}
                        onChange={(e) => setFormData({...formData, processing_fee: parseFloat(e.target.value) || 0})}
                        placeholder="200"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Valuation Results</CardTitle>
                  <CardDescription>Calculated valuation and offer range</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Value:</span>
                      <span className="font-medium">${formData.base_value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Total Adjustments:</span>
                      <span>${totals.total_adjustments.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Adjusted Value:</span>
                      <span>${totals.adjusted_value.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Total Fees:</span>
                      <span>${totals.total_fees.toLocaleString()}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Recommended Offer:</span>
                      <span className="text-primary">${totals.recommended_offer.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Offer Range:</span>
                      <span>${totals.net_offer_min.toLocaleString()} - ${totals.net_offer_max.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2 text-foreground dark:text-foreground">Adjustment Breakdown</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-foreground dark:text-foreground">Condition:</span>
                        <span className="text-foreground dark:text-foreground font-medium">{formData.condition_adjustment >= 0 ? '+' : ''}${formData.condition_adjustment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground dark:text-foreground">Mileage:</span>
                        <span className="text-foreground dark:text-foreground font-medium">{formData.mileage_adjustment >= 0 ? '+' : ''}${formData.mileage_adjustment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground dark:text-foreground">Options:</span>
                        <span className="text-foreground dark:text-foreground font-medium">{formData.options_adjustment >= 0 ? '+' : ''}${formData.options_adjustment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground dark:text-foreground">Market:</span>
                        <span className="text-foreground dark:text-foreground font-medium">{formData.market_adjustment >= 0 ? '+' : ''}${formData.market_adjustment}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Justification & Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Justification & Analysis
                </CardTitle>
                <CardDescription>Document the reasoning behind this valuation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="justification_rationale">Overall Justification</Label>
                  <Textarea
                    id="justification_rationale"
                    value={formData.justification_rationale}
                    onChange={(e) => setFormData({...formData, justification_rationale: e.target.value})}
                    placeholder="Explain the overall valuation rationale..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calculation_notes">Calculation Notes</Label>
                    <Textarea
                      id="calculation_notes"
                      value={formData.calculation_notes}
                      onChange={(e) => setFormData({...formData, calculation_notes: e.target.value})}
                      placeholder="Document specific calculation details..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="market_analysis">Market Analysis</Label>
                    <Textarea
                      id="market_analysis"
                      value={formData.market_analysis}
                      onChange={(e) => setFormData({...formData, market_analysis: e.target.value})}
                      placeholder="Analyze current market conditions and trends..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="condition_assessment">Condition Assessment</Label>
                    <Textarea
                      id="condition_assessment"
                      value={formData.condition_assessment}
                      onChange={(e) => setFormData({...formData, condition_assessment: e.target.value})}
                      placeholder="Detail the vehicle's condition and any issues..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="risk_factors">Risk Factors</Label>
                    <Textarea
                      id="risk_factors"
                      value={formData.risk_factors}
                      onChange={(e) => setFormData({...formData, risk_factors: e.target.value})}
                      placeholder="Identify any risks or concerns..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}


        {/* History Tab */}
        {activeTab === 'history' && (
          <Card>
            <CardHeader>
              <CardTitle>Valuation History</CardTitle>
              <CardDescription>Track all changes to this valuation</CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No history available</p>
              ) : (
                <div className="space-y-4">
                  {history.map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{entry.action}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(entry.created_at).toLocaleString()}
                          </span>
                        </div>
                        {entry.change_reason && (
                          <p className="text-sm text-muted-foreground mt-1">{entry.change_reason}</p>
                        )}
                        {entry.created_by && (
                          <p className="text-xs text-muted-foreground mt-1">
                            by {entry.created_by.email}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Offer Modal */}
        {valuation && (
          <OfferModal
            isOpen={showOfferModal}
            onClose={() => setShowOfferModal(false)}
            quoteSubmission={{
              id: valuation.quote_submission_id,
              customer_name: valuation.quote_submission?.customers?.name || 'John Smith',
              customer_email: valuation.quote_submission?.customers?.email || 'yswessi@gmail.com',
              customer_phone: valuation.quote_submission?.customers?.phone || '555-123-4567',
              vehicle_year: valuation.quote_submission?.vehicles?.year || valuation.vehicle_year,
              vehicle_make: valuation.quote_submission?.vehicles?.make || valuation.vehicle_make,
              vehicle_model: valuation.quote_submission?.vehicles?.model || valuation.vehicle_model,
              vehicle_mileage: valuation.quote_submission?.vehicles?.mileage || valuation.vehicle_mileage,
               estimated_value: valuationData?.recommended_offer || valuation.recommended_offer || 0
            }}
            valuation={{
              recommended_offer: valuationData?.recommended_offer || valuation.recommended_offer || 0,
              offer_range_min: valuationData?.net_offer_min || (valuation.recommended_offer || 0) - 1000,
              offer_range_max: valuationData?.net_offer_max || (valuation.recommended_offer || 0) + 1000
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}
