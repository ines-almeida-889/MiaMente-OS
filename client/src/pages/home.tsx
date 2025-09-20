import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mia-navy to-mia-navy/80 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        {/* Logo and Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="flex items-center space-x-1">
              <div className="w-8 h-8 bg-mia-pink rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mia-logo text-4xl text-white">
              mia mente
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Your child deserves the best care
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Connect with trusted pediatric healthcare professionals or join our network of specialists
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Individual/Parent Card */}
          <Link to="/parent-form" data-testid="link-parent-form">
            <Card className="h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/95 backdrop-blur-sm border-0 overflow-hidden group">
              <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                <div>
                  <div className="bg-mia-pink/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-mia-pink/20 transition-colors">
                    <Heart className="h-10 w-10 text-mia-pink" />
                  </div>
                  <h2 className="text-2xl font-bold text-mia-navy mb-4">
                    For Parents
                  </h2>
                  <p className="text-mia-navy/70 mb-6 leading-relaxed">
                    Find the right specialist for your child's needs. Get personalized care recommendations and connect with trusted professionals.
                  </p>
                </div>
                <Button 
                  className="w-full bg-mia-pink hover:bg-mia-pink/90 text-white font-semibold py-3 rounded-xl transition-colors"
                  data-testid="button-start-parent"
                >
                  Get Started as Parent
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Clinician Card */}
          <Link to="/clinician-form" data-testid="link-clinician-form">
            <Card className="h-full cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white/95 backdrop-blur-sm border-0 overflow-hidden group">
              <CardContent className="p-8 text-center h-full flex flex-col justify-between">
                <div>
                  <div className="bg-mia-blue/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-mia-blue/20 transition-colors">
                    <Stethoscope className="h-10 w-10 text-mia-blue" />
                  </div>
                  <h2 className="text-2xl font-bold text-mia-navy mb-4">
                    For Clinicians
                  </h2>
                  <p className="text-mia-navy/70 mb-6 leading-relaxed">
                    Join our network of healthcare professionals. Connect with families and provide exceptional pediatric care.
                  </p>
                </div>
                <Button 
                  className="w-full bg-mia-blue hover:bg-mia-blue/90 text-white font-semibold py-3 rounded-xl transition-colors"
                  data-testid="button-start-clinician"
                >
                  Join as Clinician
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer Text */}
        <div className="mt-12 text-white/60 text-sm">
          <p>Trusted by families and healthcare professionals across Australia</p>
        </div>
      </div>
    </div>
  );
}