"""
Cat Facts Fetcher Script
========================
This script fetches cat facts from the Cat Facts API and saves them to the database.
"""

import httpx   
import asyncio    # For running asynchronous operations (faster API calls)
import json  
from database import initialize_database, save_fact_to_database  


# API Configuration
# This is the endpoint we'll use to get cat facts
CAT_FACTS_API_URL = "https://catfact.ninja/fact"


async def fetch_multiple_cat_facts(num_facts=5):
    """
    Fetches multiple cat facts from the API and saves them to the database
    
    Args:
        num_facts (int): Number of cat facts to fetch (default: 5)
    
    Returns:
        list: A list of cat fact dictionaries
    """
    print(f"Starting to fetch {num_facts} cat facts...")
    
    cat_facts = []
    inserted_count = 0
    skipped_count = 0
    
    # Fetch the specified number of cat facts
    for i in range(num_facts):
        print(f"Fetching cat fact #{i + 1}...")
        
        try:
            # Create an HTTP client and fetch a cat fact
            async with httpx.AsyncClient() as client:
                response = await client.get(CAT_FACTS_API_URL)
                
                if response.status_code == 200:
                    fact_data = response.json()
                    cat_facts.append(fact_data)
                    fact_text = fact_data['fact']
                    
                    # Save the fact to the database
                    was_inserted = save_fact_to_database(fact_text)
                    if was_inserted:
                        inserted_count += 1
                    else:
                        skipped_count += 1
                else:
                    print(f"API request failed with status code: {response.status_code}")
                    
        except httpx.RequestError as e:
            print(f"Network error occurred: {e}")
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON response: {e}")
        except Exception as e:
            print(f"Unexpected error occurred: {e}")
    
    # Print summary
    print(f"\nSummary: {inserted_count} facts inserted, {skipped_count} facts skipped (duplicates)")
    
    return cat_facts


async def main():
    """
    Main function that fetches cat facts and saves them to database
    """
    print("Cat Facts Fetcher - Fetching 5 cat facts...")
    
    # Initialize the database
    print("Initializing database...")
    initialize_database()
    
    # Fetch 5 cat facts from the API and save them to the database
    cat_facts = await fetch_multiple_cat_facts(5)
    
    print(f"Completed! Successfully processed {len(cat_facts)} cat facts.")
    return cat_facts


# Script Entry Point
# This runs when the script is executed directly (not imported)
if __name__ == "__main__":
    # Run the main function using asyncio
    # This allows us to use async/await for faster API calls
    asyncio.run(main())