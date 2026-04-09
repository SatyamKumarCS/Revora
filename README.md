# Revora API - Lead Generation Backend

This is the backend API for Revora, built with **FastAPI**. It has been architecturally designed to serve not only as a functional application but also to demonstrate proper **System Design**, **Object-Oriented Programming (OOP)**, and **SOLID Principles**.

---

## System Architecture & Design Patterns

We have thoughtfully applied standard enterprise design patterns to structure our features modularly and expansively. Here are the core patterns implemented in this codebase:

### 1. **Singleton Pattern**

- **Where**: `app/db/database.py`
- **Why**: Database connections are expensive. The `DatabaseManager` strictly enforces the creation of only exactly one database connection engine (`sqlalchemy.create_engine`) across the entire lifecycle of the application. It guarantees resource efficiency.

### 2. **Strategy Pattern**

- **Where**: `app/services/lead_generation_strategy.py`
- **Why**: Allows the application to seamlessly switch between different lead sources (Apollo, LinkedIn, Hunter). The codebase interacts only with the abstract `LeadGenerationStrategy.generate_leads()` method, meaning the application doesn't care _how_ a lead is fetched, only that it is returned in a standard format.

### 3. **Factory Pattern**

- **Where**: `app/services/lead_factory.py`
- **Why**: Used by the routing layer to dynamically create the correct strategy without tightly coupling the API endpoints to an exact class. By providing a string like `"Apollo"`, the Factory safely resolves it into an active `ApolloLeadStrategy` object.

### 4. **Adapter Pattern**

- **Where**: `app/services/apollo_adapter.py`
- **Why**: External APIs change without warning and often return overly complex/deep JSON data structures. The Adapter pattern translates Apollo's incompatible or weird data types into our standard, internal Application DTO format (`Lead`). This shields our models from third-party vendor changes.

---

## SOLID Principles Implemented

- **S - Single Responsibility Principle**: Responsibilities are strictly segregated. For example, `ApolloLeadStrategy` _strictly handles HTTP fetching_, while `ApolloAdapter` _strictly handles JSON normalization_. The routing methods no longer do either.
- **O - Open/Closed Principle**: By using the Strategy Pattern, we can integrate new data sources (e.g., Lusha, ZoomInfo) by simply creating a new class that extends `LeadGenerationStrategy`. We **never have to modify** the existing lead generation execution code again.
- **L - Liskov Substitution Principle**: All route consumers expect an object from the Factory to be a `LeadGenerationStrategy`. Whether it's Apollo or LinkedIn, they can be directly substituted for each other securely.
- **I - Interface Segregation Principle**: Python Abstract Base Classes (`ABC`) enforce very specific logic constraints rather than bloated catch-all handlers.
- **D - Dependency Inversion Principle**: The FastAPI routes depend on the _abstract_ interface/factory logic, not on the low-level implementation details of how an Apollo API call works.

---

## Quick Start Commands

To make interactions simple, we have provided the exact bash commands to run your application.

You can run these commands from the `apps/api/` folder:

| Action                                                        | Command                                                         |
| ------------------------------------------------------------- | --------------------------------------------------------------- |
| Starts the local FastAPI server in watch/reload mode.         | `cd app && uvicorn main:app --reload --port 8000`               |
| Installs needed dependencies via pip.                         | `cd app && pip install -r requirements.txt`                     |
| Triggers alembic to push awaiting changes to the DB.          | `cd app && alembic upgrade head`                                |
| Triggers alembic to auto-generate a new migration script.     | `cd app && alembic revision --autogenerate -m "Auto migration"` |
| Wipes out any `__pycache__` artifacts cluttering the project. | `find . -type d -name "__pycache__" -exec rm -rf {} +`          |

_Example output for starting the server:_

```bash
$ cd app && uvicorn main:app --reload --port 8000
INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

## Project Directory Structure

```text
Revora/
├── apps/
│   ├── api/                # FastAPI Backend
│   │   └── app/
│   │       ├── db/         # Singleton implementations for DB
│   │       ├── models/     # SQLAlchemy ORM Models
│   │       ├── routes/     # FastAPI Route configurations
│   │       └── services/   # Design Patterns (Factory, Strategy, Adapter)
│   ├── docs/               # Next.js Docs application
│   └── web/                # Next.js Web application
├── packages/               # Shared Turborepo packages
│   ├── ui/                 # Shared React Components
│   ├── eslint-config/      # Shared ESLint config
│   └── typescript-config/  # Shared TS configs
├── turbo.json              # Turborepo configuration
└── README.md               # You are here
```
