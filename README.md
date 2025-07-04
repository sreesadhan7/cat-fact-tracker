# 🐱 Cat Fact Tracker

A modern, full-stack web application for discovering, collecting, and managing fascinating cat facts. Built with Next.js, TypeScript, Tailwind CSS, and FastAPI.

![Cat Fact Tracker](https://img.shields.io/badge/Cat%20Facts-Awesome-purple?style=for-the-badge&logo=github)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Python](https://img.shields.io/badge/Python-FastAPI-green?style=for-the-badge&logo=python)

## Features

### Frontend (Next.js + TypeScript + Tailwind CSS)
- **Beautiful UI**: Modern gradient design with glassmorphism effects
- **Dark Mode**: Full dark mode support
- **Responsive Design**: Works perfectly on all devices
- **Interactive Dashboard**: Real-time stats
- **CRUD Operations**: Add, edit, delete, and favorite cat facts
- **Random Facts**: Get random cat facts from external API
<!-- - **Loading States**: Smooth loading animations and error handling -->

### Backend (Python + FastAPI)
- **RESTful API**: Complete CRUD operations for cat facts
- **Data Validation**: Pydantic models for type safety
- **External API Integration**: Fetch random facts from catfact.ninja
- **CORS Support**: Configured for frontend integration
- **Interactive Docs**: Auto-generated API documentation

## Tech Stack

### Frontend
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Build Tool**: Turbopack (for fast development)

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **Data Validation**: Pydantic
- **HTTP Client**: HTTPX
- **Server**: Uvicorn

## Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cat-fact-tracker.git
cd cat-fact-tracker
```

After cloning the repository, follow these steps to run the Cat Fact Tracker application:

### 2. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd backend

# Create virtual environment (recommended)
# python -m venv venv

# Activate virtual environment
# Windows:
# venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# First, populate the database with initial cat facts
python import_cat_facts.py

# Then start the FastAPI server using Uvicorn for auto-reload during development
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend

# Install dependencies
npm install

# Start the Next.js development server
npm run dev
```

The frontend application will be available at `http://localhost:3000`

## Quick Start

### Step 1: Clone and Setup Backend
```bash
git clone https://github.com/yourusername/cat-fact-tracker.git
cd cat-fact-tracker/backend

# Create and activate virtual environment
# python -m venv venv
# venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Initialize database with sample data
python import_cat_facts.py

# Start the backend server
uvicorn main:app --reload
```

### Step 2: Setup Frontend (New Terminal)
```bash
cd frontend
npm install
npm run dev
```

### Step 3: Access the Application
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs

## Usage

1. **View Cat Facts**: The dashboard displays all stored cat facts from your database
2. **Add New Facts**: Use the form to submit your own cat facts to the database
3. **Get Random Facts**: Click "Get Random Cat Fact" to fetch new facts from the external API
4. **Delete Facts**: Remove unwanted facts from your collection
5. **Database Management**: Facts are automatically saved to SQLite database for persistence

**Note**: The application requires both backend (port 8000) and frontend (port 3000) servers to be running simultaneously.

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Main Endpoints
- `GET /catfacts` - Get all cat facts from database
- `POST /catfacts` - Create a new cat fact (via form data)
- `DELETE /catfacts/{id}` - Delete a cat fact by ID
- `GET /catfacts/random` - Get a random cat fact from external API

## Project Structure

```
cat-fact-tracker/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database operations
│   ├── import_cat_facts.py  # Database initialization script
│   └── README.md           # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx   # Root layout
│   │   │   ├── page.tsx     # Main page
│   │   │   ├── globals.css  # Global styles
│   │   │   └── favicon.ico  # App icon
│   │   ├── components/      # React components
│   │   │   ├── AddFactForm.tsx
│   │   │   ├── CatFactCard.tsx
│   │   │   ├── ChartIcon.tsx
│   │   │   ├── Charts.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── theme-provider.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── ui/          # UI components
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       └── sonner.tsx
│   │   ├── lib/
│   │   │   └── utils.ts     # Utility functions
│   │   └── types/
│   │       └── catFact.ts   # TypeScript types
│   ├── public/              # Static assets
│   ├── package.json        # Node dependencies
│   ├── next.config.ts      # Next.js configuration
│   ├── tsconfig.json       # TypeScript configuration
│   ├── components.json     # shadcn/ui components config
│   ├── postcss.config.mjs  # PostCSS configuration
│   ├── eslint.config.mjs   # ESLint configuration
│   └── README.md           # Frontend documentation
├── requirements.txt        # Python dependencies
├── README.md              # Project documentation
└── .gitignore            # Git ignore rules
```

## Future Enhancements

- [ ] User authentication and accounts
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Cat fact sharing functionality
- [ ] Search and filtering
- [ ] Fact categories and tags
- [ ] Export facts to different formats
- [ ] Social features and comments

## Acknowledgments

- [catfact.ninja](https://catfact.ninja) for providing random cat facts API
- [Next.js](https://nextjs.org) team for the amazing React framework
- [FastAPI](https://fastapi.tiangolo.com) for the modern Python web framework
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework

## 📧 Contact

Created by `Sree Sadhan` - feel free to contact me!

---

Made with ❤️ and 🐱 by cat lovers, for cat lovers!