# 🎓 Kalvi Connect

**Kalvi Connect** is a centralized knowledge-sharing platform exclusively designed for Kalvium students. It serves as a community hub for sharing notes, placement experiences, hackathon opportunities, and career-focused discussions.

## 🏗️ Tech Stack

### Backend
- **Node.js 20+** & **Express.js** (API Layer)
- **Prisma ORM** (Database Management)
- **PostgreSQL** (Neon/Render)
- **JWT** (Authentication)
- **bcryptjs** (Password Hashing)
- **express-validator** (Input Validation)
- **dotenv** & **cors**

### Frontend
- **React 19** + **Vite** (Framework)
- **Tailwind CSS** (Styling)
- **React Router DOM v6** (Routing)
- **Axios** (API Requests)
- **Lucide React** (Icons)
- **React Hook Form** (Form Handling)
- **React Context + useReducer** (Global State)

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL database (or Neon/Render URL)

### 1. Backend Setup
1. Navigate to `backend/`
2. Run `npm install`
3. Create `.env` from `.env.example` and add your `DATABASE_URL` and `JWT_SECRET`.
4. Run `npx prisma generate` to generate the client.
5. Run `npm run dev` to start the development server on port 5000.

### 2. Frontend Setup
1. Navigate to `frontend/`
2. Run `npm install`
3. Create `.env` from `.env.example` with `VITE_API_URL=http://localhost:5000`.
4. Run `npm run dev` to start the Vite dev server.

## 📦 Project Structure

### Backend
- `routes/`: Express route definitions
- `controllers/`: Request handling logic
- `services/`: Business logic and Database interactions
- `middleware/`: Auth and validation middleware
- `prisma/`: Database schema and migrations

### Frontend
- `src/pages/`: Main page components
- `src/components/`: Reusable UI components
- `src/services/`: API service layer
- `src/hooks/`: Custom React hooks
- `src/context/`: Global state management

## 🚫 What's Intentionally Out of Scope
- **Real-time Chat**: Focus is on posts and discussions, not instant messaging (initially).
- **Video Storage**: Hosted on external platforms (YouTube/Vimeo) rather than direct storage.
- **Microservices**: Monolithic architecture for simplicity and speed of deployment.

## 🌐 Deployment
- **Backend**: Configured for **Render**.
- **Frontend**: Configured for **Netlify**.
