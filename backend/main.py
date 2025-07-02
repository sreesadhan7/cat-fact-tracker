from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import httpx
import uvicorn
from datetime import datetime
import json
import os

# Initialize FastAPI app
app = FastAPI(
    title="Cat Fact Tracker API",
    description="A simple API to track and manage cat facts",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class CatFact(BaseModel):
    id: Optional[int] = None
    fact: str
    source: str = "user"
    timestamp: str = datetime.now().isoformat()
    favorite: bool = False

class CatFactResponse(BaseModel):
    id: int
    fact: str
    source: str
    timestamp: str
    favorite: bool

# In-memory storage (you can replace with a database later)
cat_facts: List[CatFactResponse] = []
fact_counter = 0

# Routes
@app.get("/")
async def root():
    return {"message": "Welcome to Cat Fact Tracker API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/api/facts", response_model=List[CatFactResponse])
async def get_all_facts():
    """Get all cat facts"""
    return cat_facts

@app.get("/api/facts/{fact_id}", response_model=CatFactResponse)
async def get_fact(fact_id: int):
    """Get a specific cat fact by ID"""
    for fact in cat_facts:
        if fact.id == fact_id:
            return fact
    raise HTTPException(status_code=404, detail="Cat fact not found")

@app.post("/api/facts", response_model=CatFactResponse)
async def create_fact(fact: CatFact):
    """Create a new cat fact"""
    global fact_counter
    fact_counter += 1
    
    new_fact = CatFactResponse(
        id=fact_counter,
        fact=fact.fact,
        source=fact.source,
        timestamp=fact.timestamp,
        favorite=fact.favorite
    )
    cat_facts.append(new_fact)
    return new_fact

@app.put("/api/facts/{fact_id}", response_model=CatFactResponse)
async def update_fact(fact_id: int, fact: CatFact):
    """Update a cat fact"""
    for i, existing_fact in enumerate(cat_facts):
        if existing_fact.id == fact_id:
            updated_fact = CatFactResponse(
                id=fact_id,
                fact=fact.fact,
                source=fact.source,
                timestamp=existing_fact.timestamp,
                favorite=fact.favorite
            )
            cat_facts[i] = updated_fact
            return updated_fact
    raise HTTPException(status_code=404, detail="Cat fact not found")

@app.delete("/api/facts/{fact_id}")
async def delete_fact(fact_id: int):
    """Delete a cat fact"""
    for i, fact in enumerate(cat_facts):
        if fact.id == fact_id:
            deleted_fact = cat_facts.pop(i)
            return {"message": "Cat fact deleted", "deleted_fact": deleted_fact}
    raise HTTPException(status_code=404, detail="Cat fact not found")

@app.post("/api/facts/{fact_id}/favorite")
async def toggle_favorite(fact_id: int):
    """Toggle favorite status of a cat fact"""
    for fact in cat_facts:
        if fact.id == fact_id:
            fact.favorite = not fact.favorite
            return {"message": "Favorite status updated", "fact": fact}
    raise HTTPException(status_code=404, detail="Cat fact not found")

@app.get("/api/facts/random")
async def get_random_fact():
    """Get a random cat fact from external API"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get("https://catfact.ninja/fact")
            response.raise_for_status()
            data = response.json()
            return {"fact": data["fact"], "source": "catfact.ninja"}
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Unable to fetch random cat fact")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
