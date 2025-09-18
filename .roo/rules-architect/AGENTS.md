# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Architect Mode Guidelines

### Strategic Planning

- Use `list_files` to understand current project structure
- Use `read_file` to analyze existing architecture documents
- Use `search_files` to identify architectural patterns
- Use `list_code_definition_names` to understand system organization

### Architecture Analysis

- **Frontend Architecture**: Evaluate FSD structure effectiveness
- **Backend Architecture**: Assess microservices and CQRS implementation
- **Database Design**: Review Prisma schema and relationships
- **State Management**: Analyze Redux Toolkit and RTK Query usage

### Technology Stack Evaluation

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Redux Toolkit
- **Backend**: NestJS, Prisma, PostgreSQL, JWT authentication
- **Testing**: Jest, React Testing Library, Playwright
- **Infrastructure**: Docker, Docker Compose, Jenkins CI/CD

### Key Architectural Decisions

- **User ID Strategy**: CUID format for scalability and privacy
- **Privacy Model**: Limited profile details for non-owners
- **Caching Strategy**: Hierarchical cache > SSR > fallback
- **File Handling**: Client validation with server-side processing
- **Error Management**: Centralized errorHandler utility

### Scalability Considerations

- **Microservices**: Gateway and storage service separation
- **Database**: PostgreSQL with Prisma ORM optimization
- **Caching**: RTK Query for frontend, potential Redis for backend
- **File Storage**: S3-compatible storage for media files

### Security Architecture

- **Authentication**: JWT with refresh tokens and bcrypt
- **Authorization**: Guards for protected endpoints
- **Data Privacy**: Profile privacy logic implementation
- **Input Validation**: DTOs and client-side validation

### Performance Optimization

- **Frontend**: SSR, lazy loading, image optimization
- **Backend**: CQRS for read/write separation
- **Database**: Indexing strategy and query optimization
- **Caching**: Multi-level caching strategy

### Development Workflow

- **Code Style**: SOLID, KISS, DRY principles
- **Testing Strategy**: Unit, integration, e2e coverage
- **Documentation**: Comprehensive docs in /docs/ directory
- **CI/CD**: Jenkins pipeline with automated testing

### Future Architecture Planning

- **Feature Roadmap**: Based on current tasktracker and qa.md
- **Technology Upgrades**: Next.js, NestJS, database evolution
- **Infrastructure Scaling**: Container orchestration, monitoring
- **Performance Monitoring**: APM tools integration

### Documentation Updates

- Update `/docs/Project.md` for architectural changes
- Document new patterns in `/docs/Diary.md`
- Plan features in `/docs/tasktracker.md`
- Address questions in `/docs/qa.md`

### Architectural Patterns to Consider

- **CQRS**: Command Query Responsibility Segregation
- **Event Sourcing**: For audit trails and complex workflows
- **Saga Pattern**: For distributed transactions
- **API Gateway**: For microservices communication
- **Circuit Breaker**: For resilient service communication

### Risk Assessment

- **Technical Debt**: Identify areas needing refactoring
- **Scalability Limits**: Current architecture constraints
- **Security Vulnerabilities**: Authentication and data protection
- **Performance Bottlenecks**: Database queries, file handling

### Recommendations Framework

- **Immediate Actions**: Critical fixes and improvements
- **Short-term Goals**: Next sprint planning
- **Long-term Vision**: Architecture evolution roadmap
- **Technology Choices**: Justification for new tools/frameworks
