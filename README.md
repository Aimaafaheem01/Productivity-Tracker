# Trackly

A full-stack productivity tracker built to help you manage tasks, build habits, and stay focused — all in one place.

Trackly combines task management, habit tracking with a GitHub-style contribution heatmap, a focus timer, and analytics into a single clean dashboard. Built as a portfolio project to explore real-world full-stack architecture with secure authentication and a feature-sliced frontend structure.

## Features

- **Task Management** — create, update, and organize tasks with a clean list view and stats overview
- **Habit Tracking** — log daily habits and visualize consistency with a GitHub-style contribution heatmap
- **Focus Timer** — a built-in timer to support focused work sessions
- **Analytics** — weekly progress graphs to track productivity trends over time
- **Authentication** — secure signup/login with JWT-based auth and protected routes

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS v4
- React Router

**Backend**
- Node.js / Express
- MongoDB with Mongoose
- JWT Authentication

## Project Structure

```
productivity-tracker/
└── new/
    ├── frontend/          # React + Vite client
    │   └── src/
    │       ├── app/           # App root, global styles
    │       ├── features/      # Feature-sliced modules (auth, tasks, habits, focus, analytics)
    │       ├── pages/         # Route-level pages
    │       ├── shared/        # Shared UI, layout, hooks, utils
    │       └── lib/           # API client
    └── backend/           # Express API server
        └── src/
            ├── config/        # Database connection
            ├── controllers/   # Route logic
            ├── middleware/    # Auth middleware
            ├── models/        # Mongoose schemas (User, Task, Habit)
            └── routes/        # API route definitions
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local instance or MongoDB Atlas)

### Backend Setup

```bash
cd new/backend
npm install
```

Create a `.env` file in `new/backend` using `.env.example` as a reference, and add your own values:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Start the server:

```bash
npm start
```

### Frontend Setup

```bash
cd new/frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

## Roadmap

- [ ] Deploy frontend and backend
- [ ] Add estimation calibration for tasks
- [ ] Add context-switch cost tracking
- [ ] Polish mobile responsiveness

## Author

**Aima Ghouri**
CS Undergraduate, Dawood University of Engineering & Technology (DUET), Karachi