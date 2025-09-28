# Todo2025

A modern todo application built with React, TypeScript, and SQLite.

![Todo2025 Demo](/yata-toddo-Sep-27-2025%2021-38-02.gif)

## Tech Stack

### Frontend

- React 19
- TypeScript 5.8
- Vite 7
- TailwindCSS 3.4
- DaisyUI 5.1
- FontAwesome Icons 7.0

### Backend

- Node.js with Express
- TypeScript
- Better-SQLite3
- Jest for testing
- Morgan for logging
- CORS enabled

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository

1. Install frontend dependencies:

```bash
cd todo2025
npm install
```

1. Install backend dependencies:

```bash
cd server
npm install
```

### Running the Application

#### Starting the Frontend

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

#### Starting the Backend

Run the development server:

```bash
cd server
npm run dev
```

Build for production:

```bash
cd server
npm run build
npm start
```

### Running Tests

Run backend tests:

```bash
cd server
npm test
```

## Project Structure

```plaintext
todo2025/
├── src/                  # Frontend source code
│   ├── actions/         # Frontend actions
│   ├── services/        # API services
│   ├── lib/             # Shared utilities
│   └── assets/          # Static assets
├── server/              # Backend source code
│   ├── src/
│   │   ├── config/     # Database configuration
│   │   ├── controllers/# Route controllers
│   │   ├── models/     # Data models
│   │   ├── routes/     # API routes
│   │   └── migrations/ # Database migrations
│   └── db/             # SQLite database files
```

## Features

- Create, read, update, and delete todos
- SQLite database for persistent storage
- Type-safe frontend and backend
- Modern UI with TailwindCSS and DaisyUI
- Comprehensive test coverage

## ESLint Configuration

The project uses a modern ESLint setup with TypeScript support. The configuration includes:

- Type-aware lint rules
- React-specific linting
- Strict TypeScript checks

For more details on the ESLint configuration, see the `eslint.config.js` file.
