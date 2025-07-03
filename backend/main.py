"""
FastAPI Backend for Cat Facts Tracker
=====================================
This FastAPI application connects to our SQLite database and provides
REST API endpoints for managing cat facts.
"""

from fastapi import FastAPI, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import httpx
from database import initialize_database, get_all_facts, save_fact_to_database

# Initialize FastAPI app
app = FastAPI(
    title="Cat Fact Tracker API",
    description="A REST API for managing cat facts with SQLite database storage",
    version="1.0.0"
)

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can limit this to http://localhost:3000 if preferred
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for API request/response
class CatFactResponse(BaseModel):
    """Response model for cat facts"""
    id: int
    fact: str
    created_at: str


# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize the database when the application starts"""
    print("Initializing database...")
    initialize_database()
    print("Database initialized successfully")


# API Routes
@app.get("/catfacts", response_model=List[CatFactResponse])
async def get_cat_facts():
    """
    Get all cat facts from the database
    
    Returns:
        List[CatFactResponse]: List of all cat facts with id, fact, and created_at
    """
    try:
        # Get all facts from database
        facts_data = get_all_facts()
        
        # Convert database tuples to response models
        facts = []
        for fact_tuple in facts_data:
            fact_id, fact_text, created_at = fact_tuple
            facts.append(CatFactResponse(
                id=fact_id,
                fact=fact_text,
                created_at=created_at
            ))
        
        return facts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@app.get("/catfacts/random")
async def get_random_cat_fact():
    """
    Get a random cat fact from the external Cat Facts API
    
    Returns:
        dict: A dictionary containing a random cat fact
    """
    try:
        # Fetch a random cat fact from the external API
        async with httpx.AsyncClient() as client:
            response = await client.get("https://catfact.ninja/fact")
            response.raise_for_status()  # Raise an exception for bad status codes
            
            # Parse the JSON response
            data = response.json()
            
            # Return just the fact in the requested format
            return {"fact": data["fact"]}
            
    except httpx.RequestError as e:
        # Handle network-related errors
        raise HTTPException(status_code=503, detail="Unable to fetch random cat fact from external API")
    except httpx.HTTPStatusError as e:
        # Handle HTTP errors from the external API
        raise HTTPException(status_code=503, detail="External cat facts API is unavailable")
    except Exception as e:
        # Handle any other unexpected errors
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@app.post("/catfacts")
async def create_cat_fact_form(fact: str = Form(...)):
    """
    Create a new cat fact in the database via form data
    
    Args:
        fact (str): The cat fact text submitted via form data
    
    Returns:
        dict: Success message with the created fact or error message for duplicates/invalid input
    """
    try:
        # Validate the input
        if not fact or not fact.strip():
            return {
                "success": False,
                "message": "Invalid input: Fact cannot be empty",
                "error": "INVALID_FACT"
            }
        
        # Clean up the fact text
        fact_text = fact.strip()
        
        # Save fact to database
        success = save_fact_to_database(fact_text)
        
        if not success:
            # This means it's a duplicate
            return {
                "success": False,
                "message": "Duplicate fact: This cat fact already exists in the database",
                "error": "DUPLICATE_FACT",
                "fact": fact_text
            }
        
        # Successfully created
        # Get all facts to find the newly created one
        facts_data = get_all_facts()
        
        # Find the fact we just inserted
        created_fact = None
        for fact_tuple in facts_data:
            fact_id, stored_fact_text, created_at = fact_tuple
            if stored_fact_text == fact_text:
                created_fact = {
                    "id": fact_id,
                    "fact": stored_fact_text,
                    "created_at": created_at
                }
                break
        
        return {
            "success": True,
            "message": "Cat fact successfully added to the database",
            "data": created_fact
        }
        
    except Exception as e:
        return {
            "success": False,
            "message": f"Database error occurred while saving the fact: {str(e)}",
            "error": "DATABASE_ERROR"
        }


# Run the application
if __name__ == "__main__":
    print("Starting Cat Facts Tracker API...")
    print("API Documentation available at: http://localhost:8000/docs")
    print("Cat Facts endpoint: http://localhost:8000/catfacts")
    uvicorn.run(app, host="0.0.0.0", port=8000)