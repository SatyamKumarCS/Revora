import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables early
load_dotenv()

class DatabaseManager:
    """
    DESIGN PATTERN: Singleton
    
    Centralized database connection and session management.
    Ensures a single engine instance is shared across the application.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseManager, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Standardizes engine and session pool configuration."""
        self._database_url = os.getenv("DATABASE_URL")
        
        if not self._database_url:
            raise RuntimeError("DATABASE_URL not found in environment")

        self._engine = create_engine(
            self._database_url,
            pool_pre_ping=True,
            pool_recycle=300,
            connect_args={"keepalives": 1, "keepalives_idle": 30, "keepalives_interval": 10, "keepalives_count": 5}
        )
        
        self._session_factory = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=self._engine
        )

    @property
    def engine(self):
        return self._engine

    @property
    def session_factory(self):
        return self._session_factory

# Global instance for easier access while maintaining Singleton behavior
db_manager = DatabaseManager()

# For backwards compatibility with standard FastAPI dependency patterns
engine = db_manager.engine
SessionLocal = db_manager.session_factory