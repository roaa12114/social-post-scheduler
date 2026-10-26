# Post Scheduler API

A backend API for writing social-media posts, saving them as drafts, and scheduling them for automatic publishing. Built with Node.js, Express 5, TypeScript, MongoDB and BullMQ. Includes user and admin roles.

## Features

- Register and login with JWT authentication
- Users create, list, edit, delete and schedule their own posts
- Pagination and status filtering on post lists
- Scheduled posts are published automatically at their scheduled time by a BullMQ job (delayed job, 3 retries with exponential backoff)
- Admin endpoints to manage users and moderate posts
- Request validation with zod and a single, consistent error format
- Security: helmet headers, CORS, and rate limiting on `/auth` (20 requests per 15 minutes per IP)

## Tech stack

Node.js 22, TypeScript, Express 5, MongoDB with Mongoose, BullMQ with Redis (ioredis), zod, bcrypt, jsonwebtoken, helmet, express-rate-limit.

## Prerequisites

- Node.js 22 or newer
- A running MongoDB instance (local or Atlas)
- A Redis instance reachable over TCP (local Redis, or a hosted one such as Upstash)

## Setup

```bash
git clone https://github.com/roaa12114/social-post-scheduler.git
cd social-post-scheduler
npm install
cp .env.example .env     # on Windows: copy .env.example .env
```

Edit `.env` and set your own values:

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on (default 3000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `REDIS_URL` | Redis connection string, e.g. `rediss://default:<password>@<host>:6379` (use `rediss://` for TLS providers such as Upstash) |

If you copy the URL from Upstash, make sure the password is visible (not masked as `****`) before copying. Never commit your `.env` file.

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
| GET | /health | Public | 200 | Health check |
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

Errors always look like `{ "error": { "message": "..." } }`. Status codes used: 400 invalid input, 401 not authenticated, 403 forbidden, 404 not found, 409 conflict, 422 invalid schedule time, 429 too many requests, 503 scheduling service unavailable.

## Post lifecycle

`draft` → `scheduled` → `published` (or `failed`). Only drafts can be scheduled. Published posts cannot be edited, because the post has already gone out and our stored copy would drift from it.

## Project structure

```
src/
  server.ts        start server, connect database, start publish worker
  app.ts           middleware and routes
  config/          Redis connections
  models/          User, Post
  routes/          URL to controller mapping
  validators/      zod schemas
  controllers/     read request, send response
  services/        business logic and database access
  middlewares/     auth, role check, validation, error handling
  queues/          BullMQ queue for publishing jobs
  workers/         BullMQ worker that publishes posts
```

## Design notes

- **Ownership:** posts are always queried with both the post id and the user id, so another user's post returns 404.
- **Auto publishing:** scheduling a post adds a delayed BullMQ job, and a worker publishes the post at its scheduled time. Jobs are idempotent: the job id is fixed per post, and the update only applies to posts still in `scheduled` status. Failed jobs are retried 3 times with exponential backoff before the post is marked `failed`.
- **Queue outage:** if the queue is unavailable, the schedule request returns 503 and the post stays a draft instead of being left half scheduled.
- **Startup safety net:** on startup, overdue scheduled posts are published, so nothing is lost if the server was down at the scheduled time.
- **Deactivated users:** cannot log in, and their existing tokens are rejected because the auth middleware checks the database.

## Future improvements

- Run the publish worker as a separate process so it can scale independently
- Refresh tokens
- Automated tests with Jest and Supertest
