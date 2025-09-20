import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Stethoscope } from "lucide-react";
import { Link } from "wouter";

const clinicianFormSchema = z.object({
  fullName: z.string().min(2, "Your name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  specialization: z.string().min(1, "Please select your specialization"),
  credentials: z.string().min(5, "Please provide details about your credentials and qualifications"),
  experience: z.string().min(1, "Please select your experience level"),
  clinicName: z.string().min(2, "Clinic or practice name is required"),
  clinicAddress: z.string().min(5, "Please provide your practice address"),
});

type ClinicianFormData = z.infer<typeof clinicianFormSchema>;

export default function ClinicianForm() {
  const [, navigate] = useLocation();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const form = useForm<ClinicianFormData>({
    resolver: zodResolver(clinicianFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      specialization: "",
      credentials: "",
      experience: "",
      clinicName: "",
      clinicAddress: "",
    },
  });

  const onSubmit = (data: ClinicianFormData) => {
    // Store form data in localStorage for the sign-up process
    const formData = {
      ...data,
      uploadedFile: uploadedFile?.name || null,
      userType: "clinic"
    };
    localStorage.setItem("onboardingData", JSON.stringify(formData));
    navigate("/signup");
  };

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mia-navy to-mia-navy/80 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" data-testid="link-back-home">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-mia-blue rounded-full flex items-center justify-center">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <div className="mia-logo text-2xl text-white">mia mente</div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Join our network</h1>
            <p className="text-white/80">Tell us about your practice and credentials</p>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-mia-navy text-center">Clinician Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-mia-navy border-b pb-2">Personal Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Dr. Jane Smith"
                            className="border-mia-blue/20 focus:border-mia-blue"
                            data-testid="input-full-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            className="border-mia-blue/20 focus:border-mia-blue"
                            data-testid="input-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="04XX XXX XXX"
                            className="border-mia-blue/20 focus:border-mia-blue"
                            data-testid="input-phone"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-mia-navy border-b pb-2">Professional Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Specialization</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-mia-blue/20 focus:border-mia-blue" data-testid="select-specialization">
                              <SelectValue placeholder="Select your specialization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="speech-therapy">Speech Therapy</SelectItem>
                            <SelectItem value="occupational-therapy">Occupational Therapy</SelectItem>
                            <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                            <SelectItem value="psychology">Psychology</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                            <SelectItem value="developmental-pediatrics">Developmental Pediatrics</SelectItem>
                            <SelectItem value="behavior-therapy">Behavior Therapy</SelectItem>
                            <SelectItem value="dietetics">Dietetics</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Years of Experience</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-mia-blue/20 focus:border-mia-blue" data-testid="select-experience">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0-2">0-2 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="11-15">11-15 years</SelectItem>
                            <SelectItem value="16+">16+ years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="credentials"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Credentials & Qualifications</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please list your relevant qualifications, certifications, and professional memberships..."
                            className="border-mia-blue/20 focus:border-mia-blue min-h-[100px]"
                            data-testid="textarea-credentials"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Practice Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-mia-navy border-b pb-2">Practice Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="clinicName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Clinic/Practice Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Sunshine Pediatric Therapy"
                            className="border-mia-blue/20 focus:border-mia-blue"
                            data-testid="input-clinic-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clinicAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Practice Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="123 Main Street, Melbourne, VIC 3000"
                            className="border-mia-blue/20 focus:border-mia-blue"
                            data-testid="textarea-clinic-address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Document Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-mia-navy border-b pb-2">Supporting Documents</h3>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver 
                        ? 'border-mia-blue bg-mia-blue/5' 
                        : 'border-mia-blue/20 hover:border-mia-blue/40'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    data-testid="dropzone-documents"
                  >
                    <Upload className="h-8 w-8 text-mia-blue mx-auto mb-2" />
                    <p className="text-mia-navy font-medium mb-1">
                      Upload credentials & certificates
                    </p>
                    <p className="text-mia-navy/60 text-sm mb-3">
                      Professional certifications, licenses, or other relevant documents
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      data-testid="input-file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button type="button" variant="outline" className="border-mia-blue text-mia-blue hover:bg-mia-blue/10" data-testid="button-choose-file">
                        Choose File
                      </Button>
                    </label>
                    {uploadedFile && (
                      <div className="mt-3 p-2 bg-mia-blue/10 rounded text-sm text-mia-navy" data-testid="text-uploaded-file">
                        Uploaded: {uploadedFile.name}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-mia-blue hover:bg-mia-blue/90 text-white font-semibold py-3 text-lg"
                  data-testid="button-continue"
                >
                  Continue to Sign Up
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}