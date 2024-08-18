# Student Forum API

## Project Overview

The **Student Forum API** project is structured with two main components: `client` and `server`. The `client` folder contains a React.js application that serves as the frontend, while the `server` folder includes the backend setup.

- **Client**: A React.js application for the user interface.
- **Server**: An Express.js API coupled with a PostgreSQL database managed by Knex.js, all orchestrated using Docker. The server folder supports integration, unit, and end-to-end testing, and includes a CI/CD pipeline for automated testing and deployment.

This project is designed to facilitate comprehensive testing and deployment processes as part of its development and is currently being prepared for further features and enhancements.

## Getting Started

To set up and run the project, follow these instructions:

1. **Set Up Environment Variables**:

   - Duplicate the `.env.template` file and rename it to `.env` within the `./server` directory of the project.

2. **Build and Launch the Project**:

   - Open a terminal and navigate to the `server` folder. Run Docker Compose to build and start the backend server and database:
     ```bash
     docker-compose up --build
     ```

3. **Run the React Client**:
   - Open a new terminal and navigate to the `client` folder. Start the React development server by running:
     ```bash
     npm run start
     ```

## API Endpoints

### User Endpoints

| **Method** | **Path**             | **Description**                                   |
| ---------- | -------------------- | ------------------------------------------------- |
| POST       | `/api/users`         | Registers a new user.                             |
| POST       | `/api/users/login`   | Authenticates a user and returns a session token. |
| GET        | `/api/users/:userId` | Fetches details of a user by their ID.            |
| GET        | `/api/users`         | Retrieves a list of all users.                    |
| PUT        | `/api/users/:userId` | Updates details of a user by their ID.            |
| DELETE     | `/api/users/:userId` | Deletes a user by their ID.                       |

### Thread Endpoints

| **Method** | **Path**                 | **Description**                        |
| ---------- | ------------------------ | -------------------------------------- |
| POST       | `/api/threads`           | Creates a new thread.                  |
| GET        | `/api/threads/:threadId` | Fetches details of a thread by its ID. |
| GET        | `/api/threads`           | Retrieves a list of all threads.       |
| PUT        | `/api/threads/:threadId` | Updates details of a thread by its ID. |
| DELETE     | `/api/threads/:threadId` | Deletes a thread by its ID.            |

### Reply Endpoints

| **Method** | **Path**                        | **Description**                              |
| ---------- | ------------------------------- | -------------------------------------------- |
| POST       | `/api/replies`                  | Posts a new reply to a thread.               |
| GET        | `/api/replies/:replyId`         | Fetches details of a reply by its ID.        |
| GET        | `/api/replies/thread/:threadId` | Retrieves all replies for a specific thread. |
| GET        | `/api/replies`                  | Retrieves a list of all replies.             |
| PUT        | `/api/replies/:replyId`         | Updates details of a reply by its ID.        |
| PUT        | `/api/replies/:replyId`         | Updates the status of a reply.               |
| DELETE     | `/api/replies/:replyId`         | Deletes a reply by its ID.                   |

## Current Status

The project is fully operational and the first version (1.0.0) is now usable. The Student Forum is fully functional, with all core features implemented and working as intended.

## Support and Inquiries

For any questions or support, please open an issue or a support ticket in the repository.

## License

This project is distributed under the [MIT License](LICENSE).
