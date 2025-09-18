# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Code Mode Guidelines

### File Editing Priorities

- Use `apply_diff` for targeted changes to existing files
- Use `write_to_file` only for creating new files or complete rewrites
- Use `insert_content` for adding lines without modifying existing content
- Use `search_and_replace` for pattern-based replacements

### Code Style Compliance

- Follow SOLID, KISS, DRY principles
- Use ESLint and Prettier configurations
- Add JSDoc comments for new files:

```ts
/**
 * @file [filename]
 * @description [brief description]
 * @dependencies [related components/files]
 * @created [date]
 */
```

### Project-Specific Patterns

- **User ID Handling**: Always use CUID format, avoid UUID assumptions
- **File Upload**: Use 'files' field in FormData, validate max 20MB, JPEG/PNG only
- **Error Handling**: Use centralized errorHandler instead of console.error
- **Caching Logic**: Maintain cache > SSR > fallback priority in usePostsList
- **Privacy Logic**: Conditionally send Authorization header based on profile ownership

### Frontend Patterns (FSD)

- Organize code by features (auth, posts, profile)
- Use custom hooks for business logic
- Maintain separation between widgets, shared utilities, and entities
- Follow Redux Toolkit patterns for state management

### Backend Patterns (NestJS)

- Use CQRS pattern in modules
- Implement DTOs for API contracts
- Apply guards for protected endpoints
- Handle microservices communication properly

### Documentation Requirements

- Update `/docs/changelog.md` for all changes
- Update `/docs/tasktracker.md` for task progress
- Update `/docs/Diary.md` for technical decisions
- Update `/docs/Project.md` for architectural changes

### Testing Standards

- Write unit tests for components and utilities
- Use React Testing Library for component testing
- Focus on critical paths and error scenarios
- Run lint-staged hooks before commits

### Common Pitfalls

- Avoid overwriting SSR data with empty cache
- Use correct FormData field names ('files' not 'photos')
- Handle CUID vs UUID differences properly
- Maintain privacy logic for profile views
