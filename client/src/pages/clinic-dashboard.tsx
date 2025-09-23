import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { StatsCard } from "@/components/dashboard/stats-card";
import { 
  Users, 
  CalendarDays, 
  FileText, 
  DollarSign, 
  Plus, 
  Eye, 
  Edit,
  Calendar,
  Upload,
  FileCheck,
  Clock,
  CheckCircle
} from "lucide-react";
import { useLocation } from "wouter";
import { authManager } from "@/lib/auth";
import { ChatModal } from "@/components/ui/chat-modal";

export default function ClinicDashboard() {
  const [sessionNotes, setSessionNotes] = useState<{[key: string]: string}>({});
  const [goalsAchieved, setGoalsAchieved] = useState<{[key: string]: boolean}>({});
  const [homeworkAssigned, setHomeworkAssigned] = useState<{[key: string]: boolean}>({});
  const [, navigate] = useLocation();

  const stats = [
    {
      title: "Active Patients",
      value: "48",
      icon: Users,
      iconColor: "text-primary-600"
    },
    {
      title: "Today's Sessions",
      value: "12",
      icon: CalendarDays,
      iconColor: "text-green-600"
    },
    {
      title: "Pending Reports",
      value: "7",
      icon: FileText,
      iconColor: "text-yellow-600"
    },
    {
      title: "Monthly Revenue",
      value: "$24,580",
      icon: DollarSign,
      iconColor: "text-green-600"
    }
  ];

  const todaySessions = [
    {
      id: 1,
      patientName: "Emma Johnson",
      sessionType: "Speech Therapy",
      time: "2:00 PM",
      status: "scheduled"
    },
    {
      id: 2,
      patientName: "Alex Chen",
      sessionType: "Occupational Therapy",
      time: "3:30 PM",
      status: "completed"
    }
  ];

  const patients = [
    {
      id: 1,
      name: "Emma Johnson",
      age: 7,
      condition: "Autism Spectrum",
      lastSession: "Mar 10, 2024",
      progress: "On Track",
      progressColor: "bg-green-100 text-green-700"
    },
    {
      id: 2,
      name: "Alex Chen",
      age: 5,
      condition: "Speech Delay",
      lastSession: "Mar 12, 2024",
      progress: "Needs Attention",
      progressColor: "bg-yellow-100 text-yellow-700"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      icon: FileCheck,
      iconColor: "bg-primary-500",
      title: "Report uploaded for Emma J.",
      time: "30 minutes ago"
    },
    {
      id: 2,
      icon: CheckCircle,
      iconColor: "bg-green-500",
      title: "Session completed with Alex C.",
      time: "2 hours ago"
    },
    {
      id: 3,
      icon: Calendar,
      iconColor: "bg-yellow-500",
      title: "New referral received",
      time: "1 day ago"
    }
  ];

  const updateSessionNotes = (sessionId: string, notes: string) => {
    setSessionNotes((prev: {[key: string]: string}) => ({ ...prev, [sessionId]: notes }));
  };

  const toggleGoalsAchieved = (sessionId: string) => {
    setGoalsAchieved((prev: {[key: string]: boolean}) => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  const toggleHomeworkAssigned = (sessionId: string) => {
    setHomeworkAssigned((prev: {[key: string]: boolean}) => ({ ...prev, [sessionId]: !prev[sessionId] }));
  };

  const saveSessionNotes = (sessionId: string) => {
    console.log("Saving session notes for session", sessionId, {
      notes: sessionNotes[sessionId],
      goalsAchieved: goalsAchieved[sessionId],
      homeworkAssigned: homeworkAssigned[sessionId]
    });
    // Here you would make an API call to save the session notes
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Dashboard Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Clinic Dashboard</h1>
          <p className="text-slate-600">Manage patients, sessions, and treatment plans</p>
        </div>
        <Button variant="outline" onClick={() => { authManager.logout(); navigate('/login'); }}>Log Out</Button>
      </div>

      {/* Clinic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Sessions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">Today's Sessions</CardTitle>
                <Button variant="ghost" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySessions.map((session) => (
                  <div key={session.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{session.patientName}</h3>
                          <p className="text-sm text-slate-600">{session.sessionType} - {session.time}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {session.status === "scheduled" ? (
                          <Button size="sm" className="bg-primary-100 text-primary-700 hover:bg-primary-200">
                            Start Session
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            Completed
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Notes
                        </Button>
                      </div>
                    </div>
                    
                    {/* Session Notes Interface */}
                    <div className="bg-slate-50 rounded-lg p-3 mt-3">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Session Notes</label>
                      <Textarea
                        rows={2}
                        placeholder="Enter session notes..."
                        value={sessionNotes[session.id] || ""}
                        onChange={(e) => updateSessionNotes(session.id.toString(), e.target.value)}
                        className="text-sm"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex space-x-4 text-sm text-slate-600">
                          <label className="flex items-center">
                            <Checkbox 
                              checked={goalsAchieved[session.id] || false}
                              onCheckedChange={() => toggleGoalsAchieved(session.id.toString())}
                              className="mr-1"
                            />
                            Goals met
                          </label>
                          <label className="flex items-center">
                            <Checkbox 
                              checked={homeworkAssigned[session.id] || false}
                              onCheckedChange={() => toggleHomeworkAssigned(session.id.toString())}
                              className="mr-1"
                            />
                            Homework assigned
                          </label>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => saveSessionNotes(session.id.toString())}
                          className="text-sm"
                        >
                          Save Notes
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Patient Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">Patient Management</CardTitle>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Patient</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex space-x-4 mb-4">
                <div className="flex-1">
                  <Input placeholder="Search patients..." />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Patients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Patients</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="new">New Referrals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Patient List */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Patient</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Condition</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Last Session</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Progress</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-slate-400" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">{patient.name}</p>
                              <p className="text-slate-600">Age {patient.age}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{patient.condition}</td>
                        <td className="py-3 px-4 text-slate-600">{patient.lastSession}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${patient.progressColor}`}>
                            {patient.progress}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="ghost" className="text-primary-600 hover:text-primary-700">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-slate-600 hover:text-slate-700">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full flex items-center space-x-3 p-3 bg-primary-50 hover:bg-primary-100 border border-primary-200 justify-start h-auto">
                  <div className="bg-primary-500 rounded-lg p-2">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-slate-900">Generate Report</span>
                </Button>
                
                <Button variant="outline" className="w-full flex items-center space-x-3 p-3 justify-start h-auto">
                  <div className="bg-slate-500 rounded-lg p-2">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-slate-900">Schedule Session</span>
                </Button>
                
                <Button variant="outline" className="w-full flex items-center space-x-3 p-3 justify-start h-auto">
                  <div className="bg-slate-500 rounded-lg p-2">
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-slate-900">Upload Documents</span>
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
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`${activity.iconColor} rounded-full p-1 mt-1`}>
                      <activity.icon className="h-3 w-3 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                      <p className="text-xs text-slate-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ChatModal />
    </div>
  );
}
