import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Heart, Stethoscope, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { authManager } from "@/lib/auth";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function Signup() {
  const [, navigate] = useLocation();
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const data = localStorage.getItem("onboardingData");
    if (!data) {
      navigate("/");
      return;
    }
    setOnboardingData(JSON.parse(data));
  }, [navigate]);

  const onSubmit = async (data: SignupFormData) => {
    if (!onboardingData) return;

    setIsSubmitting(true);
    try {
      // Create user account with form data
      const userData = {
        username: data.username,
        password: data.password,
        role: onboardingData.userType,
        name: onboardingData.userType === "parent" ? onboardingData.parentName : onboardingData.fullName,
        email: onboardingData.userType === "parent" ? onboardingData.parentEmail : onboardingData.email,
        onboardingData: onboardingData
      };

      // Switch to appropriate role
      await authManager.switchRole(onboardingData.userType);

      // Clear onboarding data
      localStorage.removeItem("onboardingData");

      // Navigate to appropriate dashboard
      if (onboardingData.userType === "parent") {
        navigate("/parent-dashboard");
      } else {
        navigate("/clinic-dashboard");
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!onboardingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mia-navy to-mia-navy/80 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const isParent = onboardingData.userType === "parent";
  const brandColor = isParent ? "mia-pink" : "mia-blue";
  const Icon = isParent ? Heart : Stethoscope;

  return (
    <div className="min-h-screen bg-gradient-to-br from-mia-navy to-mia-navy/80 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to={isParent ? "/parent-form" : "/clinician-form"} data-testid="link-back-form">
            <Button variant="ghost" className="text-white hover:bg-white/10 mb-4" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Form
            </Button>
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className={`w-8 h-8 ${isParent ? 'bg-mia-pink' : 'bg-mia-blue'} rounded-full flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="mia-logo text-2xl text-white">mia mente</div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-white/80">
              Almost there! Create your login credentials
            </p>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-mia-navy text-center">
              {isParent ? "Parent Account" : "Clinician Account"}
            </CardTitle>
            <p className="text-center text-mia-navy/70 text-sm">
              Welcome, {isParent ? onboardingData.parentName : onboardingData.fullName}
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-mia-navy">Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Choose a username"
                          className={`${isParent ? 'border-mia-pink/20 focus:border-mia-pink' : 'border-mia-blue/20 focus:border-mia-blue'}`}
                          data-testid="input-username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-mia-navy">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a secure password"
                            className={`${isParent ? 'border-mia-pink/20 focus:border-mia-pink' : 'border-mia-blue/20 focus:border-mia-blue'} pr-10`}
                            data-testid="input-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-mia-navy/50" />
                            ) : (
                              <Eye className="h-4 w-4 text-mia-navy/50" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-mia-navy">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className={`${isParent ? 'border-mia-pink/20 focus:border-mia-pink' : 'border-mia-blue/20 focus:border-mia-blue'} pr-10`}
                            data-testid="input-confirm-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            data-testid="button-toggle-confirm-password"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-mia-navy/50" />
                            ) : (
                              <Eye className="h-4 w-4 text-mia-navy/50" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className={`w-full ${isParent ? 'bg-mia-pink hover:bg-mia-pink/90' : 'bg-mia-blue hover:bg-mia-blue/90'} text-white font-semibold py-3 text-lg`}
                  disabled={isSubmitting}
                  data-testid="button-create-account"
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>

                <div className="text-center text-xs text-mia-navy/60 mt-4">
                  By creating an account, you agree to our Terms of Service and Privacy Policy
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}