import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Brain, Smile, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { authManager } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await authManager.login(data.username, data.password);
      
      // Get the current user and redirect to appropriate dashboard
      const currentUser = authManager.getState().user;
      if (currentUser?.role === 'parent') {
        navigate("/parent-dashboard");
      } else if (currentUser?.role === 'clinic') {
        navigate("/clinic-dashboard");
      } else {
        navigate("/parent-dashboard"); // fallback
      }
      
      toast({
        title: "Welcome back!",
        description: "You've been successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-mia-navy to-mia-navy/80 py-8 px-4">
      <div className="max-w-md mx-auto">
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
              <div className="flex items-center space-x-1">
                <Brain className="h-8 w-8 text-white" />
                <Smile className="h-6 w-6 text-mia-pink" />
              </div>
              <div className="mia-logo text-2xl text-white">mia mente</div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-white/80">Sign in to your account</p>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl text-mia-navy text-center">Sign In</CardTitle>
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
                          placeholder="Enter your username"
                          className="border-mia-navy/20 focus:border-mia-navy"
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
                            placeholder="Enter your password"
                            className="border-mia-navy/20 focus:border-mia-navy pr-10"
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

                <Button
                  type="submit"
                  className="w-full bg-mia-navy hover:bg-mia-navy/90 text-white font-semibold py-3 text-lg"
                  disabled={isSubmitting}
                  data-testid="button-sign-in"
                >
                  {isSubmitting ? "Signing In..." : "Sign In"}
                </Button>

                <div className="text-center space-y-4">
                  <div className="text-sm text-mia-navy/60">
                    Don't have an account yet?
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Link to="/parent-form" data-testid="link-parent-signup">
                      <Button variant="outline" size="sm" className="border-mia-pink text-mia-pink hover:bg-mia-pink/10">
                        Sign up as Parent
                      </Button>
                    </Link>
                    <Link to="/clinician-form" data-testid="link-clinician-signup">
                      <Button variant="outline" size="sm" className="border-mia-blue text-mia-blue hover:bg-mia-blue/10">
                        Sign up as Clinician
                      </Button>
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}