import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiStepForm } from "@/components/forms/multi-step-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function IntakeForm() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    childName: "",
    dateOfBirth: "",
    gender: "",
    primaryLanguage: "",
    currentDiagnosis: "",
    diagnosisDate: "",
    diagnosingProfessional: "",
    therapies: {
      speech: false,
      occupational: false,
      behavioral: false,
      physical: false,
    },
    medications: "",
    familyHistory: "",
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClose = () => {
    setLocation("/");
  };

  const handleSubmit = (data: any) => {
    console.log("Submitting intake form:", data);
    // Here you would save the form data
    setLocation("/");
  };

  const handleSaveProgress = (data: any, currentStep: number) => {
    console.log("Saving progress:", data, "Step:", currentStep);
    // Here you would save the progress
  };

  // Step 1: Child Details
  const Step1 = (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Child Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="childName" className="text-sm font-medium text-slate-700 mb-2 block">
            Full Name *
          </Label>
          <Input
            id="childName"
            type="text"
            placeholder="Enter child's full name"
            value={formData.childName}
            onChange={(e) => updateFormData("childName", e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="dateOfBirth" className="text-sm font-medium text-slate-700 mb-2 block">
            Date of Birth *
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
            required
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="primaryLanguage" className="text-sm font-medium text-slate-700 mb-2 block">
            Primary Language
          </Label>
          <Input
            id="primaryLanguage"
            type="text"
            placeholder="e.g., English, Mandarin"
            value={formData.primaryLanguage}
            onChange={(e) => updateFormData("primaryLanguage", e.target.value)}
          />
        </div>
      </div>
      
      <div className="mt-6">
        <Label htmlFor="currentDiagnosis" className="text-sm font-medium text-slate-700 mb-2 block">
          Current Diagnosis (if any)
        </Label>
        <Textarea
          id="currentDiagnosis"
          rows={3}
          placeholder="Please describe any current diagnoses or suspected conditions"
          value={formData.currentDiagnosis}
          onChange={(e) => updateFormData("currentDiagnosis", e.target.value)}
        />
      </div>
      
      {/* Conditional fields based on diagnosis */}
      {formData.currentDiagnosis && (
        <Card className="mt-6 bg-primary-50 border-primary-200">
          <CardHeader>
            <CardTitle className="text-base font-medium text-slate-900">
              Additional Information Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="diagnosisDate" className="text-sm font-medium text-slate-700 mb-2 block">
                  Diagnosis Date
                </Label>
                <Input
                  id="diagnosisDate"
                  type="date"
                  value={formData.diagnosisDate}
                  onChange={(e) => updateFormData("diagnosisDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="diagnosingProfessional" className="text-sm font-medium text-slate-700 mb-2 block">
                  Diagnosing Professional
                </Label>
                <Input
                  id="diagnosingProfessional"
                  type="text"
                  placeholder="Doctor's name"
                  value={formData.diagnosingProfessional}
                  onChange={(e) => updateFormData("diagnosingProfessional", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Step 2: Medical History
  const Step2 = (
    <div>
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Medical History</h2>
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-3 block">
            Previous Therapies/Interventions
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="speech"
                checked={formData.therapies.speech}
                onCheckedChange={(checked) => updateFormData("therapies", { ...formData.therapies, speech: !!checked })}
              />
              <Label htmlFor="speech" className="text-sm text-slate-700">Speech Therapy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="occupational"
                checked={formData.therapies.occupational}
                onCheckedChange={(checked) => updateFormData("therapies", { ...formData.therapies, occupational: !!checked })}
              />
              <Label htmlFor="occupational" className="text-sm text-slate-700">Occupational Therapy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="behavioral"
                checked={formData.therapies.behavioral}
                onCheckedChange={(checked) => updateFormData("therapies", { ...formData.therapies, behavioral: !!checked })}
              />
              <Label htmlFor="behavioral" className="text-sm text-slate-700">Behavioral Therapy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="physical"
                checked={formData.therapies.physical}
                onCheckedChange={(checked) => updateFormData("therapies", { ...formData.therapies, physical: !!checked })}
              />
              <Label htmlFor="physical" className="text-sm text-slate-700">Physical Therapy</Label>
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="medications" className="text-sm font-medium text-slate-700 mb-2 block">
            Current Medications
          </Label>
          <Textarea
            id="medications"
            rows={3}
            placeholder="List current medications, dosages, and prescribing doctors"
            value={formData.medications}
            onChange={(e) => updateFormData("medications", e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="familyHistory" className="text-sm font-medium text-slate-700 mb-2 block">
            Family Medical History
          </Label>
          <Textarea
            id="familyHistory"
            rows={3}
            placeholder="Relevant family medical history, especially developmental conditions"
            value={formData.familyHistory}
            onChange={(e) => updateFormData("familyHistory", e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  // Additional steps would be implemented similarly
  const Step3 = <div><h2 className="text-xl font-semibold text-slate-900 mb-6">Current Needs Assessment</h2><p>Step 3 content...</p></div>;
  const Step4 = <div><h2 className="text-xl font-semibold text-slate-900 mb-6">Goals and Objectives</h2><p>Step 4 content...</p></div>;
  const Step5 = <div><h2 className="text-xl font-semibold text-slate-900 mb-6">Review and Submit</h2><p>Step 5 content...</p></div>;

  const steps = [
    { id: 1, title: "Child Details", component: Step1 },
    { id: 2, title: "Medical History", component: Step2 },
    { id: 3, title: "Current Needs", component: Step3 },
    { id: 4, title: "Goals", component: Step4 },
    { id: 5, title: "Review", component: Step5 },
  ];

  return (
    <MultiStepForm
      steps={steps}
      onClose={handleClose}
      onSubmit={handleSubmit}
      onSaveProgress={handleSaveProgress}
      title="NDIS Assessment Intake Form"
      subtitle="Please complete all sections to help us understand your child's needs"
    />
  );
}
