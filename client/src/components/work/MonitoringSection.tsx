import { useState } from "react";
import { Icons } from "@/lib/icons";

export default function MonitoringSection() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const recentExecutions = [
    {
      workflow: "Customer Onboarding",
      status: "Completed",
      duration: "1.2s",
      started: "3 min ago",
      icon: <Icons.robot className="text-primary-500 h-4 w-4" />,
      iconBg: "bg-primary-50"
    },
    {
      workflow: "Lead Qualification",
      status: "Completed",
      duration: "0.8s",
      started: "5 min ago",
      icon: <Icons.robot className="text-amber-500 h-4 w-4" />,
      iconBg: "bg-amber-50"
    },
    {
      workflow: "Invoice Processing",
      status: "Failed",
      duration: "3.5s",
      started: "11 min ago",
      icon: <Icons.robot className="text-red-500 h-4 w-4" />,
      iconBg: "bg-red-50"
    },
    {
      workflow: "Inventory Alerts",
      status: "Completed",
      duration: "0.6s",
      started: "22 min ago",
      icon: <Icons.robot className="text-green-500 h-4 w-4" />,
      iconBg: "bg-green-50"
    }
  ];

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Real-Time Monitoring & Logs</h2>
          <p className="text-lg text-slate-600">Keep track of your workflow performance with detailed analytics and logs.</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          {/* Monitoring Tabs */}
          <div className="border-b border-slate-200 overflow-x-auto">
            <div className="flex">
              <button 
                className={`px-6 py-4 font-medium ${activeTab === "dashboard" ? "text-primary-600 border-b-2 border-primary-500" : "text-slate-600 hover:text-slate-900"}`}
                onClick={() => setActiveTab("dashboard")}
              >
                Dashboard
              </button>
              <button 
                className={`px-6 py-4 font-medium ${activeTab === "execution-logs" ? "text-primary-600 border-b-2 border-primary-500" : "text-slate-600 hover:text-slate-900"}`}
                onClick={() => setActiveTab("execution-logs")}
              >
                Execution Logs
              </button>
              <button 
                className={`px-6 py-4 font-medium ${activeTab === "error-logs" ? "text-primary-600 border-b-2 border-primary-500" : "text-slate-600 hover:text-slate-900"}`}
                onClick={() => setActiveTab("error-logs")}
              >
                Error Logs
              </button>
              <button 
                className={`px-6 py-4 font-medium ${activeTab === "alerts" ? "text-primary-600 border-b-2 border-primary-500" : "text-slate-600 hover:text-slate-900"}`}
                onClick={() => setActiveTab("alerts")}
              >
                Alerts
              </button>
            </div>
          </div>
          
          {/* Dashboard Content */}
          <div className="p-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Total Executions (Today)</h3>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold">1,284</p>
                  <span className="text-green-600 flex items-center text-sm">
                    <Icons.arrowUp className="mr-1 h-3 w-3" /> 12.5%
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Success Rate</h3>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold">98.7%</p>
                  <span className="text-green-600 flex items-center text-sm">
                    <Icons.arrowUp className="mr-1 h-3 w-3" /> 0.5%
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Avg. Execution Time</h3>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold">1.3s</p>
                  <span className="text-green-600 flex items-center text-sm">
                    <Icons.arrowDown className="mr-1 h-3 w-3" /> 0.2s
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <h3 className="text-sm font-medium text-slate-500 mb-1">Active Workflows</h3>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-semibold">16</p>
                  <span className="text-amber-600 flex items-center text-sm">
                    <Icons.minus className="mr-1 h-3 w-3" /> No change
                  </span>
                </div>
              </div>
            </div>
            
            {/* Execution Chart */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium">Execution Volume (24h)</h3>
                <div className="flex space-x-2">
                  <button className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-md">Hour</button>
                  <button className="bg-primary-100 text-primary-700 text-xs px-3 py-1 rounded-md">Day</button>
                  <button className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-md">Week</button>
                  <button className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-md">Month</button>
                </div>
              </div>
              
              {/* Placeholder for Chart */}
              <div className="h-64 bg-slate-50 rounded-md border border-slate-200 flex items-center justify-center">
                <p className="text-slate-400 flex items-center">
                  <Icons.chart className="mr-2 h-4 w-4" /> Chart Visualization
                </p>
              </div>
            </div>
            
            {/* Recent Executions */}
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Recent Executions</h3>
                <a href="#" className="text-primary-600 text-sm font-medium">View All</a>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Workflow</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Started</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recentExecutions.map((execution, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-3 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-8 w-8 ${execution.iconBg} rounded-md flex items-center justify-center mr-3`}>
                              {execution.icon}
                            </div>
                            <span className="font-medium">{execution.workflow}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(execution.status)}`}>
                            {execution.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-slate-600">
                          {execution.duration}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-slate-600">
                          {execution.started}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <button className="text-slate-400 hover:text-primary-500">
                            <Icons.info className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
