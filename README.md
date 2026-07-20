# SmartKhamar AI — Server

REST API backend for SmartKhamar AI farm management platform built with Express, TypeScript, and MongoDB.

## Features

- **Auth** — Email/password register & login, Google OAuth, JWT access + refresh tokens
- **Animal CRUD** — Create, read, update, delete for Cow, Goat, Hen, Duck
- **Daily Logs** — Feed, weight, milk, eggs tracking per animal
- **Vaccine Alerts** — Medicine tracking with overdue/upcoming alerts
- **Weight Scheduling** — Automated weight tracking reminders
- **Calving/Pregnancy** — Track pregnancies and calving history
- **ROI & Valuation** — Asset value calculation, income/expense tracking
- **AI Chat** — Groq-powered Llama 3.3 70B chatbot for farm advice
- **AI Content** — Auto-generate animal descriptions
- **Admin** — User management (Admin/Staff roles)
- **Public API** — Browse animals without auth (type-filtered)

## Tech Stack

| Technology | Version |
|------------|---------|
| Node.js | 18+ |
| Express | 4.21 |
| TypeScript | 5.7 |
| MongoDB/Mongoose | 8.9 |
| bcrypt | 6.0 |
| jsonwebtoken | 9.0 |
| google-auth-library | 10.9 |
| Groq API | Llama 3.3 70B |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- MongoDB Atlas (or local MongoDB)

### Setup

```bash
# Install dependencies
pnpm install

# Create .env
cp .env.example .env
```

### Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/fram_db?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
CLIENT_URL=http://localhost:3000,https://your-vercel-app.vercel.app
NODE_ENV=development
GROQ_API_KEY=gsk_your-groq-api-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Development

```bash
pnpm dev
```

API runs at [http://localhost:5000](http://localhost:5000)

### Production Build

```bash
pnpm build
pnpm start
```

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout (clear cookie) |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Animals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/animals` | List all animals |
| GET | `/api/animals/:id` | Get animal detail |
| POST | `/api/animals` | Create animal |
| PUT | `/api/animals/:id` | Update animal |
| DELETE | `/api/animals/:id` | Delete animal |

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public` | Browse animals (type=Cow/Goat/Hen/Duck) |
| GET | `/api/public/breeds` | Get breeds by type |
| GET | `/api/public/:id` | Animal detail |

### Daily Logs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/daily-logs` | List logs (filter by animalId, date) |
| POST | `/api/daily-logs` | Create daily log |

### AI

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Chat with AI assistant |
| POST | `/api/ai/generate-description` | Generate animal description |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vaccine-alerts` | Get vaccine alerts |
| GET | `/api/weight-schedule` | Get weight schedule alerts |
| GET | `/api/calving` | Get calving history |
| POST | `/api/calving` | Add calving record |
| GET | `/api/roi` | Get ROI data |
| GET | `/api/valuation` | Get asset valuation |
| GET | `/api/admin/users` | List all users (Admin) |
| PUT | `/api/admin/users/:id` | Update user (Admin) |
| DELETE | `/api/admin/users/:id` | Delete user (Admin) |

## Project Structure

```
server/
├── src/
│   ├── controllers/
│   │   ├── authController.ts      # Auth & profile
│   │   ├── animalController.ts    # Animal CRUD
│   │   ├── dailyLogController.ts  # Daily logs
│   │   ├── vaccineAlertController.ts
│   │   ├── weightScheduleController.ts
│   │   ├── calvingController.ts
│   │   ├── roiController.ts
│   │   ├── adminController.ts
│   │   └── ai/
│   │       └── aiController.ts    # Groq AI chat
│   ├── models/
│   │   ├── User.ts
│   │   ├── Animal.ts
│   │   ├── DailyLog.ts
│   │   ├── MedicalLog.ts
│   │   ├── Expense.ts
│   │   └── PregnancyHistory.ts
│   ├── routes/
│   ├── middleware/
│   │   └── authMiddleware.ts      # JWT verification
│   ├── utils/
│   │   └── generateTokens.ts
│   └── index.ts                   # Entry point
├── seed-data/                     # JSON seed files (cows, goats, hens, ducks)
├── tsconfig.json
├── package.json
└── .env
```

## RBAC

| Role | Access |
|------|--------|
| Admin | Everything (all animals, valuation, user management) |
| Staff | Dashboard, daily logs, animal registration only |

## Deployment

- **Render** — Auto-deploy from GitHub
- Set environment variables in Render dashboard

## License

Private — SmartKhamar AI
