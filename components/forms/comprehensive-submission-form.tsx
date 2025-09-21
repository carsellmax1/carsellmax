"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCarStore } from "@/lib/car-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";
import UserInformationForm from "./user-information-form";
import VehicleDetailsForm from "./vehicle-details-form";
import ExteriorImagesForm from "./exterior-images-form";
import InteriorImagesForm from "./interior-images-form";
import EngineVideoForm from "./engine-video-form";

type SubmissionStep = 'user-information' | 'vehicle-details' | 'exterior-images' | 'interior-images' | 'engine-video' | 'success';

interface VehicleFormData {
  condition: string;
  interiorColor: string;
  driveTrain: string;
  exteriorColor: string;
  transmission: string;
  fuelType: string;
  additionalInfo: string;
}

interface ExteriorImagesData {
  front: File | null;
  driverSideFront: File | null;
  driverSide: File | null;
  driverSideRear: File | null;
  rear: File | null;
  passengerSideRear: File | null;
  passengerSide: File | null;
  passengerSideFront: File | null;
}

interface InteriorImagesData {
  dashboard: File | null;
  frontSeats: File | null;
  rearSeats: File | null;
  trunk: File | null;
  roofInterior: File | null;
  centerConsole: File | null;
  infotainment: File | null;
  odometer: File | null;
}

interface EngineVideoData {
  engineVideo: File | null;
  engineSound: File | null;
  additionalVideos: File[];
  notes: string;
}

interface UserInformationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const steps = [
  { id: 'user-information', title: 'Contact Info', description: 'Your details' },
  { id: 'vehicle-details', title: 'Vehicle Details', description: 'Basic information' },
  { id: 'exterior-images', title: 'Exterior Photos', description: 'Outside views' },
  { id: 'interior-images', title: 'Interior Photos', description: 'Inside views' },
  { id: 'engine-video', title: 'Engine Video', description: 'Engine assessment' }
];

export default function ComprehensiveSubmissionForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<SubmissionStep>('user-information');
  const [isLoading, setIsLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<SubmissionStep[]>([]);
  
  // Form data state
  const [userData, setUserData] = useState<UserInformationData | null>(null);
  const [vehicleData, setVehicleData] = useState<VehicleFormData | null>(null);
  const [exteriorImages, setExteriorImages] = useState<ExteriorImagesData | null>(null);
  const [interiorImages, setInteriorImages] = useState<InteriorImagesData | null>(null);
  const [engineVideo, setEngineVideo] = useState<EngineVideoData | null>(null);

  const { 
    foundCar: carData,
    valuation,
    mileage,
    reset: resetStore
  } = useCarStore();

  // Redirect if no car data
  useEffect(() => {
    if (!carData || !valuation || !mileage) {
      resetStore();
      router.push('/');
    }
  }, [carData, valuation, mileage, router, resetStore]);

  const handleUserInformationNext = (data: UserInformationData) => {
    setUserData(data);
    setCompletedSteps(prev => [...prev, 'user-information']);
    setCurrentStep('vehicle-details');
  };

  const handleVehicleDetailsNext = (data: VehicleFormData) => {
    setVehicleData(data);
    setCompletedSteps(prev => [...prev, 'vehicle-details']);
    setCurrentStep('exterior-images');
  };

  const handleExteriorImagesNext = (data: ExteriorImagesData) => {
    setExteriorImages(data);
    setCompletedSteps(prev => [...prev, 'exterior-images']);
    setCurrentStep('interior-images');
  };

  const handleInteriorImagesNext = (data: InteriorImagesData) => {
    setInteriorImages(data);
    setCompletedSteps(prev => [...prev, 'interior-images']);
    setCurrentStep('engine-video');
  };

  const handleEngineVideoNext = async (data: EngineVideoData) => {
    setEngineVideo(data);
    setCompletedSteps(prev => [...prev, 'engine-video']);
    await handleFinalSubmission(data);
  };

  const handleBack = () => {
    const stepIndex = steps.findIndex(step => step.id === currentStep);
    if (stepIndex > 0) {
      const previousStep = steps[stepIndex - 1].id as SubmissionStep;
      setCurrentStep(previousStep);
      setCompletedSteps(prev => prev.filter(step => step !== currentStep));
    }
  };

  const handleFinalSubmission = async (engineVideoData: EngineVideoData) => {
    setIsLoading(true);
    
    try {
      if (!carData || !mileage || valuation === null || !userData || !vehicleData || !exteriorImages || !interiorImages) {
        throw new Error("Missing required information");
      }

      // Convert File objects to base64 for storage
      const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      };

      // Process exterior images
      const exteriorImageData: Record<string, string | null> = {};
      for (const [key, file] of Object.entries(exteriorImages)) {
        if (file) {
          exteriorImageData[key] = await convertFileToBase64(file);
        } else {
          exteriorImageData[key] = null;
        }
      }

      // Process interior images
      const interiorImageData: Record<string, string | null> = {};
      for (const [key, file] of Object.entries(interiorImages)) {
        if (file) {
          interiorImageData[key] = await convertFileToBase64(file);
        } else {
          interiorImageData[key] = null;
        }
      }

      // Process engine video data
      const engineVideoDataForStorage: Record<string, string | string[] | null> = {
        notes: engineVideoData.notes
      };
      
      if (engineVideoData.engineVideo) {
        engineVideoDataForStorage.engineVideo = await convertFileToBase64(engineVideoData.engineVideo);
      } else {
        engineVideoDataForStorage.engineVideo = null;
      }

      if (engineVideoData.engineSound) {
        engineVideoDataForStorage.engineSound = await convertFileToBase64(engineVideoData.engineSound);
      } else {
        engineVideoDataForStorage.engineSound = null;
      }

      const additionalVideosBase64: string[] = [];
      for (const video of engineVideoData.additionalVideos) {
        const base64 = await convertFileToBase64(video);
        additionalVideosBase64.push(base64);
      }
      engineVideoDataForStorage.additionalVideos = additionalVideosBase64;

      // Prepare comprehensive submission data
      const comprehensiveData = {
        userDetails: userData,
        vehicleDetails: vehicleData,
        exteriorImages: exteriorImageData,
        interiorImages: interiorImageData,
        engineVideo: engineVideoDataForStorage,
        carData: {
          vin: carData.vin,
          make_model: carData.makeModel,
          year: carData.year,
          color: carData.color,
          type: carData.bodyType,
          fuel: carData.fuelType,
          mileage,
          image_url: useCarStore.getState().imageUrl,
          estimated_value: valuation
        }
      };

      // Submit to backend API
      const response = await fetch('/api/submit-car', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comprehensiveData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit car details');
      }

      const result = await response.json();
      console.log('Comprehensive submission successful:', result);

      // Redirect to confirmation page
      if (result.confirmation_url) {
        router.push(result.confirmation_url);
      } else {
        setCurrentStep('success');
      }
    } catch (err) {
      console.error('Final submission error:', err);
      alert(`Submission failed: ${err instanceof Error ? err.message : 'Please try again later'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    resetStore();
    router.push('/');
  };

  if (!carData || !valuation || !mileage) {
    return null; // Will redirect
  }

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'user-information':
        return (
          <UserInformationForm
            onNext={handleUserInformationNext}
            onBack={() => router.push('/valuation-result')}
            isLoading={isLoading}
          />
        );
      
      case 'vehicle-details':
        return (
          <VehicleDetailsForm
            onNext={handleVehicleDetailsNext}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      
      case 'exterior-images':
        return (
          <ExteriorImagesForm
            onNext={handleExteriorImagesNext}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      
      case 'interior-images':
        return (
          <InteriorImagesForm
            onNext={handleInteriorImagesNext}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      
      case 'engine-video':
        return (
          <EngineVideoForm
            onNext={handleEngineVideoNext}
            onBack={handleBack}
            isLoading={isLoading}
          />
        );
      
      case 'success':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-4">Submission Complete!</h1>
                <p className="text-muted-foreground mb-6">
                  Thank you for providing comprehensive details about your{" "}
                  <strong>{carData.makeModel}</strong>. We&apos;ve received all your information including photos and videos, 
                  and will be in touch with you soon with a detailed offer.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleStartOver}
                    className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Submit Another Car
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Progress Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold">Complete Your Submission</h1>
                <p className="text-sm text-muted-foreground">
                  {carData.year} {carData.makeModel} • {mileage} miles • ${valuation?.toLocaleString()}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </div>
            </div>
            
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id as SubmissionStep);
                const isCurrent = step.id === currentStep;
                
                return (
                  <div key={step.id} className="flex flex-col items-center space-y-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-xs font-medium ${
                        isCurrent ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
}
