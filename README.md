# Photer - Fullstack Photo Application

A modern fullstack application for photo management, built with Next.js frontend and NestJS backend.

## 🏗️ Architecture

This project consists of two main applications:

- **Frontend** (`photer-app-dev/`) - Next.js application with TypeScript
- **Backend** (`photer-api-dev/`) - NestJS API with Prisma ORM

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm
- Git

### Frontend Setup

```bash
cd photer-app-dev
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd photer-api-dev
npm install
npm run start:dev
```

The API will be available at `http://localhost:3001`

## 🛠️ Tech Stack

### Frontend

- Next.js 14
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React

### Backend

- NestJS
- Prisma ORM
- PostgreSQL (production)
- JWT Authentication
- OAuth (Google, GitHub)

## 📁 Project Structure

```text
photer-fullstack/
├── photer-app-dev/          # Next.js frontend
│   ├── src/
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   ├── store/          # Redux store
│   │   └── types/          # TypeScript types
│   └── package.json
├── photer-api-dev/          # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── photos/         # Photos management
│   │   ├── users/          # User management
│   │   └── storage/        # File storage
│   ├── prisma/             # Database schema & migrations
│   └── package.json
└── README.md
```

## 🔐 Environment Variables

Create `.env` files in both frontend and backend directories:

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)

```env
DATABASE_URL="postgresql://photer_user:photer_password@localhost:5432/photer_dev?schema=public"
JWT_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## 🗄️ Database

The application uses PostgreSQL for production with Prisma ORM. For development setup, see the detailed instructions in `photer-api-dev/SETUP-POSTGRES.md`.

Run database operations with:

```bash
cd photer-api-dev
npx prisma db push
npx prisma generate
```

## 🚀 Development

### Start both applications

```bash
# Terminal 1 - Backend
cd photer-api-dev
yarn start:dev:gateway

# Terminal 2 - Frontend
cd photer-app-dev
yarn dev
```

### Build for production

```bash
# Frontend
cd photer-app-dev
yarn build

# Backend
cd photer-api-dev
yarn build:all
```

## 📝 License

This project is licensed under the MIT License.
