# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Overview

Photer is a full-featured photo-sharing social network built with modern web technologies. The project consists of a Next.js frontend and NestJS backend, enabling users to create accounts, publish posts, interact with content, and manage profiles.

## Technology Stack

### Frontend (photer-app-dev)

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit with RTK Query
- **Architecture**: Feature-Sliced Design (FSD)
- **Testing**: Jest, React Testing Library, Playwright (e2e)

### Backend (photer-api-dev)

- **Framework**: NestJS with microservices architecture
- **ORM**: Prisma with PostgreSQL
- **Authentication**: JWT with bcrypt
- **File Storage**: Local/cloud storage (S3-compatible)
- **Containerization**: Docker, Docker Compose

## Key Architectural Patterns

### Frontend Patterns

- **FSD Structure**: Organized by features (auth, posts, profile), widgets, shared utilities
- **Custom Hooks**: Business logic encapsulated in reusable hooks
- **SSR with Caching**: Server-side rendering with RTK Query cache management
- **Error Handling**: Centralized errorHandler utility for consistent error processing

### Backend Patterns

- **CQRS**: Command Query Responsibility Segregation in NestJS modules
- **DTOs**: Data Transfer Objects for API contracts
- **Guards**: Authentication guards for protected endpoints
- **Microservices**: Separated gateway and storage services

## Project-Specific Details

### User Identification

- User IDs use CUID format (not UUID)
- Profile lookup supports multiple identifier types: userId (CUID), username, profile.id
- API endpoints handle flexible user identification without regex validation

### Privacy Logic

- Authorized users viewing other profiles from main page see limited details (like unauthorized users)
- Authorization header only sent when user is profile owner
- Maintains profile privacy while allowing social interactions

### File Upload Validation

- Client-side validation: max 20MB, JPEG/PNG only
- FormData field name: 'files' (not 'photos')
- Server-side processing converts relative paths to full URLs

### Caching Strategy

- usePostsList hook prioritizes: cache > SSR > fallback
- Prevents empty cache from overwriting SSR data
- Debug logs for data flow tracking

### Authentication Flow

- JWT tokens with refresh mechanism
- OAuth integration support
- Cookie-based session management

## Development Standards

### Code Style

- **Principles**: SOLID, KISS, DRY
- **Linting**: ESLint with custom config
- **Formatting**: Prettier
- **Hooks**: lint-staged for pre-commit checks
- **Documentation**: JSDoc comments for new files

### File Organization

- Frontend: FSD structure with clear separation of concerns
- Backend: Modular structure with controllers, services, DTOs
- Shared utilities in dedicated directories

### Testing Strategy

- Unit tests for components and utilities
- Integration tests for API endpoints
- E2e tests for critical user flows
- Focus on critical paths and error scenarios

## Deployment & Infrastructure

### Containerization

- Docker for both frontend and backend
- Docker Compose for local development
- Multi-stage builds for optimization

### CI/CD

- Jenkins pipeline for automated testing and deployment
- nginx for production serving
- Environment-specific configurations

## Common Pitfalls to Avoid

1. **User ID Format**: Always handle CUID format, avoid UUID assumptions
2. **Cache Overwriting**: Respect SSR data priority in caching logic
3. **File Field Names**: Use 'files' in FormData, not 'photos'
4. **Privacy Headers**: Conditionally send auth headers based on ownership
5. **Error Logging**: Use errorHandler instead of console.error for consistency

## Documentation Requirements

- Update `/docs/changelog.md` for all changes
- Update `/docs/tasktracker.md` for task progress
- Update `/docs/Diary.md` for technical decisions and observations
- Update `/docs/Project.md` for architectural changes
- Follow code style guidelines in `/docs/codestyle.md`
