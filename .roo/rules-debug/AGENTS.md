# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Debug Mode Guidelines

### Debugging Priorities

- Use `read_file` to examine code and understand context
- Use `search_files` to find patterns, TODO comments, or specific implementations
- Use `list_code_definition_names` to understand codebase structure
- Use `execute_command` to run tests, check logs, or reproduce issues

### Common Issues to Check

- **User ID Format**: Verify CUID vs UUID handling in user identification
- **Cache Issues**: Check if empty cache overwrites SSR data in usePostsList
- **File Upload**: Verify FormData uses 'files' field, not 'photos'
- **Privacy Logic**: Ensure Authorization header sent only for profile owners
- **Error Handling**: Check if errorHandler is used instead of console.error

### Logging Strategy

- Use debug logs in frontend components for data flow tracking
- Add detailed logs in backend services for user lookup processes
- Use errorHandler for consistent error processing
- Check SSR vs cache data priority in usePostsList hook

### Testing for Issues

- Run unit tests to isolate component problems
- Use e2e tests to reproduce user flow issues
- Check API endpoints with different user scenarios
- Verify authentication guards and DTOs

### Performance Debugging

- Check image optimization and lazy loading
- Verify caching strategy (cache > SSR > fallback)
- Monitor API response times
- Check database query performance

### Authentication Debugging

- Verify JWT token handling and refresh mechanism
- Check OAuth integration flows
- Test cookie-based session management
- Validate guard implementations

### Database Debugging

- Check Prisma schema for correct relationships
- Verify migration handling
- Test query performance with indexes
- Validate data integrity constraints

### Frontend Debugging

- Check Redux Toolkit state management
- Verify RTK Query cache behavior
- Test component re-rendering issues
- Validate form validation logic

### Backend Debugging

- Check NestJS module dependencies
- Verify microservice communication
- Test CQRS pattern implementation
- Validate DTO transformations

### Documentation for Debugging

- Update `/docs/Diary.md` with debugging findings
- Document root causes and solutions
- Update `/docs/tasktracker.md` for bug fixes
- Add debug procedures to `/docs/Project.md`
