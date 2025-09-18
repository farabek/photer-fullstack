# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Ask Mode Guidelines

### Analysis Tools

- Use `read_file` to examine specific code sections
- Use `search_files` to find patterns or implementations
- Use `list_code_definition_names` to understand structure
- Use `list_files` to explore directory organization

### Explanation Focus Areas

- **Architecture**: Explain FSD structure, microservices, CQRS patterns
- **Technology Stack**: Detail Next.js, NestJS, Prisma, Redux Toolkit usage
- **Code Patterns**: Describe custom hooks, error handling, caching strategies
- **Project-Specific Logic**: Explain CUID handling, privacy logic, file validation

### Key Concepts to Explain

- **User Identification**: CUID format vs UUID, flexible lookup (userId, username, profile.id)
- **Privacy Logic**: Authorized users see limited profile details from main page
- **Caching Strategy**: cache > SSR > fallback priority in usePostsList
- **File Upload**: Client validation (20MB, JPEG/PNG), FormData 'files' field
- **Error Handling**: Centralized errorHandler utility usage

### Frontend Architecture

- **FSD Structure**: Features (auth, posts, profile), widgets, shared utilities
- **State Management**: Redux Toolkit with RTK Query
- **SSR Integration**: Server-side rendering with caching
- **Component Organization**: Separation of concerns between layers

### Backend Architecture

- **Microservices**: Gateway and storage services
- **CQRS Pattern**: Command Query Responsibility Segregation
- **DTOs**: Data Transfer Objects for API contracts
- **Authentication**: JWT with guards and bcrypt

### Development Standards

- **Code Style**: SOLID, KISS, DRY principles
- **Testing**: Jest, React Testing Library, Playwright e2e
- **Documentation**: JSDoc comments, changelog, task tracking
- **Linting**: ESLint, Prettier, lint-staged hooks

### Common Questions

- How does user identification work across the system?
- What are the privacy implications for profile viewing?
- How is caching handled between SSR and client-side?
- What validation is applied to file uploads?
- How are errors handled consistently?

### Documentation References

- `/docs/Project.md`: Overall project architecture and goals
- `/docs/codestyle.md`: Code style and development process
- `/docs/tasktracker.md`: Current task status and progress
- `/docs/Diary.md`: Technical decisions and observations
- `/docs/qa.md`: Known questions and architectural considerations

### Best Practices

- Explain complex logic with code examples
- Reference specific files and line numbers when possible
- Highlight project-specific patterns and why they're used
- Suggest improvements based on established patterns
- Document findings in appropriate docs files
