# 🎓 Online Examination System - Backend API

A robust, highly scalable, and secure backend system for an Online Examination Platform. Built with **NestJS**, **Prisma**, and **PostgreSQL**, this platform allows administrators to manage the system, instructors to create timed assessments, and students to take exams with auto-evaluation and instant PDF scorecards.

---

## 🚀 Tech Stack

- **Framework:** NestJS (Node.js/TypeScript)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens) with Passport.js & Bcrypt
- **API Documentation:** Swagger / OpenAPI
- **Logging:** Winston Logger (Console & File based)
- **Containerization:** Docker & Docker Compose
- **File Generation:** PDFKit (For Scorecards)

---

## ✨ Key Features

### 🔐 Security & Core
- **JWT Authentication:** Secure login, registration, and password management.
- **Role-Based Access Control (RBAC):** Distinct route guards for `ADMIN`, `INSTRUCTOR`, and `STUDENT`.
- **Single Active Session:** Prevents multiple concurrent logins to stop session hijacking.
- **Global Error Handling:** Custom exception filters and class-validator pipes.
- **Audit Logs:** Tracks critical system activities (Accessible by Admin).

### 👨‍💼 Admin Module
- Dashboard with platform statistics (Total Users, Exams, Attempts).
- Manage user statuses (Ban/Unban users).
- Assign Instructors securely.

### 👨‍🏫 Instructor Module
- Create and manage Courses.
- Create Question Banks with varied types: **MCQs** and **Coding Questions**.
- Configure Exams: Set duration, passing marks, max attempts, and negative marking.
- Assign questions dynamically to exams.

### 👨‍🎓 Student Module
- View available published exams.
- **Timer-based Execution:** Server-side timestamp tracking prevents client-side timer manipulation.
- Auto-evaluation of answers immediately upon submission.
- **Exam History:** View detailed history of all past attempts.
- **Download Scorecard:** Generate and download official Result PDFs instantly.

### 🏆 Analytics & Leaderboard
- Real-time **Leaderboard** generation for top scorers per exam.

---

## 📂 Project Architecture

The project follows a highly modular, domain-driven architecture:

```text
src/
├── common/          # Global guards, decorators, filters, interceptors, logger
├── config/          # Environment & App configurations
├── prisma/          # Database connection service
└── modules/
    ├── admin/       # Dashboard & User management
    ├── audit-logs/  # Action tracking
    ├── auth/        # Login, Register, Session management
    ├── courses/     # Subject/Course management
    ├── exams/       # Exam setup and rules
    ├── questions/   # Question bank (MCQ/Coding)
    ├── attempts/    # Exam execution & auto-evaluation engine
    ├── results/     # Detailed scorecards & PDF generation
    └── leaderboard/ # Ranking system
```

---

## ⚙️ Local Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (Local or Cloud)
- Docker & Docker Compose (Recommended)

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd exam-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/exam_db?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-key"
JWT_EXPIRATION="1d"

# Server Configuration
PORT=3000
```

### 4. Run Database using Docker (Recommended)
```bash
docker-compose up -d
```

### 5. Database Setup (Prisma)
Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

### 6. Start the Application
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

---

## 📖 API Documentation & Testing

### Swagger UI
Once the server is running, explore and test all API endpoints via the built-in Swagger UI:

👉 URL: `http://localhost:3000/api/docs`

### Postman Collection
A complete Postman collection is available in the repository (`exam-system.postman_collection.json`). Import it into Postman to test all workflows.

### Unit Testing
Run the basic unit tests using Jest:

```bash
npm run test
```

---

## 📜 Logging

The application uses Winston Logger. Logs are formatted in the terminal and automatically saved to:

- `logs/error.log` — For exceptions and errors
- `logs/combined.log` — For all activities