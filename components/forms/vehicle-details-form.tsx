"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface VehicleDetailsFormProps {
  onNext: (data: VehicleFormData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

interface VehicleFormData {
  condition: string;
  interiorColor: string;
  driveTrain: string;
  exteriorColor: string;
  transmission: string;
  fuelType: string;
  additionalInfo: string;
}

const conditionOptions = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "poor", label: "Poor" }
];

const colorOptions = [
  { value: "white", label: "White" },
  { value: "black", label: "Black" },
  { value: "silver", label: "Silver" },
  { value: "gray", label: "Gray" },
  { value: "red", label: "Red" },
  { value: "blue", label: "Blue" },
  { value: "green", label: "Green" },
  { value: "brown", label: "Brown" },
  { value: "beige", label: "Beige" },
  { value: "gold", label: "Gold" },
  { value: "yellow", label: "Yellow" },
  { value: "other", label: "Other" }
];

const driveTrainOptions = [
  { value: "fwd", label: "Front-Wheel Drive (FWD)" },
  { value: "rwd", label: "Rear-Wheel Drive (RWD)" },
  { value: "awd", label: "All-Wheel Drive (AWD)" },
  { value: "4wd", label: "Four-Wheel Drive (4WD)" }
];

const transmissionOptions = [
  { value: "automatic", label: "Automatic" },
  { value: "manual", label: "Manual" },
  { value: "cvt", label: "CVT (Continuously Variable)" },
  { value: "semi_automatic", label: "Semi-Automatic" }
];

const fuelTypeOptions = [
  { value: "gasoline", label: "Gasoline" },
  { value: "diesel", label: "Diesel" },
  { value: "hybrid", label: "Hybrid" },
  { value: "electric", label: "Electric" },
  { value: "plug_in_hybrid", label: "Plug-in Hybrid" }
];

export default function VehicleDetailsForm({ onNext, onBack, isLoading = false }: VehicleDetailsFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    condition: "good",
    interiorColor: "",
    driveTrain: "",
    exteriorColor: "",
    transmission: "",
    fuelType: "",
    additionalInfo: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleInputChange = (field: keyof VehicleFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = formData.condition && formData.interiorColor && formData.driveTrain && 
                     formData.exteriorColor && formData.transmission && formData.fuelType;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Vehicle Details</CardTitle>
        <CardDescription>
          Provide detailed information about your vehicle&apos;s condition and specifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Condition */}
            <div className="space-y-2">
              <Label htmlFor="condition">Overall Condition *</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Interior Color */}
            <div className="space-y-2">
              <Label htmlFor="interiorColor">Interior Color *</Label>
              <Select value={formData.interiorColor} onValueChange={(value) => handleInputChange('interiorColor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select interior color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exterior Color */}
            <div className="space-y-2">
              <Label htmlFor="exteriorColor">Exterior Color *</Label>
              <Select value={formData.exteriorColor} onValueChange={(value) => handleInputChange('exteriorColor', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exterior color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Drive Train */}
            <div className="space-y-2">
              <Label htmlFor="driveTrain">Drive Train *</Label>
              <Select value={formData.driveTrain} onValueChange={(value) => handleInputChange('driveTrain', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select drive train" />
                </SelectTrigger>
                <SelectContent>
                  {driveTrainOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission *</Label>
              <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  {transmissionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fuel Type */}
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type *</Label>
              <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {fuelTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Any additional details about your vehicle&apos;s condition, modifications, or history..."
              value={formData.additionalInfo}
              onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
              rows={4}
            />
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
              disabled={!isFormValid || isLoading}
              className="flex items-center gap-2"
            >
              Next: Exterior Photos
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
