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
- **Interactive Dashboard**: Real-time stats and filtering
- **CRUD Operations**: Add, edit, delete, and favorite cat facts
- **Random Facts**: Get random cat facts from external API
- **Filter System**: Filter by favorites, user-added, or API facts
- **Loading States**: Smooth loading animations and error handling

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

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Start the Backend**: Run the FastAPI server on port 8000
2. **Start the Frontend**: Run the Next.js development server on port 3000
3. **Add Cat Facts**: Use the form to add your own cat facts
4. **Get Random Facts**: Click the "Get Random Cat Fact" button to fetch facts from external API
5. **Manage Facts**: Mark facts as favorites, filter by categories, or delete unwanted facts

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation.

### Main Endpoints
- `GET /api/facts` - Get all cat facts
- `POST /api/facts` - Create a new cat fact
- `GET /api/facts/{id}` - Get a specific cat fact
- `PUT /api/facts/{id}` - Update a cat fact
- `DELETE /api/facts/{id}` - Delete a cat fact
- `POST /api/facts/{id}/favorite` - Toggle favorite status
- `GET /api/facts/random` - Get a random cat fact from external API

## Project Structure

```
cat-fact-tracker/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── README.md           # Backend documentation
│   └── .gitignore          # Python gitignore
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx   # Root layout
│   │   │   ├── page.tsx     # Main page
│   │   │   └── globals.css  # Global styles
│   │   ├── components/      # React components
│   │   │   ├── CatFactCard.tsx
│   │   │   ├── AddFactForm.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── EmptyState.tsx
│   │   └── types/
│   │       └── catFact.ts   # TypeScript types
│   ├── package.json        # Node dependencies
│   └── tailwind.config.js  # Tailwind configuration
├── README.md               # Project documentation
└── .gitignore             # Git ignore rules
```

## Future Enhancements

- [ ] User authentication and accounts
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Cat fact sharing functionality
- [ ] Advanced search and filtering
- [ ] Fact categories and tags
- [ ] Export facts to different formats
- [ ] Mobile app version
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