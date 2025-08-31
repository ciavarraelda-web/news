# CryptoICO Platform

## Overview

CryptoICO is a modern web application that provides cryptocurrency news aggregation and ICO (Initial Coin Offering) sponsorship services. The platform features a React-based frontend with a dark cryptocurrency theme, an Express.js backend with PostgreSQL database integration, and various third-party service integrations for news and payment processing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for dark theme
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Build Tool**: Vite for development and production builds

The frontend follows a component-based architecture with separate pages for home and admin views. Custom hooks manage mobile responsiveness and toast notifications. The UI uses a consistent dark theme with gradient accents optimized for cryptocurrency content.

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints under `/api` prefix
- **Middleware**: Request logging, JSON parsing, error handling
- **Database Integration**: Drizzle ORM for type-safe database operations
- **Development**: Hot reloading with Vite integration in development mode

The backend implements a layered architecture with separate concerns for routing, data access, and external service integration. Database operations are abstracted through a storage service layer.

### Data Storage
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with schema-first approach
- **Migrations**: Automated database schema management
- **Schema**: Centralized schema definitions in shared directory

Key database entities include users, news articles, sponsored ICOs, banner ads, and payment records. The schema uses UUIDs for primary keys and supports sponsored content with payment tracking.

### Authentication & Authorization
- **Session Management**: Express sessions with PostgreSQL session store
- **User Model**: Basic username/password authentication
- **Database Storage**: User credentials stored in PostgreSQL users table

### External Service Integrations
- **News API**: Integration for fetching cryptocurrency news articles
- **Coinbase Commerce**: Payment processing for sponsorship transactions
- **WebSocket Support**: Neon database with WebSocket connectivity

The architecture supports real-time payment processing and automated content management based on payment status.

## External Dependencies

- **Database**: Neon PostgreSQL serverless database
- **Payment Processing**: Coinbase Commerce API for cryptocurrency payments
- **News Source**: NewsAPI.org for cryptocurrency news aggregation
- **UI Framework**: Radix UI for accessible component primitives
- **Styling**: Tailwind CSS with PostCSS processing
- **Development**: Replit-specific plugins for development environment
