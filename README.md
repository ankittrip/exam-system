# 🎓 Online Examination System Backend

A scalable and secure RESTful backend for an Online Examination Platform built using NestJS, Prisma, and PostgreSQL.

![NestJS](https://img.shields.io/badge/NestJS-v11-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

The Online Examination System Backend is an enterprise-grade REST API designed for educational institutions to manage courses, examinations, question banks, and student assessments. It provides secure authentication, role-based access control, automated evaluation, leaderboard generation, audit logging, and PDF result generation using a modular NestJS architecture.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| NestJS | Backend Framework |
| TypeScript | Programming Language |
| PostgreSQL | Relational Database |
| Prisma ORM | Database ORM |
| JWT + Passport | Authentication |
| Bcrypt | Password Hashing |
| Swagger | API Documentation |
| Docker | Containerization |
| Winston | Logging |
| PDFKit | PDF Result Generation |

---

## Features

### Authentication
- Register
- Login
- Logout
- Change Password
- JWT Authentication
- Single Active Session

### Admin
- Manage Users
- Manage Courses
- Assign Instructor
- View Reports

### Instructor
- Create Courses
- Create Questions
- Create Exams
- Publish Results

### Student
- Attempt Exam
- Auto Submit
- View History
- Download PDF Result

### Examination
- MCQ
- Coding Questions
- Negative Marking
- Random Questions
- Multiple Attempts
- Timer Based Exams
- Leaderboard

---

## Architecture

```
src/
├── common
├── config
├── prisma
├── modules
│   ├── admin
│   ├── audit-logs
│   ├── auth
│   ├── attempts
│   ├── courses
│   ├── exams
│   ├── leaderboard
│   ├── questions
│   ├── results
│   └── users
```

---

## Installation

Clone the repository

```bash
git clone https://github.com/ankittrip/exam-system.git
cd exam-system
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run database migrations

```bash
npx prisma migrate deploy
```

Start the application

```bash
npm run start:dev
```

---

## Environment Variables

```env
APP_NAME=Exam System
APP_VERSION=1.0.0
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/exam_system"
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
```

---

## API Documentation

Swagger UI is available after starting the application.

http://localhost:3000/api/docs

![Swagger UI](docs/swagger.png)

---

## Docker

Build and start containers

```bash
docker compose up --build
```

Run in background

```bash
docker compose up -d
```

Stop containers

```bash
docker compose down
```

View logs

```bash
docker compose logs -f
```

---

## API Modules

| Module          | Status |
|------------------|--------|
| Authentication   | ✅ |
| Courses          | ✅ |
| Questions        | ✅ |
| Exams            | ✅ |
| Attempts         | ✅ |
| Results          | ✅ |
| Leaderboard      | ✅ |
| Admin            | ✅ |
| Audit Logs       | ✅ |

---

## Database Design

ER Diagram

![ER Diagram](docs/er-diagram.png)

---

## Testing

```bash
npm run test
```

Current test coverage includes:
- AuthService
- JWT Authentication
- Password Hashing

---

## Folder Structure

```
exam-system/
│
├── docs/
├── prisma/
├── src/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── .env.example
```

---

## Future Enhancements

- Email Verification
- Refresh Tokens
- Redis Caching
- WebSocket Live Exam Monitoring
- Code Execution Sandbox
- AI Proctoring

---

## License

This project is intended for educational and assessment purposes.

---

## Author

**Ankit Tripathi**

Backend Developer

B.Tech Computer Science & Engineering

Tech Stack

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- Docker
- JWT Authentication