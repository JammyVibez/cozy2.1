# Munia - Advanced Social Media Platform

## Overview

Munia is a comprehensive, feature-rich social media platform built with Next.js 14. Originally a basic social media app, it has been transformed into a modern community-focused platform with enterprise-level capabilities including real-time interactions, creator tools, advanced privacy controls, PWA support, and extensive media handling. The platform now rivals major social media networks in functionality while maintaining a community-first approach.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 14 with App Router for server-side rendering and static generation
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state and caching, React Context for global UI state
- **UI Components**: Custom component library built with React Aria for accessibility
- **Animations**: Framer Motion for transitions and micro-interactions
- **Form Handling**: React Hook Form with Zod validation schemas
- **Media Handling**: Swiper.js for image/video carousels with zoom and navigation

### Backend Architecture
- **Framework**: Next.js API routes with server actions and middleware
- **Database**: Prisma ORM with relational data modeling
- **Authentication**: NextAuth.js v5 with multiple providers (OAuth + email)
- **File Processing**: Custom upload handling with drag-and-drop sorting via DnD Kit
- **Real-time Features**: Activity logging system with notification management
- **Data Fetching**: Infinite scrolling with bidirectional pagination and cursor-based queries

### Key Design Patterns
- **Separation of Concerns**: Split authentication config for Edge runtime compatibility
- **Context Pattern**: Multiple specialized contexts (Theme, Toast, Dialogs, Modals) with memoized APIs
- **Compound Components**: Modal system with overlay triggers and state management
- **Custom Hooks**: Centralized business logic for mutations, queries, and UI interactions
- **Server Components**: Leveraging Next.js 14 server components for initial data loading and SEO

### Data Architecture
- **Prisma Schema**: Relational model with Users, Posts, Comments, Likes, Follows, Activities
- **Query Optimization**: Strategic use of select queries and join operations
- **Caching Strategy**: React Query with stale-while-revalidate and optimistic updates
- **Infinite Queries**: Cursor-based pagination with offset fallback for reliability

### UI/UX Architecture
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Accessibility**: React Aria integration for WCAG compliance
- **Theme System**: CSS custom properties with dark/light mode support
- **Component Library**: Reusable components with variant-based styling using CVA
- **Toast System**: Global notification management with queue handling

## External Dependencies

### Cloud Services
- **Cloudinary**: Advanced media processing, storage, and CDN with automatic optimization for images, videos, GIFs, and audio files
- **Pusher**: Real-time communication infrastructure for live notifications, typing indicators, and instant updates
- **PostgreSQL**: Robust relational database with complex relationship modeling

### Authentication & Real-time
- **NextAuth.js**: GitHub, Google, Facebook OAuth providers plus email-based authentication  
- **Session Management**: JWT tokens with Prisma adapter for database sessions
- **Real-time Features**: Live notifications, typing indicators, instant reactions, and live chat capabilities

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESLint + Prettier**: Code formatting with Airbnb configuration
- **Tailwind CSS**: Utility-first styling with custom design system extensions

### Advanced Features Added (August 2025)
- **Real-time Communication**: Live notifications, typing indicators, instant reactions using Pusher
- **Enhanced Media Support**: Videos, GIFs, audio files, image carousels with zoom and navigation
- **Social Features**: Story posts (24hr expiring), emoji reactions (6 types), polls with customizable options
- **Discovery System**: Trending content, user recommendations, hashtag analytics, explore page
- **Creator Tools**: Analytics dashboard with charts, post scheduling, verified accounts system
- **Privacy & Security**: Advanced privacy controls, content moderation, two-factor authentication
- **Accessibility**: Dynamic dark/light themes, keyboard navigation, screen reader support
- **PWA Capabilities**: Offline support, push notifications, app installation prompts
- **Performance**: Infinite scrolling, optimistic updates, caching strategies

### Third-party Libraries
- **Analytics & Charts**: Chart.js and React Chart.js 2 for creator dashboard analytics
- **Real-time**: Pusher client for live features and instant communication
- **Media Processing**: Cloudinary for advanced image/video processing and CDN
- **Date Handling**: date-fns for date formatting and manipulation
- **Content Processing**: DOMPurify for content sanitization, HTML React Parser for rich content
- **Drag and Drop**: DnD Kit for sortable media uploads and interactive interfaces
- **Utility Libraries**: Lodash for data manipulation, clsx for conditional class names