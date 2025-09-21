"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, Camera, X } from "lucide-react";
import Image from "next/image";

interface ExteriorImagesFormProps {
  onNext: (data: ExteriorImagesData) => void;
  onBack: () => void;
  isLoading?: boolean;
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

const imagePositions = [
  { key: 'front', label: 'Front View', placeholder: '/placeholders/exterior-front.png' },
  { key: 'driverSideFront', label: 'Driver Side Front', placeholder: '/placeholders/exterior-driver_side_front.png' },
  { key: 'driverSide', label: 'Driver Side', placeholder: '/placeholders/exterior-driver_side.png' },
  { key: 'driverSideRear', label: 'Driver Side Rear', placeholder: '/placeholders/exterior-driver_side_rear.png' },
  { key: 'rear', label: 'Rear View', placeholder: '/placeholders/exterior-rear.png' },
  { key: 'passengerSideRear', label: 'Passenger Side Rear', placeholder: '/placeholders/exterior-passenger_side_rear.png' },
  { key: 'passengerSide', label: 'Passenger Side', placeholder: '/placeholders/exterior-passenger_side.png' },
  { key: 'passengerSideFront', label: 'Passenger Side Front', placeholder: '/placeholders/exterior-driver_side_front.png' }
];

export default function ExteriorImagesForm({ onNext, onBack, isLoading = false }: ExteriorImagesFormProps) {
  const [images, setImages] = useState<ExteriorImagesData>({
    front: null,
    driverSideFront: null,
    driverSide: null,
    driverSideRear: null,
    rear: null,
    passengerSideRear: null,
    passengerSide: null,
    passengerSideFront: null
  });

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleImageUpload = (position: keyof ExteriorImagesData, file: File | null) => {
    setImages(prev => ({
      ...prev,
      [position]: file
    }));
  };

  const handleFileSelect = (position: keyof ExteriorImagesData, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      handleImageUpload(position, file);
    }
  };

  const removeImage = (position: keyof ExteriorImagesData) => {
    handleImageUpload(position, null);
    if (fileInputRefs.current[position]) {
      fileInputRefs.current[position]!.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(images);
  };

  const getImagePreview = (position: keyof ExteriorImagesData) => {
    const file = images[position];
    if (file) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const requiredImages = ['front', 'rear', 'driverSide', 'passengerSide'];
  const hasRequiredImages = true; // Temporarily disabled for testing

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Exterior Photos</CardTitle>
        <CardDescription>
          Take clear photos of your vehicle from all angles. Front, rear, and both sides are required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {imagePositions.map(({ key, label, placeholder }) => {
              const position = key as keyof ExteriorImagesData;
              const isRequired = requiredImages.includes(key);
              const preview = getImagePreview(position);

              return (
                <div key={key} className="space-y-3">
                  <Label className="text-sm font-medium">
                    {label} {isRequired && <span className="text-red-500">*</span>}
                  </Label>
                  
                  <div className="relative aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden group hover:border-gray-400 transition-colors">
                    {preview ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={preview}
                          alt={label}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(position)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <div className="mb-2">
                          <Image
                            src={placeholder}
                            alt={`${label} placeholder`}
                            width={80}
                            height={80}
                            className="opacity-50"
                          />
                        </div>
                        <div className="text-xs text-gray-500 mb-2">
                          {isRequired ? 'Required' : 'Optional'}
                        </div>
                        <input
                          ref={(el) => { fileInputRefs.current[key] = el; }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileSelect(position, e)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRefs.current[key]?.click()}
                          className="flex items-center gap-1"
                        >
                          <Camera className="w-3 h-3" />
                          Upload
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Photo Tips:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Take photos in good lighting conditions</li>
              <li>• Ensure the entire vehicle is visible in each photo</li>
              <li>• Avoid shadows and reflections when possible</li>
              <li>• Clean your vehicle before taking photos for best results</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            
            <Button
              type="submit"
              disabled={!hasRequiredImages || isLoading}
              className="flex items-center gap-2"
            >
              Next: Interior Photos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
