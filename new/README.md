# Productivity Tracker

Monorepo containing the frontend (React + Vite + Tailwind) and backend (Express + MongoDB).

## Structure

```
productivity-tracker/
├── frontend/          React app
│   └── src/
│       ├── app/        App shell, routing
│       ├── pages/      Route-level wrappers (thin)
│       ├── features/   tasks, habits, focus, analytics, auth
│       ├── shared/     ui, layout, hooks, utils used across features
│       └── lib/        axios instance, query client (added in step 4)
└── backend/           Express API
    └── src/
        ├── config/      db connection
        ├── models/      User, Task, Habit
        ├── routes/      added in step 2
        ├── controllers/ added in step 2
        └── middleware/  added in step 3 (auth)
```

## Running locally

Frontend:
```
cd frontend
npm install
npm run dev
```

Backend:
```
cd backend
npm install
cp .env.example .env   # then fill in real values
npm run dev
```

## Status

Step 1 complete: folder structure reorganized, MUI removed (Tailwind only),
backend Mongo connection bug fixed, User/Task/Habit models scaffolded.
No new features yet — routes/auth/state migration come in steps 2-4.
