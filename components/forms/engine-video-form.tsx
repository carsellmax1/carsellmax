"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Video, X, Upload, Play } from "lucide-react";

interface EngineVideoFormProps {
  onNext: (data: EngineVideoData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

interface EngineVideoData {
  engineVideo: File | null;
  engineSound: File | null;
  additionalVideos: File[];
  notes: string;
}

export default function EngineVideoForm({ onNext, onBack, isLoading = false }: EngineVideoFormProps) {
  const [formData, setFormData] = useState<EngineVideoData>({
    engineVideo: null,
    engineSound: null,
    additionalVideos: [],
    notes: ""
  });

  const engineVideoRef = useRef<HTMLInputElement>(null);
  const engineSoundRef = useRef<HTMLInputElement>(null);
  const additionalVideosRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (type: 'engineVideo' | 'engineSound', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const handleAdditionalVideos = (files: FileList | null) => {
    if (files) {
      const newVideos = Array.from(files);
      setFormData(prev => ({
        ...prev,
        additionalVideos: [...prev.additionalVideos, ...newVideos]
      }));
    }
  };

  const removeAdditionalVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalVideos: prev.additionalVideos.filter((_, i) => i !== index)
    }));
  };

  const handleFileSelect = (type: 'engineVideo' | 'engineSound', event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Validate file type
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');
      
      if (type === 'engineVideo' && !isVideo) {
        alert('Please select a video file for the engine video');
        return;
      }
      
      if (type === 'engineSound' && !isAudio) {
        alert('Please select an audio file for the engine sound');
        return;
      }

      // Validate file size (max 100MB for videos, 10MB for audio)
      const maxSize = type === 'engineVideo' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File size must be less than ${type === 'engineVideo' ? '100MB' : '10MB'}`);
        return;
      }
      
      handleFileUpload(type, file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const getVideoPreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  const isFormValid = true; // Temporarily disabled for testing

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Engine Video & Sound</CardTitle>
        <CardDescription>
          Record your engine running to help us assess its condition. Engine video is required.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Engine Video */}
          <div className="space-y-4">
            <Label className="text-base font-medium">
              Engine Video <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Record a video of your engine running (idle and revving). This helps us assess the engine&apos;s condition.
            </p>
            
            {formData.engineVideo ? (
              <div className="space-y-3">
                <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <video
                    src={getVideoPreview(formData.engineVideo)}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {formData.engineVideo.name} ({(formData.engineVideo.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileUpload('engineVideo', null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Video className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a video of your engine running
                </p>
                <input
                  ref={engineVideoRef}
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileSelect('engineVideo', e)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => engineVideoRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Video
                </Button>
              </div>
            )}
          </div>

          {/* Engine Sound */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Engine Sound (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Upload an audio recording of your engine sound for additional assessment.
            </p>
            
            {formData.engineSound ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Play className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{formData.engineSound.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(formData.engineSound.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleFileUpload('engineSound', null)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={engineSoundRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileSelect('engineSound', e)}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => engineSoundRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Audio
                </Button>
              </div>
            )}
          </div>

          {/* Additional Videos */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Additional Videos (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Upload any additional videos that might help with the assessment (e.g., test drive, specific issues).
            </p>
            
            {formData.additionalVideos.length > 0 && (
              <div className="space-y-2">
                {formData.additionalVideos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Play className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{video.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(video.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAdditionalVideo(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <input
              ref={additionalVideosRef}
              type="file"
              accept="video/*"
              multiple
              onChange={(e) => handleAdditionalVideos(e.target.files)}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => additionalVideosRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Add More Videos
            </Button>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about your vehicle's condition, recent repairs, or specific concerns..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Video Recording Tips:</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Record with the engine cold and then after it&apos;s warmed up</li>
              <li>• Include both idle and revving sounds</li>
              <li>• Ensure good audio quality - avoid windy conditions</li>
              <li>• Keep the camera steady and focused on the engine</li>
              <li>• Record for at least 30 seconds to capture different engine sounds</li>
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
              disabled={!isFormValid || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? 'Submitting...' : 'Complete Submission'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
