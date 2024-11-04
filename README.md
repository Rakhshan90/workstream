# Work Stream - Project Management Tool

A full-stack project management tool designed for seamless task management and team collaboration. Built using Next.js, Prisma ORM, PostgreSQL, Tailwind CSS, Zod, and Next-Auth, this tool allows managers to create projects, assign tasks, and track progress. Employees can manage tasks through a user-friendly dashboard, while role-based access ensures security and proper workflow.

## Table of Contents
- [Live Link](#live-link)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

## Live Link


```bash
https://workstream.rakhshan.online/
```

## Features
- Role-based access for managers and employees.
- Real-time task assignment and progress tracking.
- Dashboard for managing projects with pending, ongoing, and completed task sections.
- Project timeline and task deadline management.
- Secure authentication and session management using NextAuth.

## Tech Stack
- Language: TypeScript
- Frontend: Next.js, Tailwind CSS, and Shadcn
- Backend: Next.js, Zod, and Server actions
- Database: PostgreSQL, Prisma ORM
- Authentication: NextAuth

## Installation

### 1. Clone the Repository
First, clone this repository to your local machine:

```bash
git clone https://github.com/your-username/your-repo-name.git
```
### 2. Navigate to the Project Directory
Change into the project directory:

```bash
cd your-repo-name
```

### 3. Install Dependencies
Install the required dependencies using pnpm:

```bash
pnpm install
```

### 4. Migrate Schema

```bash
pnpm dlx migrate dev 
```

### 5. Generate Client

```bash
pnpm run db:generate
```

## Environment Variables
Ensure you set up the following environment variables in a .env file of the project:

- DATABASE_URL: URL for your PostgreSQL database
- NEXTAUTH_SECRET: Secret key for NextAuth authentication

## Usage

### 1. Start the Server
You can start the app by running:

```bash
pnpm run web
```


