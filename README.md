# Post Scheduler API

A backend API for writing social-media posts, saving them as drafts, and scheduling them for automatic publishing. Built with Node.js, Express 5, TypeScript and MongoDB. Includes user and admin roles.

## Features

- Register and login with JWT authentication
- Users create, list, edit, delete and schedule their own posts
- Pagination and status filtering on post lists
- Scheduled posts are published automatically when their time comes
- Admin endpoints to manage users and moderate posts
- Request validation with zod and a single, consistent error format

## Tech stack

Node.js 22, TypeScript, Express 5, MongoDB with Mongoose, zod, bcrypt, jsonwebtoken, pino.

## Prerequisites

- Node.js 22 or newer
- A running MongoDB instance (local or Atlas)

## Setup

```bash
git clone <repository-url>
cd node-js-assesment
npm install
cp .env.example .env     # on Windows: copy .env.example .env
```

Edit `.env` and set your own values:

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on (default 3000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |

## Run

```bash
npm run dev      # development with auto-restart
npm run build    # compile TypeScript to dist/
npm start        # run the compiled server
```

When the server starts you should see `Connected to MongoDB` and `Server is running on port 3000`.

## Creating an admin

Public registration always creates a normal `user`. To create an admin, register an account and change its `role` field to `admin` directly in the database (for example with MongoDB Compass), then log in again to get a new token.

## API overview

Protected routes need the header `Authorization: Bearer <token>`.

| Method | Path | Access | Success | Description |
| --- | --- | --- | --- | --- |
| POST | /auth/register | Public | 201 | Create an account |
| POST | /auth/login | Public | 200 | Get a JWT token |
| GET | /auth/me | User | 200 | Current user |
| POST | /posts | User | 201 | Create a draft post |
| GET | /posts | User | 200 | List own posts (`status`, `page`, `limit`) |
| GET | /posts/:id | Owner | 200 | Get one post |
| PATCH | /posts/:id | Owner | 200 | Edit content (not allowed when published) |
| DELETE | /posts/:id | Owner | 204 | Delete a post |
| POST | /posts/:id/schedule | Owner | 200 | Schedule a draft (`scheduledAt` in the future) |
| GET | /admin/users | Admin | 200 | List users |
| PATCH | /admin/users/:id/status | Admin | 200 | Activate or deactivate a user |
| GET | /admin/posts | Admin | 200 | List all posts |
| DELETE | /admin/posts/:id | Admin | 204 | Delete any post |

Errors always look like `{ "error": { "message": "..." } }`. Status codes used: 400 invalid input, 401 not authenticated, 403 forbidden, 404 not found, 409 conflict, 422 invalid schedule time.

## Post lifecycle

`draft` → `scheduled` → `published` (or `failed`). Only drafts can be scheduled. Published posts cannot be edited, because the post has already gone out and our stored copy would drift from it.

## Project structure

```
src/
  server.ts        start server, connect database, start publisher
  app.ts           middleware and routes
  models/          User, Post
  routes/          URL to controller mapping
  validators/      zod schemas
  controllers/     read request, send response
  services/        business logic and database access
  middlewares/     auth, role check, validation, error handling
```

## Design notes

- **Ownership:** posts are always queried with both the post id and the user id, so another user's post returns 404.
- **Auto publishing:** a job runs every 30 seconds and publishes due posts with a single `updateMany`, which is safe to run twice.
- **Deactivated users:** cannot log in, and their existing tokens are rejected because the auth middleware checks the database.

## Future improvements

- Move publishing to a BullMQ queue with Redis and a separate worker, with retries and backoff
- Refresh tokens
- Automated tests with Jest and Supertest
