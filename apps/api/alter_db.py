import os
from sqlalchemy import text
from app.db.database import engine

def alter_schema():
    print("Altering schema to add user_id tracking fields...")
    with engine.begin() as conn:
        try:
            conn.execute(text("ALTER TABLE campaign ADD COLUMN user_id VARCHAR"))
            print("Successfully added user_id columns to campaign table!")
        except Exception as e:
            print(f"Error (maybe columns exist?): {e}")

if __name__ == "__main__":
    alter_schema()
