import { create } from 'zustand';

// Type definitions for our store
interface AppState {
  // UI State
  isLoading: boolean;
  currentSection: string;
  
  // Vehicle Form State
  vehicleForm: {
    step: number;
    vehicleType: string;
    formData: {
      year: string;
      make: string;
      model: string;
      mileage: string;
      condition: string;
      vin: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      zipCode: string;
    };
  };
  
  // Actions
  setLoading: (loading: boolean) => void;
  setCurrentSection: (section: string) => void;
  setVehicleFormStep: (step: number) => void;
  setVehicleType: (type: string) => void;
  updateFormData: (data: Partial<AppState['vehicleForm']['formData']>) => void;
  resetVehicleForm: () => void;
}

const initialFormData = {
  year: '',
  make: '',
  model: '',
  mileage: '',
  condition: '',
  vin: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  zipCode: ''
};

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  isLoading: false,
  currentSection: 'hero',
  vehicleForm: {
    step: 1,
    vehicleType: '',
    formData: initialFormData
  },
  
  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setCurrentSection: (section) => set({ currentSection: section }),
  setVehicleFormStep: (step) => set((state) => ({
    vehicleForm: { ...state.vehicleForm, step }
  })),
  setVehicleType: (type) => set((state) => ({
    vehicleForm: { ...state.vehicleForm, vehicleType: type }
  })),
  updateFormData: (data) => set((state) => ({
    vehicleForm: {
      ...state.vehicleForm,
      formData: { ...state.vehicleForm.formData, ...data }
    }
  })),
  resetVehicleForm: () => set(() => ({
    vehicleForm: {
      step: 1,
      vehicleType: '',
      formData: initialFormData
    }
  }))
}));



