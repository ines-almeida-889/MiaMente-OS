import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { StatsCard } from "@/components/dashboard/stats-card";
import { 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Timer, 
  Eye, 
  Download, 
  FileText, 
  BarChart, 
  Settings,
  Search
} from "lucide-react";

export default function InsuranceDashboard() {
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);

  const stats = [
    {
      title: "Pending Claims",
      value: "23",
      icon: Clock,
      iconColor: "text-yellow-600"
    },
    {
      title: "Approved This Month",
      value: "156",
      icon: CheckCircle,
      iconColor: "text-green-600"
    },
    {
      title: "Total Subsidies",
      value: "$342K",
      icon: DollarSign,
      iconColor: "text-primary-600"
    },
    {
      title: "Processing Time",
      value: "3.2",
      subtitle: "days average",
      icon: Timer,
      iconColor: "text-primary-600"
    }
  ];

  const pendingClaims = [
    {
      id: "claim-1",
      claimNumber: "NDIS-2024-0312-001",
      patient: "Emma Johnson",
      service: "Speech Therapy Services",
      amount: "$2,840",
      status: "Review Required",
      statusColor: "bg-yellow-100 text-yellow-700",
      submitted: "Mar 12, 2024",
      provider: "Sunshine Therapy",
      period: "Feb 1-28, 2024"
    },
    {
      id: "claim-2",
      claimNumber: "NDIS-2024-0311-002",
      patient: "Alex Chen",
      service: "Occupational Therapy Services",
      amount: "$1,920",
      status: "Priority",
      statusColor: "bg-primary-100 text-primary-700",
      submitted: "Mar 11, 2024",
      provider: "Active Kids Therapy",
      period: "Feb 1-28, 2024"
    }
  ];

  const recentApprovals = [
    { id: 1, claimNumber: "NDIS-2024-0310", amount: "$1,560", time: "2h ago" },
    { id: 2, claimNumber: "NDIS-2024-0309", amount: "$2,200", time: "4h ago" },
    { id: 3, claimNumber: "NDIS-2024-0308", amount: "$890", time: "6h ago" }
  ];

  const toggleClaimSelection = (claimId: string) => {
    setSelectedClaims(prev => 
      prev.includes(claimId) 
        ? prev.filter(id => id !== claimId)
        : [...prev, claimId]
    );
  };

  const handleBulkApprove = () => {
    console.log("Bulk approving claims:", selectedClaims);
    // Here you would make an API call to bulk approve claims
  };

  const handleClaimAction = (claimId: string, action: 'approve' | 'reject') => {
    console.log(`${action} claim:`, claimId);
    // Here you would make an API call to approve or reject the claim
  };

  const handleGenerateReport = () => {
    console.log("Generating PDF report");
    // Here you would implement PDF generation
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Insurance Portal</h1>
        <p className="text-slate-600">Review claims, manage subsidies, and track approvals</p>
      </div>

      {/* Insurance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claims Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-900">Pending Claims Review</CardTitle>
                <div className="flex space-x-2">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Claims" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Claims</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                      <SelectItem value="review">Requires Review</SelectItem>
                      <SelectItem value="docs">Documentation Needed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleBulkApprove}
                    disabled={selectedClaims.length === 0}
                    className="text-sm"
                  >
                    Bulk Approve
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingClaims.map((claim) => (
                  <div key={claim.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          checked={selectedClaims.includes(claim.id)}
                          onCheckedChange={() => toggleClaimSelection(claim.id)}
                        />
                        <div>
                          <h3 className="font-medium text-slate-900">{claim.claimNumber}</h3>
                          <p className="text-sm text-slate-600">{claim.patient} - {claim.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${claim.statusColor}`}>
                          {claim.status}
                        </span>
                        <span className="text-sm text-slate-600">{claim.amount}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-slate-600">Submitted:</span>
                        <span className="font-medium text-slate-900 ml-1">{claim.submitted}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Provider:</span>
                        <span className="font-medium text-slate-900 ml-1">{claim.provider}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Period:</span>
                        <span className="font-medium text-slate-900 ml-1">{claim.period}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="bg-primary-100 text-primary-700 border-primary-200">
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Documents
                        </Button>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200"
                          onClick={() => handleClaimAction(claim.id, 'reject')}
                        >
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                          onClick={() => handleClaimAction(claim.id, 'approve')}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* PDF Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Generate Subsidy Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Report Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly Subsidy Summary</SelectItem>
                      <SelectItem value="individual">Individual Client Report</SelectItem>
                      <SelectItem value="provider">Provider Performance</SelectItem>
                      <SelectItem value="claims">Claims Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" />
                    <Input type="date" />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Button onClick={handleGenerateReport} className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Generate PDF</span>
                </Button>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export Excel</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Processing Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Processing Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Auto-Approved</span>
                    <span className="font-medium text-green-600">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Manual Review</span>
                    <span className="font-medium text-yellow-600">11%</span>
                  </div>
                  <Progress value={11} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-slate-600">Rejected</span>
                    <span className="font-medium text-red-600">2%</span>
                  </div>
                  <Progress value={2} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Recent Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{approval.claimNumber}</p>
                      <p className="text-xs text-slate-600">{approval.amount} approved</p>
                    </div>
                    <span className="text-xs text-slate-500">{approval.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full flex items-center space-x-3 p-3 bg-primary-50 hover:bg-primary-100 border border-primary-200 justify-start h-auto">
                  <div className="bg-primary-500 rounded-lg p-2">
                    <Search className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-slate-900">Advanced Search</span>
                </Button>
                
                <Button variant="outline" className="w-full flex items-center space-x-3 p-3 justify-start h-auto">
                  <div className="bg-slate-500 rounded-lg p-2">
                    <BarChart className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-slate-900">Analytics</span>
                </Button>
                
                <Button variant="outline" className="w-full flex items-center space-x-3 p-3 justify-start h-auto">
                  <div className="bg-slate-500 rounded-lg p-2">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-slate-900">Settings</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
