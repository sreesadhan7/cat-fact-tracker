"""
Database Operations for Cat Facts Tracker
=========================================
This module handles all database operations for storing and retrieving cat facts.
"""

import sqlite3
from typing import List, Tuple


# Database Configuration
DATABASE_FILE = "cat_facts.db"


def initialize_database():
    """
    Creates the database and cat_facts table if they don't exist
    
    The table structure matches the requested schema:
    - id: Primary key (auto-increment)
    - fact: The actual cat fact text (UNIQUE to prevent duplicates)
    - created_at: Date when the fact was added (defaults to current date)
    """
    try:
        # Connect to the SQLite database (creates it if it doesn't exist)
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        
        # Create the cat_facts table with the requested structure
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cat_facts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fact TEXT UNIQUE,
                created_at DATE DEFAULT (DATE('now'))
            )
        ''')
        
        # Save the changes and close the connection
        conn.commit()
        conn.close()
        
        print("Database initialized successfully")
        
    except sqlite3.Error as e:
        print(f"Database initialization error: {e}")


def save_fact_to_database(fact_text: str) -> bool:
    """
    Saves a cat fact to the database, avoiding duplicates
    
    Args:
        fact_text (str): The cat fact text to save
    
    Returns:
        bool: True if fact was inserted, False if it was a duplicate
    """
    try:
        # Connect to the database
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        
        # Try to insert the fact (will fail if fact already exists due to UNIQUE constraint)
        try:
            cursor.execute('''
                INSERT INTO cat_facts (fact)
                VALUES (?)
            ''', (fact_text,))
            
            # Save the changes
            conn.commit()
            conn.close()
            
            print(f"INSERTED: New cat fact saved to database")
            print(f"  Fact: {fact_text[:50]}..." if len(fact_text) > 50 else f"  Fact: {fact_text}")
            return True
            
        except sqlite3.IntegrityError:
            # This happens when we try to insert a duplicate (same fact text)
            conn.close()
            print(f"SKIPPED: Duplicate fact already exists in database")
            print(f"  Fact: {fact_text[:50]}..." if len(fact_text) > 50 else f"  Fact: {fact_text}")
            return False
            
    except sqlite3.Error as e:
        print(f"Database error while saving fact: {e}")
        return False


def get_all_facts() -> List[Tuple[int, str, str]]:
    """
    Retrieves all cat facts from the database
    
    Returns:
        List[Tuple]: List of tuples containing (id, fact, created_at)
    """
    try:
        conn = sqlite3.connect(DATABASE_FILE)
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, fact, created_at FROM cat_facts ORDER BY created_at DESC")
        facts = cursor.fetchall()
        
        conn.close()
        return facts
        
    except sqlite3.Error as e:
        print(f"Database error while retrieving facts: {e}")
        return []
