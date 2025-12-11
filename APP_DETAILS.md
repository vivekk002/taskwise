# TaskWise Application Documentation

## 1. Project Overview

TaskWise is a comprehensive task management and productivity application built with Next.js. It combines task tracking, project categorization, and focus sessions (Pomodoro-style) to help users manage their time effectively.

## 2. Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: NextAuth.js v4
- **Styling**: Tailwind CSS
- **State Management**: SWR (Stale-While-Revalidate) & React Context
- **Form Handling**: React Hook Form + Zod
- **Email**: Nodemailer
- **Drag & Drop**: @hello-pangea/dnd
- **Charts**: Recharts

## 3. Database Schema (Prisma Models)

### User

- Core entity.
- Fields: `id`, `email`, `name`,`dateOfBirth`,`gender`,`avatar`, `occupation`, `password`, `emailVerified`, `verificationToken`.
- Relations: `accounts`, `sessions`, `tasks`, `categories`, `focusSessions`.

### Account

- Handles OAuth providers (if integrated).
- Fields: `provider`, `providerAccountId`, `access_token`, `refresh_token`.

### Session

- Manages user sessions.

### VerificationToken

- Used for email verification flows.

### Task

- Main unit of work.
- Fields: `title`, `description`, `priority` (medium default), `deadline`, `completed`, `isDeleted`.
- Metrics: `estimatedDuration`, `actualDuration`.
- Ordering: `order` field for custom sorting.
- Relations: `user`, `category`, `subtasks`, `focusSessions`.

### Subtask

- Granular breakdown of tasks.
- Fields: `title`, `completed`, `order`.

### Category

- User-defined groupings for tasks.
- Fields: `name`, `color`.

### FocusSession

- Tracks time spent on tasks.
- Fields: `duration`, `startedAt`, `endedAt`, `notes`, `completed`.

## 4. API Architecture (`app/api`)

### Authentication (`/api/auth`)

- `[...nextauth]`: Handles NextAuth.js routes (login, logout, session).
- `signup`: User registration logic.
- `verify-email`: Endpoint to validate email verification tokens.
- `resend-verification`: Triggers a new verification email.

### Tasks (`/api/tasks`)

- `GET /`: List tasks (supports filtering).
- `POST /`: Create a new task.
- `[id]`:
  - `PATCH`: Update task details (completion, content).
  - `DELETE`: Soft delete or permanent delete.
- `reorder`: Handles drag-and-drop reordering persistence.

### Subtasks (`/api/subtasks`)

- CRUD operations for subtasks linked to a parent task.

### Categories (`/api/categories`)

- Manage user categories (Create, Read, Update, Delete).

### Focus Sessions (`/api/sessions`)

- Record and retrieve focus session history.

### Dashboard (`/api/dashboard`)

- Aggregates data for the dashboard view (likely stats, upcoming deadlines).

### Analytics (`/api/analytics`)

- Provides data for charts and productivity insights.

### User (`/api/user`)

- User profile management.

## 5. Key Features & Business Logic

### Authentication & Security

- **Credentials Auth**: Email/Password login with bcrypt hashing.
- **Email Verification**: Token-based verification flow using Nodemailer.
- **Protected Routes**: Middleware ensures authenticated access to app features.

### Task Management

- **CRUD**: Full Create, Read, Update, Delete capabilities.
- **Prioritization**: Tasks can be assigned priorities.
- **Scheduling**: Deadlines and estimated durations.
- **Organization**: Tasks belong to Categories and can have Subtasks.
- **Ordering**: Custom drag-and-drop ordering persisted via `order` field.
- **Soft Delete**: Tasks have an `isDeleted` flag, allowing for a "Trash" or "Archive" view before permanent removal.

### Focus Mode

- Integrated timer for tasks.
- Records `FocusSession` entries linked to specific tasks.
- Tracks actual vs. estimated duration.

### Dashboard & Analytics

- **Optimistic Updates**: UI updates immediately while API requests process in background (via `lib/optimistic-updates.ts`).
- **Data Visualization**: Charts showing productivity trends (via Recharts).

## 6. Project Structure (Key Directories)

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components (ignoring visual details).
- `lib/`: Utilities, database clients (`prisma.ts`), and helper functions (`utils.ts`, `auth.ts`).
- `prisma/`: Database schema and seed scripts.
- `types/`: TypeScript type definitions.
- `hooks/`: Custom React hooks.

## 7. Configuration

- **Environment Variables**: Managed via `.env` (DATABASE_URL, NEXTAUTH_SECRET, etc.).
- **Docker**: Includes `Dockerfile` and `docker-compose.yml` for containerization.
