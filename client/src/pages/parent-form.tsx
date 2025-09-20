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
import { ArrowLeft, Upload, Heart } from "lucide-react";
import { Link } from "wouter";

const parentFormSchema = z.object({
  childName: z.string().min(2, "Child's name must be at least 2 characters"),
  childAge: z.string().min(1, "Please select your child's age"),
  diagnosis: z.string().min(5, "Please provide details about your child's diagnosis or concerns"),
  parentName: z.string().min(2, "Your name must be at least 2 characters"),
  parentEmail: z.string().email("Please enter a valid email address"),
  parentPhone: z.string().min(10, "Please enter a valid phone number"),
});

type ParentFormData = z.infer<typeof parentFormSchema>;

export default function ParentForm() {
  const [, navigate] = useLocation();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentFormSchema),
    defaultValues: {
      childName: "",
      childAge: "",
      diagnosis: "",
      parentName: "",
      parentEmail: "",
      parentPhone: "",
    },
  });

  const onSubmit = (data: ParentFormData) => {
    // Store form data in localStorage for the sign-up process
    const formData = {
      ...data,
      uploadedFile: uploadedFile?.name || null,
      userType: "parent"
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
              <div className="w-8 h-8 bg-mia-pink rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="mia-logo text-2xl text-white">mia mente</div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Tell us about your child</h1>
            <p className="text-white/80">Help us find the best care for your child's needs</p>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-mia-navy text-center">Parent Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Child Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-mia-navy border-b pb-2">Child's Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="childName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Child's Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your child's full name"
                            className="border-mia-pink/20 focus:border-mia-pink"
                            data-testid="input-child-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="childAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Child's Age</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-mia-pink/20 focus:border-mia-pink" data-testid="select-child-age">
                              <SelectValue placeholder="Select age" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 18 }, (_, i) => (
                              <SelectItem key={i} value={`${i + 1}`}>
                                {i + 1} year{i + 1 !== 1 ? 's' : ''} old
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diagnosis"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Diagnosis or Concerns</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your child's current diagnosis, symptoms, or areas where they need support..."
                            className="border-mia-pink/20 focus:border-mia-pink min-h-[100px]"
                            data-testid="textarea-diagnosis"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Parent Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-mia-navy border-b pb-2">Your Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="parentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Your Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            className="border-mia-pink/20 focus:border-mia-pink"
                            data-testid="input-parent-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parentEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            className="border-mia-pink/20 focus:border-mia-pink"
                            data-testid="input-parent-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="parentPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-mia-navy">Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="04XX XXX XXX"
                            className="border-mia-pink/20 focus:border-mia-pink"
                            data-testid="input-parent-phone"
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
                        ? 'border-mia-pink bg-mia-pink/5' 
                        : 'border-mia-pink/20 hover:border-mia-pink/40'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    data-testid="dropzone-documents"
                  >
                    <Upload className="h-8 w-8 text-mia-pink mx-auto mb-2" />
                    <p className="text-mia-navy font-medium mb-1">
                      Upload medical documents (optional)
                    </p>
                    <p className="text-mia-navy/60 text-sm mb-3">
                      Diagnostic reports, therapy notes, or other relevant documents
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
                      <Button type="button" variant="outline" className="border-mia-pink text-mia-pink hover:bg-mia-pink/10" data-testid="button-choose-file">
                        Choose File
                      </Button>
                    </label>
                    {uploadedFile && (
                      <div className="mt-3 p-2 bg-mia-pink/10 rounded text-sm text-mia-navy" data-testid="text-uploaded-file">
                        Uploaded: {uploadedFile.name}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-mia-pink hover:bg-mia-pink/90 text-white font-semibold py-3 text-lg"
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