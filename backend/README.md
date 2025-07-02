# Cat Fact Tracker Backend

A FastAPI-based backend for tracking and managing cat facts.

## Features

- CRUD operations for cat facts
- Random cat fact fetching from external API
- Favorite cat facts
- CORS enabled for frontend integration
- RESTful API design

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
```bash
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Interactive API docs: `http://localhost:8000/docs`
- ReDoc documentation: `http://localhost:8000/redoc`

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/facts` - Get all cat facts
- `GET /api/facts/{fact_id}` - Get specific cat fact
- `POST /api/facts` - Create new cat fact
- `PUT /api/facts/{fact_id}` - Update cat fact
- `DELETE /api/facts/{fact_id}` - Delete cat fact
- `POST /api/facts/{fact_id}/favorite` - Toggle favorite status
- `GET /api/facts/random` - Get random cat fact from external API
