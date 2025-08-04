import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/stats-card";
import { FileUpload } from "@/components/upload/file-upload";
import { 
  FileText, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  Upload, 
  Search, 
  FileDown,
  User,
  UserCheck,
  Clock
} from "lucide-react";

export default function ParentDashboard() {
  const [, setLocation] = useLocation();
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleStartIntake = () => {
    setLocation("/intake-form");
  };

  const stats = [
    {
      title: "Active Cases",
      value: "2",
      icon: FileText,
      iconColor: "text-primary-600"
    },
    {
      title: "Upcoming Appointments",
      value: "3",
      icon: Calendar,
      iconColor: "text-green-600"
    },
    {
      title: "Progress Reports",
      value: "12",
      icon: TrendingUp,
      iconColor: "text-yellow-600"
    },
    {
      title: "Subsidy Status",
      value: "Approved",
      icon: DollarSign,
      iconColor: "text-green-600",
      valueColor: "text-green-600"
    }
  ];

  const activities = [
    {
      id: 1,
      icon: UserCheck,
      iconColor: "bg-primary-500",
      title: "Session completed with Dr. Martinez",
      description: "Speech therapy session - 2 hours ago",
      time: "2h"
    },
    {
      id: 2,
      icon: FileText,
      iconColor: "bg-green-500",
      title: "Progress report uploaded",
      description: "Monthly assessment completed",
      time: "1d"
    },
    {
      id: 3,
      icon: Calendar,
      iconColor: "bg-yellow-500",
      title: "Appointment scheduled",
      description: "Next session: March 15, 2024",
      time: "3d"
    }
  ];

  const appointments = [
    {
      id: 1,
      type: "Speech Therapy",
      provider: "Dr. Martinez",
      date: "March 15, 2024 at 2:00 PM",
      status: "Confirmed",
      statusColor: "bg-primary-100 text-primary-700"
    },
    {
      id: 2,
      type: "Occupational Therapy",
      provider: "Dr. Chen",
      date: "March 18, 2024 at 10:00 AM",
      status: "Pending",
      statusColor: "bg-yellow-100 text-yellow-700"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Welcome back, <span className="text-primary-600">Sarah Johnson</span>
        </h1>
        <p className="text-slate-600">Manage your child's healthcare journey and track progress</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleStartIntake}
                  className="flex items-center space-x-3 p-4 bg-primary-50 hover:bg-primary-100 border border-primary-200 text-left h-auto justify-start"
                  variant="outline"
                >
                  <div className="bg-primary-500 rounded-lg p-2">
                    <Plus className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Start New Assessment</p>
                    <p className="text-sm text-slate-600">Begin intake form</p>
                  </div>
                </Button>
                
                <Button
                  onClick={() => setShowFileUpload(true)}
                  className="flex items-center space-x-3 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left h-auto justify-start"
                  variant="outline"
                >
                  <div className="bg-slate-500 rounded-lg p-2">
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Upload Documents</p>
                    <p className="text-sm text-slate-600">Add medical reports</p>
                  </div>
                </Button>
                
                <Button
                  className="flex items-center space-x-3 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left h-auto justify-start"
                  variant="outline"
                >
                  <div className="bg-slate-500 rounded-lg p-2">
                    <Search className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Find Clinics</p>
                    <p className="text-sm text-slate-600">Browse specialists</p>
                  </div>
                </Button>
                
                <Button
                  className="flex items-center space-x-3 p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left h-auto justify-start"
                  variant="outline"
                >
                  <div className="bg-slate-500 rounded-lg p-2">
                    <FileDown className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Generate Report</p>
                    <p className="text-sm text-slate-600">Download summary</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className={`${activity.iconColor} rounded-full p-2 mt-1`}>
                      <activity.icon className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-600">{activity.description}</p>
                    </div>
                    <span className="text-xs text-slate-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Child Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Child Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <User className="h-8 w-8 text-slate-400" />
                </div>
                <h4 className="font-medium text-slate-900">Emma Johnson</h4>
                <p className="text-sm text-slate-600">Age 7</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Condition:</span>
                  <span className="font-medium text-slate-900">Autism Spectrum</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">NDIS Plan:</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Progress:</span>
                  <span className="font-medium text-slate-900">On Track</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-900">{appointment.type}</span>
                      <span className={`text-xs px-2 py-1 rounded ${appointment.statusColor}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{appointment.provider}</p>
                    <p className="text-xs text-slate-600">{appointment.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* File Upload Modal */}
      <FileUpload
        isOpen={showFileUpload}
        onClose={() => setShowFileUpload(false)}
        childId="child-1"
      />
    </div>
  );
}
