# Overview

HealthConnect is a comprehensive healthcare management platform that connects parents, clinics, and insurance providers in a unified ecosystem. The application facilitates child healthcare management through intake forms, appointment scheduling, session tracking, claims processing, and document management. It features role-based dashboards for different user types (parents, clinics, insurance) and provides a streamlined workflow for healthcare service delivery and reimbursement.

# User Preferences

Preferred communication style: Simple, everyday language.

## Branding Guidelines
- **Brand Name**: Mia Mente (replaces HealthConnect)
- **Typography**: Poppins font family for headings and body text
- **Color Palette**: 
  - Primary Navy: #3a4d7a (hsl(230, 39%, 28%))
  - Soft Coral Pink: #ffccc7 (hsl(14, 100%, 85%))
  - Light Blue: #b3e0ff (hsl(204, 100%, 86%))
  - Light Purple: #e0ccff (hsl(258, 100%, 91%))
- **Design Elements**: Wonky pink circles for background, rounded corners, minimal icons
- **UI Style**: Clean, modern, child-friendly with soft colors, light gradients, and subtle animations

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript using Vite as the build tool. The architecture follows a component-based design with:

- **UI Components**: Utilizes shadcn/ui component library built on Radix UI primitives for consistent design
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: React Query (TanStack Query) for server state management with custom query client
- **Routing**: wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for form handling
- **Role-Based Views**: Separate dashboard components for parent, clinic, and insurance user roles

The frontend uses a clean separation between UI components (`/components/ui`), feature components (`/components`), and pages (`/pages`). Path aliases are configured for clean imports with `@/` pointing to the client source directory.

## Backend Architecture
Express.js server with TypeScript providing RESTful API endpoints:

- **API Structure**: Route handlers organized by domain (auth, users, children, sessions, claims, etc.)
- **Middleware**: Request logging, JSON parsing, and error handling
- **Development Setup**: Vite middleware integration for hot reloading in development
- **Storage Layer**: Abstract storage interface allowing for pluggable data persistence implementations

The server follows a layered architecture with route handlers delegating to storage services, maintaining separation of concerns between HTTP handling and business logic.

## Data Storage
PostgreSQL database with Drizzle ORM for type-safe database operations:

- **Schema Design**: Relational model covering users, children, intake forms, clinics, sessions, claims, and documents
- **Type Safety**: Drizzle generates TypeScript types from schema definitions
- **Migration Support**: Drizzle Kit for database schema migrations
- **Shared Types**: Common schema types shared between client and server via `/shared` directory

The database schema supports multi-tenancy through user roles and maintains referential integrity across related entities.

## Authentication & Authorization
Role-based authentication system supporting three user types:

- **Parent Role**: Manage children, view sessions, handle intake forms
- **Clinic Role**: Manage patients, conduct sessions, generate reports
- **Insurance Role**: Process claims, manage approvals, track subsidies

The authentication manager handles role switching for demo purposes and maintains user state across the application.

## Key Features
- **Multi-Step Intake Forms**: Progressive form completion with save/resume functionality
- **File Upload System**: Document management with drag-and-drop interface
- **Dashboard Analytics**: Role-specific metrics and statistics
- **Session Management**: Appointment scheduling and progress tracking
- **Claims Processing**: Insurance claim submission and approval workflow

# External Dependencies

## Core Framework Dependencies
- **React 18+**: Frontend framework with hooks and modern patterns
- **Express.js**: Node.js web server framework
- **TypeScript**: Type safety across full stack
- **Vite**: Build tool and development server

## Database & ORM
- **Supabase**: PostgreSQL database hosting (replacing Neon)
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **Drizzle Kit**: Migration and schema management tools

## UI & Styling
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library

## State Management & Data Fetching
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Runtime type validation and schema parsing

## Development Tools
- **Replit Integration**: Development environment plugins and error handling
- **PostCSS**: CSS processing with Tailwind
- **ESBuild**: Fast JavaScript bundler for production builds

The application is configured for deployment on Replit with specific plugins for development experience and error overlay functionality.