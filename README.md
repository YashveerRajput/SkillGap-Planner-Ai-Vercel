# SkillGap Planner AI

SkillGap Planner AI is a full-stack web application that helps users assess interview readiness, identify skill gaps, and generate AI-assisted interview reports and resume outputs.

## Live Demo

- Vercel Demo: https://skill-gap-planner-ai-vercel-rphr.vercel.app/

## Project Structure

- Backend: Node.js + Express API in Backend/
- Frontend: React + Vite app in Frontend/

## Core Features

- User authentication (register/login/logout)
- Protected user flows with token/cookie-based auth
- AI-powered interview report generation
- Interview history and report retrieval
- Resume PDF generation

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Sass
- Axios

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- Google GenAI integration
- Puppeteer / puppeteer-core for PDF generation

## Local Development Setup

## 1. Clone Repository

```bash
git clone <your-repo-url>
cd SkillGap-Planner-Ai
```

## 2. Backend Setup

```bash
cd Backend
npm install
```

Create a .env file in Backend/ with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_genai_api_key
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

## 3. Frontend Setup

```bash
cd ../Frontend
npm install
```

Create a .env file in Frontend/ with:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Run frontend:

```bash
npm run dev
```

## 4. Open App

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Deployment

Deployment notes and Vercel setup details are available in README_DEPLOY.md.

## Author

- Yashveer Singh Rajput
