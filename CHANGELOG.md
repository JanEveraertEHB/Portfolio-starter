# Changelog

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

## [1.0.0] - 2024-08-17

### Added

- Added integration tests for "threads" routes and refactored route handlers.
- Added integration tests for "replies" routes and refactored route handlers.
- Introduced the Login, Register, and Homepage to the frontend, providing essential user interaction and navigation features.
- Completed the integration of backend logic into the frontend, linking all API routes with the frontend UI.
- Enhanced frontend UI with user features, including:
  - Post creation.
  - Display threads and replies.
- Added comprehensive admin logic to manage users, including:
  - Admin user management interface.
  - User deletion functionality.
  - Admin-specific modals and alerts.
  - Display and interaction with threads and replies.

### Changes

- Added new backend API routes for:
  - Getting all users.
  - Getting all threads.
  - Getting all replies.
  - Getting replies based on thread ID and user ID.
- Refactored backend API routes for better functionality and efficiency.

## [0.1.0] - 2024-08-16

### Added

- Established the foundation for the Express application.
- Introduced Docker support with essential files: `Dockerfile`, `docker-compose.yml`, and `.dockerignore`.
- Integrated Docker to include a `PostgreSQL` service with environment variables for database configuration.
- Initialized a React project as the frontend foundation.
- Established the foundation for Test-Driven Development (TDD) with unit and integration tests for both API and frontend.
- Integrated Knex.js and created initial migrations and seeds.
- Added unit tests, user integration tests, and database setup.

### Changed

- Reorganized the project directory structure for improved organization and maintenance.
- Updated the directory structure for better clarity and manageability.
- Updated CI/CD pipeline configuration for Docker and deployment.
- Simplified Docker Compose commands with the correct working directory and Docker login action versions.

### Fixed

- Updated Docker login action versions and used existing secrets in CI/CD.
- Fixed CI/CD workflow to use the correct Docker Compose path and ensure successful builds.
