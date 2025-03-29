import { Icons } from "@/lib/icons";

export default function WorkflowBuilder() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Build Powerful Workflows in Minutes</h2>
        <p className="text-lg text-slate-600">Our intuitive drag-and-drop interface makes it easy to create complex automations without writing code.</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Builder Toolbar */}
        <div className="bg-slate-800 text-white px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button className="hover:bg-slate-700 px-3 py-1 rounded flex items-center">
              <Icons.save className="mr-2 h-4 w-4" /> Save
            </button>
            <button className="hover:bg-slate-700 px-3 py-1 rounded flex items-center">
              <Icons.undo className="mr-2 h-4 w-4" /> Undo
            </button>
            <button className="hover:bg-slate-700 px-3 py-1 rounded flex items-center">
              <Icons.redo className="mr-2 h-4 w-4" /> Redo
            </button>
          </div>
          <h3 className="font-medium">Editing: Customer Onboarding</h3>
          <div>
            <button className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded flex items-center">
              <Icons.play className="mr-2 h-4 w-4" /> Test Workflow
            </button>
          </div>
        </div>
        
        {/* Builder Workspace */}
        <div className="flex h-[500px]">
          {/* Left Sidebar: Components */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto">
            <h4 className="font-medium mb-3 text-slate-700">Triggers</h4>
            <div className="space-y-2 mb-6">
              <div className="bg-white p-3 border border-slate-200 rounded-md hover:border-primary-300 cursor-grab shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-50 rounded-md flex items-center justify-center mr-3">
                    <Icons.globe className="text-primary-500 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Webhook</span>
                </div>
              </div>
              <div className="bg-white p-3 border border-slate-200 rounded-md hover:border-primary-300 cursor-grab shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center mr-3">
                    <Icons.clock className="text-blue-500 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Schedule</span>
                </div>
              </div>
              <div className="bg-white p-3 border border-slate-200 rounded-md hover:border-primary-300 cursor-grab shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-50 rounded-md flex items-center justify-center mr-3">
                    <Icons.email className="text-green-500 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Email Received</span>
                </div>
              </div>
            </div>
            
            <h4 className="font-medium mb-3 text-slate-700">Actions</h4>
            <div className="space-y-2">
              <div className="bg-white p-3 border border-slate-200 rounded-md hover:border-primary-300 cursor-grab shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-amber-50 rounded-md flex items-center justify-center mr-3">
                    <Icons.database className="text-amber-500 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Create Record</span>
                </div>
              </div>
              <div className="bg-white p-3 border border-slate-200 rounded-md hover:border-primary-300 cursor-grab shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-50 rounded-md flex items-center justify-center mr-3">
                    <Icons.paperPlane className="text-purple-500 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Send Email</span>
                </div>
              </div>
              <div className="bg-white p-3 border border-slate-200 rounded-md hover:border-primary-300 cursor-grab shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-50 rounded-md flex items-center justify-center mr-3">
                    <Icons.code className="text-red-500 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">HTTP Request</span>
                </div>
              </div>
              <div className="bg-white p-3 border border-slate-200 rounded-md hover:border-primary-300 cursor-grab shadow-sm">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-50 rounded-md flex items-center justify-center mr-3">
                    <Icons.file className="text-indigo-500 h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Create Document</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Center: Workflow Canvas */}
          <div className="flex-1 p-6 overflow-auto bg-slate-50 relative" id="workflow-canvas">
            {/* Start Node */}
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-md border border-slate-300 shadow-sm w-64 p-4 z-10">
              <div className="bg-primary-50 rounded-md p-3 flex items-center mb-3">
                <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                  <Icons.globe className="text-white h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Webhook Trigger</h4>
                  <p className="text-xs text-slate-600">When form is submitted</p>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-3 text-center">
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center mx-auto">
                  <Icons.settings className="mr-1 h-3 w-3" /> Configure
                </button>
              </div>
            </div>
            
            {/* Connection Line */}
            <div className="absolute h-20 w-0.5 bg-slate-300 top-[140px] left-1/2 transform -translate-x-1/2"></div>
            
            {/* Action Node 1 */}
            <div className="absolute top-44 left-1/2 transform -translate-x-1/2 bg-white rounded-md border border-slate-300 shadow-sm w-64 p-4 z-10">
              <div className="bg-green-50 rounded-md p-3 flex items-center mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <Icons.database className="text-white h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Create Customer</h4>
                  <p className="text-xs text-slate-600">Add to CRM database</p>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-3 text-center">
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center mx-auto">
                  <Icons.settings className="mr-1 h-3 w-3" /> Configure
                </button>
              </div>
            </div>
            
            {/* Connection Line */}
            <div className="absolute h-20 w-0.5 bg-slate-300 top-[268px] left-1/2 transform -translate-x-1/2"></div>
            
            {/* Action Node 2 */}
            <div className="absolute top-80 left-1/2 transform -translate-x-1/2 bg-white rounded-md border border-slate-300 shadow-sm w-64 p-4 z-10">
              <div className="bg-purple-50 rounded-md p-3 flex items-center mb-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                  <Icons.paperPlane className="text-white h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Send Welcome Email</h4>
                  <p className="text-xs text-slate-600">To new customer</p>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-3 text-center">
                <button className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center mx-auto">
                  <Icons.settings className="mr-1 h-3 w-3" /> Configure
                </button>
              </div>
            </div>
            
            {/* Add Node Button */}
            <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 flex justify-center mt-4">
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full w-8 h-8 flex items-center justify-center shadow-sm border border-slate-300">
                <Icons.plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Right Sidebar: Properties */}
          <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
            <div className="p-4 border-b border-slate-200">
              <h4 className="font-medium mb-1">Properties</h4>
              <p className="text-xs text-slate-500">Configure the selected node</p>
            </div>
            
            <div className="p-4">
              <h5 className="font-medium mb-3 text-sm">Webhook Trigger</h5>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Webhook URL</label>
                  <div className="flex">
                    <input 
                      type="text" 
                      value="https://api.hub.com/webhooks/form-123" 
                      disabled 
                      className="bg-slate-50 border border-slate-300 rounded-l-md px-3 py-2 text-sm w-full" 
                    />
                    <button className="bg-slate-100 border border-slate-300 border-l-0 rounded-r-md px-3">
                      <Icons.copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Authentication</label>
                  <select className="border border-slate-300 rounded-md px-3 py-2 w-full text-sm">
                    <option>No Authentication</option>
                    <option>Basic Auth</option>
                    <option>API Key</option>
                    <option>OAuth 2.0</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expected Data Format</label>
                  <select className="border border-slate-300 rounded-md px-3 py-2 w-full text-sm">
                    <option>JSON</option>
                    <option>Form Data</option>
                    <option>XML</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Sample Data</label>
                  <textarea 
                    className="border border-slate-300 rounded-md px-3 py-2 w-full h-32 text-sm font-mono" 
                    placeholder={`{
  "name": "John Doe",
  "email": "john@example.com"
}`}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
