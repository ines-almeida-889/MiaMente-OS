import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Save, Check, X } from "lucide-react";

interface FormStep {
  id: number;
  title: string;
  component: React.ReactNode;
  isValid?: boolean;
}

interface MultiStepFormProps {
  steps: FormStep[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  onSaveProgress?: (data: any, currentStep: number) => void;
  title: string;
  subtitle?: string;
}

export function MultiStepForm({
  steps,
  onClose,
  onSubmit,
  onSaveProgress,
  title,
  subtitle
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveProgress = () => {
    onSaveProgress?.(formData, currentStep);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6">
      {/* Form Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-900">{title}</CardTitle>
              {subtitle && <p className="text-slate-600 mt-1">{subtitle}</p>}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Progress Indicator */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="w-full" />
            
            {/* Step Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index + 1 <= currentStep 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-sm ${
                      index + 1 <= currentStep 
                        ? 'font-medium text-slate-900' 
                        : 'text-slate-600'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          {/* Current Step Content */}
          <div className="mb-8">
            {steps[currentStep - 1]?.component}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex space-x-3">
              {onSaveProgress && (
                <Button
                  variant="outline"
                  onClick={handleSaveProgress}
                  className="flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Progress</span>
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                className="flex items-center space-x-2"
              >
                <span>{currentStep === totalSteps ? 'Submit' : 'Next'}</span>
                {currentStep === totalSteps ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
