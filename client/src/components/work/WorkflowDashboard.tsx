import { useState } from "react";
import { Icons } from "@/lib/icons";

export default function WorkflowDashboard() {
  const [activeTab, setActiveTab] = useState("my-workflows");
  
  const workflows = [
    {
      name: "Customer Onboarding",
      status: "Active",
      description: "Automates new customer setup in CRM, accounting, and email systems",
      executions: "127 executions today",
      modified: "Modified 2d ago"
    },
    {
      name: "Lead Qualification",
      status: "Active",
      description: "Scores and routes leads based on website activity and form submissions",
      executions: "42 executions today",
      modified: "Modified 3d ago"
    },
    {
      name: "Invoice Processing",
      status: "Error",
      description: "Extracts data from invoices and adds to accounting software",
      executions: "6 errors today",
      modified: "Modified 1d ago"
    },
    {
      name: "Inventory Alerts",
      status: "Active",
      description: "Sends notifications when inventory levels reach thresholds",
      executions: "3 executions today",
      modified: "Modified 1w ago"
    },
    {
      name: "Support Ticket Triage",
      status: "Paused",
      description: "Categorizes and assigns incoming support tickets",
      executions: "Paused 2d ago",
      modified: "Modified 5d ago"
    }
  ];

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Error":
        return "bg-red-100 text-red-800";
      case "Paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Workflow Management</h1>
        <p className="text-xl text-slate-600">Create, test, and monitor your automated workflows with our intuitive interface.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
        {/* Workflow Dashboard Nav */}
        <div className="flex border-b border-slate-200 overflow-x-auto">
          <button 
            className={`px-6 py-4 font-medium ${activeTab === "my-workflows" ? "text-primary-600 border-b-2 border-primary-500" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("my-workflows")}
          >
            My Workflows
          </button>
          <button 
            className={`px-6 py-4 font-medium ${activeTab === "templates" ? "text-primary-600 border-b-2 border-primary-500" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
          <button 
            className={`px-6 py-4 font-medium ${activeTab === "team" ? "text-primary-600 border-b-2 border-primary-500" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("team")}
          >
            Team Workflows
          </button>
          <button 
            className={`px-6 py-4 font-medium ${activeTab === "archived" ? "text-primary-600 border-b-2 border-primary-500" : "text-slate-600 hover:text-slate-900"}`}
            onClick={() => setActiveTab("archived")}
          >
            Archived
          </button>
        </div>
        
        {/* Workflow Controls */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center space-x-3">
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-md shadow-sm flex items-center">
              <Icons.plus className="mr-2 h-4 w-4" /> New Workflow
            </button>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search workflows..." 
                className="border border-slate-300 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64" 
              />
              <Icons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select className="border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white">
              <option>Sort by: Last Modified</option>
              <option>Sort by: Name</option>
              <option>Sort by: Status</option>
              <option>Sort by: Executions</option>
            </select>
            <button className="border border-slate-300 bg-white hover:bg-slate-50 px-3 py-2 rounded-md">
              <Icons.grid className="h-4 w-4" />
            </button>
            <button className="border border-slate-300 bg-white hover:bg-slate-50 px-3 py-2 rounded-md">
              <Icons.list className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Workflows List */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workflows.map((workflow, index) => (
              <div key={index} className="border border-slate-200 rounded-lg hover:shadow-md transition cursor-pointer group">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-medium group-hover:text-primary-600">{workflow.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(workflow.status)}`}>
                    {workflow.status}
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-slate-600 mb-3">{workflow.description}</p>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{workflow.executions}</span>
                    <span>{workflow.modified}</span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="border border-dashed border-slate-300 rounded-lg hover:border-primary-300 transition cursor-pointer flex items-center justify-center p-8 group">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icons.plus className="text-primary-500 h-5 w-5" />
                </div>
                <p className="font-medium text-slate-600 group-hover:text-primary-600">Create New Workflow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
