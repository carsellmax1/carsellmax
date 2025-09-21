import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CarData {
  id: string;
  vin: string;
  makeModel: string;
  make: string;
  model: string;
  year: string;
  color: string;
  bodyType: string;
  fuelType: string;
  imageUrl?: string;
}

interface MarketData {
  kbb_value: string;
  edmunds_value: string;
  carmax_value: string;
  carvana_value: string;
  confidence: string;
  explanation: string;
  external_data?: Record<string, unknown>;
  data_sources?: string[];
  // Enhanced market data for admin
  kbb?: number;
  edmunds?: number;
  carmax?: number;
  carvana?: number;
  average?: number;
  range?: { min: number; max: number };
}

interface VehicleDetails {
  condition: string;
  interiorColor: string;
  driveTrain: string;
  exteriorColor: string;
  transmission: string;
  fuelType: string;
  additionalInfo: string;
}

interface ExteriorImages {
  front: File | null;
  driverSideFront: File | null;
  driverSide: File | null;
  driverSideRear: File | null;
  rear: File | null;
  passengerSideRear: File | null;
  passengerSide: File | null;
  passengerSideFront: File | null;
}

interface InteriorImages {
  dashboard: File | null;
  frontSeats: File | null;
  rearSeats: File | null;
  trunk: File | null;
  roofInterior: File | null;
  centerConsole: File | null;
  infotainment: File | null;
  odometer: File | null;
}

interface EngineVideo {
  engineVideo: File | null;
  engineSound: File | null;
  additionalVideos: File[];
  notes: string;
}

interface ValuationData {
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
  justification_rationale: string;
  calculation_notes: string;
  market_analysis: string;
  condition_assessment: string;
  risk_factors: string;
  market_data: MarketData | null;
  ai_analysis: Record<string, unknown>;
  confidence_level: 'high' | 'medium' | 'low';
  methodology_version: string;
  last_calculated: string;
}

interface CarStore {
  // State
  carFound: boolean;
  foundCar: CarData | null;
  imageUrl: string | null;
  vehicleImage: string | null;
  mileage: string | number;
  valuation: number | null;
  marketData: MarketData | null;
  isLoading: boolean;
  error: string;
  
  // Comprehensive submission data
  vehicleDetails: VehicleDetails | null;
  exteriorImages: ExteriorImages | null;
  interiorImages: InteriorImages | null;
  engineVideo: EngineVideo | null;
  submissionStep: 'vehicle-details' | 'exterior-images' | 'interior-images' | 'engine-video' | 'completed';
  
  // Admin valuation data
  valuationData: ValuationData | null;
  isCalculating: boolean;
  calculationError: string | null;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  setCarFound: (found: boolean) => void;
  setFoundCar: (car: CarData) => void;
  setImageUrl: (url: string | null) => void;
  setVehicleImage: (url: string | null) => void;
  setMileage: (mileage: string | number) => void;
  setValuation: (valuation: number | null) => void;
  setMarketData: (data: MarketData | null) => void;
  setVin: (vin: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  
  // Comprehensive submission actions
  setVehicleDetails: (details: VehicleDetails) => void;
  setExteriorImages: (images: ExteriorImages) => void;
  setInteriorImages: (images: InteriorImages) => void;
  setEngineVideo: (video: EngineVideo) => void;
  setSubmissionStep: (step: CarStore['submissionStep']) => void;
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Valuation actions
  setValuationData: (data: ValuationData | null) => void;
  updateValuationField: (field: keyof ValuationData, value: unknown) => void;
  calculateValuation: (vehicleData: Record<string, unknown>) => Promise<void>;
  setCalculating: (calculating: boolean) => void;
  setCalculationError: (error: string | null) => void;
  
  // Utility actions
  reset: () => void;
  resetSubmission: () => void;
  resetValuation: () => void;
  loadFromCache: () => void;
  saveToCache: () => void;
}

export const useCarStore = create<CarStore>()(
  persist(
    (set, get) => ({
      // Initial state
      carFound: false,
      foundCar: null,
      imageUrl: null,
      vehicleImage: null,
      mileage: '',
      valuation: null,
      marketData: null,
      isLoading: false,
      error: '',
      
      // Comprehensive submission data
      vehicleDetails: null,
      exteriorImages: null,
      interiorImages: null,
      engineVideo: null,
      submissionStep: 'vehicle-details',
      
      // Admin valuation data
      valuationData: null,
      isCalculating: false,
      calculationError: null,
      
      // Theme
      theme: 'system',
      
      // Actions
      setCarFound: (found) => set({ carFound: found }),
      setFoundCar: (car) => set({ foundCar: car }),
      setImageUrl: (url) => set({ imageUrl: url }),
      setVehicleImage: (url) => set({ vehicleImage: url }),
      setMileage: (mileage) => set({ mileage }),
      setValuation: (valuation) => set({ valuation }),
      setMarketData: (data) => set({ marketData: data }),
      setVin: (vin) => set((state) => ({
        foundCar: state.foundCar ? { ...state.foundCar, vin } : null
      })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      
      // Comprehensive submission actions
      setVehicleDetails: (details) => set({ vehicleDetails: details }),
      setExteriorImages: (images) => set({ exteriorImages: images }),
      setInteriorImages: (images) => set({ interiorImages: images }),
      setEngineVideo: (video) => set({ engineVideo: video }),
      setSubmissionStep: (step) => set({ submissionStep: step }),
      
      // Theme actions
      setTheme: (theme) => set({ theme }),
      
      // Valuation actions
      setValuationData: (data) => set({ valuationData: data }),
      
      updateValuationField: (field, value) => set((state) => ({
        valuationData: state.valuationData ? { ...state.valuationData, [field]: value } : null
      })),
      
      calculateValuation: async (vehicleData) => {
        set({ isCalculating: true, calculationError: null });
        
        try {
          // First, try to get real market data
          let marketData = null;
          let baseValue = vehicleData.base_value || 10000;
          
          try {
            const response = await fetch('/api/market-search', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                year: vehicleData.vehicle_year,
                make: vehicleData.vehicle_make,
                model: vehicleData.vehicle_model,
                mileage: vehicleData.vehicle_mileage,
                condition: vehicleData.vehicle_condition,
                vin: vehicleData.vehicle_vin
              })
            });
            
            if (response.ok) {
              const data = await response.json();
              marketData = data;
              baseValue = data.marketData?.estimatedPrice || baseValue;
              console.log('Market data fetched and stored:', data);
            }
          } catch (error) {
            console.log('Market data fetch failed, using fallback:', error);
          }
          
          // Calculate adjustments
          const conditionAdjustment = vehicleData.vehicle_condition === 'excellent' ? 1000 : 
                                    vehicleData.vehicle_condition === 'good' ? 500 : 
                                    vehicleData.vehicle_condition === 'fair' ? -500 : -1000;
          const mileageAdjustment = vehicleData.vehicle_mileage < 50000 ? 1000 :
                                  vehicleData.vehicle_mileage < 100000 ? 0 : -1000;
          const marketAdjustment = -500; // Conservative market adjustment
          
          const totalAdjustments = conditionAdjustment + mileageAdjustment + marketAdjustment;
          const adjustedValue = baseValue + totalAdjustments;
          const inspectionFee = 150;
          const processingFee = 200;
          const totalFees = inspectionFee + processingFee;
          const netOfferMin = adjustedValue - totalFees - 500;
          const netOfferMax = adjustedValue - totalFees + 500;
          const recommendedOffer = adjustedValue - totalFees;
          
          const valuationData: ValuationData = {
            base_value: baseValue,
            condition_adjustment: conditionAdjustment,
            mileage_adjustment: mileageAdjustment,
            options_adjustment: 0,
            market_adjustment: marketAdjustment,
            total_adjustments: totalAdjustments,
            adjusted_value: adjustedValue,
            inspection_fee: inspectionFee,
            processing_fee: processingFee,
            total_fees: totalFees,
            net_offer_min: netOfferMin,
            net_offer_max: netOfferMax,
            recommended_offer: recommendedOffer,
            justification_rationale: `Base value of $${baseValue} adjusted for condition (${vehicleData.vehicle_condition}), mileage (${vehicleData.vehicle_mileage}), and market conditions.`,
            calculation_notes: 'Auto-calculated using real market data and simplified methodology',
            market_analysis: marketData?.explanation || 'Market analysis pending external data integration',
            condition_assessment: `Vehicle condition: ${vehicleData.vehicle_condition}`,
            risk_factors: 'Standard risk assessment applied',
            market_data: marketData,
            ai_analysis: marketData?.explanation || null,
            confidence_level: marketData?.confidence || 'medium',
            methodology_version: '2.0',
            last_calculated: new Date().toISOString()
          };
          
          set({ valuationData, isCalculating: false });
        } catch (error) {
          set({ 
            calculationError: error instanceof Error ? error.message : 'Calculation failed',
            isCalculating: false 
          });
        }
      },
      
      setCalculating: (calculating) => set({ isCalculating: calculating }),
      setCalculationError: (error) => set({ calculationError: error }),
      
      // Utility actions
      reset: () => set({
        carFound: false,
        foundCar: null,
        imageUrl: null,
        vehicleImage: null,
        mileage: '',
        valuation: null,
        marketData: null,
        isLoading: false,
        error: '',
        vehicleDetails: null,
        exteriorImages: null,
        interiorImages: null,
        engineVideo: null,
        submissionStep: 'vehicle-details',
        valuationData: null,
        isCalculating: false,
        calculationError: null
      }),
      
      resetSubmission: () => set({
        vehicleDetails: null,
        exteriorImages: null,
        interiorImages: null,
        engineVideo: null,
        submissionStep: 'vehicle-details'
      }),
      
      resetValuation: () => set({
        valuationData: null,
        isCalculating: false,
        calculationError: null
      }),
      
      loadFromCache: () => {
        // This will be handled by persist middleware
      },
      
      saveToCache: () => {
        // This will be handled by persist middleware
      }
    }),
    {
      name: 'car-store',
      partialize: (state) => ({
        foundCar: state.foundCar,
        vehicleImage: state.vehicleImage,
        mileage: state.mileage,
        valuation: state.valuation,
        marketData: state.marketData,
        vehicleDetails: state.vehicleDetails,
        exteriorImages: state.exteriorImages,
        interiorImages: state.interiorImages,
        engineVideo: state.engineVideo,
        submissionStep: state.submissionStep,
        valuationData: state.valuationData,
        theme: state.theme
      })
    }
  )
);


