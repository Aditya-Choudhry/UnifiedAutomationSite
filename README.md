# Unified Automation Hub

Unified Automation Hub is a modern web platform that enables seamless workflow automation between applications through an interactive and user-friendly interface. This platform allows you to create, manage, and execute automated workflows with drag-and-drop functionality and real-time monitoring.

## Features

- **Interactive Workflow Builder**: Drag-and-drop interface for creating complex workflows
- **Real-time Execution Monitoring**: Track workflow execution with WebSocket integration
- **Node Configuration**: Configure each node with conditions, transformations, and validations
- **AI-Powered Suggestions**: Get workflow recommendations based on your needs
- **Integration Showcase**: Connect with various third-party services and applications
- **Workflow Testing**: Test and debug workflows before deployment
- **Role-Based Access Control**: Secure access with user roles and permissions
- **Community Sharing**: Share and discover workflows created by others

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Drizzle ORM
- **Real-time Communication**: WebSockets for live updates
- **Caching and Pub/Sub**: Redis (with fallback to in-memory when unavailable)
- **State Management**: React Query for API data

## Project Structure

```
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── demo/            # Demo-specific components
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── use-websocket.ts # WebSocket integration hook
│   │   ├── lib/                 # Utility functions
│   │   │   ├── icons.ts         # Icon definitions
│   │   │   ├── queryClient.ts   # React Query setup
│   │   │   └── utils.ts         # Helper functions
│   │   ├── pages/               # Application pages
│   │   │   ├── About.tsx        # About page
│   │   │   ├── Demo.tsx         # Interactive demo
│   │   │   ├── Home.tsx         # Landing page
│   │   │   ├── Pricing.tsx      # Pricing plans
│   │   │   └── Work.tsx         # Case studies/examples
│   │   ├── App.tsx              # Main application component
│   │   ├── index.css            # Global styles
│   │   └── main.tsx             # Application entry point
│   └── index.html               # HTML template
├── server/                      # Backend Express server
│   ├── api/                     # API routes and controllers
│   │   └── index.ts             # API router setup
│   ├── services/                # Service layer
│   │   ├── ai.ts                # AI service for workflow suggestions
│   │   ├── redis.ts             # Redis service with fallback
│   │   └── websocket.ts         # WebSocket service
│   ├── db.ts                    # Database connection
│   ├── index.ts                 # Server entry point
│   ├── routes.ts                # Main route configuration
│   ├── storage.ts               # Data storage interface
│   ├── types.ts                 # TypeScript type definitions
│   └── vite.ts                  # Vite integration for serving frontend
├── shared/                      # Shared code between frontend and backend
│   └── schema.ts                # Database schema with Drizzle
├── drizzle.config.ts            # Drizzle ORM configuration
├── package.json                 # Project dependencies
├── theme.json                   # UI theme configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── vite.config.ts               # Vite bundler configuration
```

## Key Components

### Frontend

1. **WorkflowCanvas** (`client/src/components/demo/WorkflowCanvas.tsx`)
   - Main drag-and-drop workflow builder component
   - Manages node connections and layout

2. **WorkflowNode** (`client/src/components/demo/WorkflowNode.tsx`)
   - Individual node component with type-specific rendering
   - Handles node state and connections

3. **NodeConfigPanel** (`client/src/components/demo/NodeConfigPanel.tsx`)
   - Configuration interface for workflow nodes
   - Supports conditions, transformations, and validations

4. **WorkflowTester** (`client/src/components/demo/WorkflowTester.tsx`)
   - Executes and monitors workflows
   - Displays real-time logs and results

5. **WebSocket Hook** (`client/src/hooks/use-websocket.ts`)
   - Manages WebSocket connections with auto-reconnect
   - Handles message sending and receiving

### Backend

1. **Storage Interface** (`server/storage.ts`)
   - Defines data access interface
   - Implemented by PostgreSQL or in-memory storage

2. **WebSocket Service** (`server/services/websocket.ts`)
   - Handles real-time communication
   - Sends execution updates to connected clients

3. **Redis Service** (`server/services/redis.ts`)
   - Manages caching and pub/sub messaging
   - Features graceful degradation to in-memory storage

4. **AI Service** (`server/services/ai.ts`)
   - Generates workflow suggestions
   - Calculates workflow complexity scores

## API Routes

The API is structured around RESTful principles with these main endpoints:

- **Authentication**
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration
  - `GET /api/me` - Get current user information

- **Workflows**
  - `GET /api/workflows` - List user's workflows
  - `GET /api/workflows/public` - List public workflows
  - `GET /api/workflows/featured` - List featured workflows
  - `GET /api/workflows/:id` - Get specific workflow
  - `POST /api/workflows` - Create new workflow
  - `PATCH /api/workflows/:id` - Update workflow
  - `DELETE /api/workflows/:id` - Delete workflow

- **Workflow Execution**
  - `POST /api/workflows/:id/execute` - Execute a workflow
  - `GET /api/workflows/:id/executions` - Get execution history

- **Integrations**
  - `GET /api/integrations` - List available integrations
  - `POST /api/integrations` - Add new integration

- **Suggestions**
  - `GET /api/suggestions` - Get AI-powered workflow suggestions

## WebSocket Communication

WebSocket communication follows this pattern:

1. Connection established on path `/ws`
2. Authentication via `{ type: 'auth', userId: number }` message
3. Subscribe to workflow updates with `{ type: 'subscribe', workflowId: number }`
4. Trigger workflow execution with `{ type: 'workflow_execute', workflowId: number, nodes: any[] }`
5. Receive updates via `{ type: 'workflow_execution_update', nodeId: string, status: string }` messages

## Troubleshooting

### Redis Connection Issues

The system is designed to gracefully handle Redis unavailability:

1. Redis connection attempts will automatically fail after 5 retries
2. The system will switch to in-memory mode for caching and messaging
3. Watch logs for: `Switching to Redis mock mode - all data will be stored in memory`

### WebSocket Connection Issues

If WebSocket connections fail:

1. Check browser console for connection errors
2. Verify server logs for WebSocket initialization messages
3. The frontend automatically attempts to reconnect with exponential backoff
4. The WebSocketStatus component shows the current connection state

### Database Issues

For PostgreSQL database problems:

1. Verify DATABASE_URL environment variable is correctly set
2. Check server logs for database connection errors
3. For schema issues, refer to `shared/schema.ts` for the correct data model

## Performance Optimization

The application includes several performance optimizations:

1. Redis caching for frequently accessed data
2. WebSocket connection for real-time updates instead of polling
3. React Query for efficient API data fetching and caching
4. React memoization for expensive UI components

## Improvement Opportunities

1. **Authentication Enhancement**
   - Implement OAuth integration for third-party login
   - Add two-factor authentication

2. **Workflow Templates**
   - Create a library of pre-built workflow templates
   - Allow saving custom templates

3. **Advanced Node Types**
   - Add specialized nodes for specific integrations
   - Support custom code nodes for advanced users

4. **Data Visualization**
   - Add charts and graphs for workflow execution statistics
   - Visualize data transformations between nodes

5. **Mobile Optimization**
   - Enhance mobile responsiveness for workflow builder
   - Create companion mobile app for notifications

6. **AI Enhancements**
   - Improve suggestion algorithms with machine learning
   - Add predictive error detection

## Environment Variables

The application requires these environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST`: Redis server hostname (optional, defaults to localhost)
- `REDIS_PORT`: Redis server port (optional, defaults to 6379)
- `REDIS_PASSWORD`: Redis password (optional)
- `PORT`: Server port (optional, defaults to 5000)

## License

[MIT License](LICENSE)