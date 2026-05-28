# Inventory & Order Management System

A full-stack, production-ready, containerized application for managing products, customers, orders, and inventory.

## Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Python (FastAPI)
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose

## Features

- **Product Management** - Create, read, update, and delete products with SKU tracking
- **Customer Management** - Manage customer records with unique email enforcement
- **Order Management** - Create orders with automatic stock validation and reduction
- **Dashboard** - Real-time summary with total counts and low-stock alerts
- **Business Logic** - Unique SKU/email validation, stock checks, auto-calculated totals

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── routers/       # API route handlers
│   │   ├── main.py        # FastAPI application entry point
│   │   ├── models.py      # SQLAlchemy database models
│   │   ├── schemas.py     # Pydantic validation schemas
│   │   ├── database.py    # Database connection setup
│   │   └── config.py      # Configuration management
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/         # React page components
│   │   ├── services/      # API service layer
│   │   ├── App.jsx        # Main app with routing
│   │   └── index.css      # Global styles
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Docker & Docker Compose installed on your machine

### Running with Docker Compose

1. Clone the repository:
   ```bash
   git clone https://github.com/Arvindvishal2673/Inventory-Order-Management-System.git
   cd Inventory-Order-Management-System
   ```

2. Create a `.env` file (or copy from example):
   ```bash
   cp .env.example .env
   ```

3. Start all services:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8000
   - **API Documentation:** http://localhost:8000/docs

### Running Without Docker (Development)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /products/ | Create a new product |
| GET | /products/ | Get all products |
| GET | /products/{id} | Get product by ID |
| PUT | /products/{id} | Update a product |
| DELETE | /products/{id} | Delete a product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /customers/ | Create a new customer |
| GET | /customers/ | Get all customers |
| GET | /customers/{id} | Get customer by ID |
| DELETE | /customers/{id} | Delete a customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /orders/ | Create a new order |
| GET | /orders/ | Get all orders |
| GET | /orders/{id} | Get order by ID |
| DELETE | /orders/{id} | Cancel/Delete an order |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard/ | Get summary statistics |

## Business Rules

- Product SKU/code must be unique
- Customer email must be unique
- Product quantity cannot be negative
- Orders cannot be placed if inventory is insufficient
- Creating an order automatically reduces available stock
- Cancelling an order restores the stock
- Total order amount is calculated automatically by the backend
- All APIs include proper error handling with appropriate HTTP status codes

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| POSTGRES_USER | PostgreSQL username | postgres |
| POSTGRES_PASSWORD | PostgreSQL password | postgres |
| POSTGRES_DB | Database name | inventory_db |
| DATABASE_URL | Full database connection URL | postgresql://postgres:postgres@db:5432/inventory_db |
| VITE_API_URL | Backend API URL for frontend | http://localhost:8000 |

## Docker Hub

Backend image: `docker pull <your-dockerhub-username>/inventory-backend:latest`

## Deployment

- **Backend:** Deployed on Render/Railway/Fly.io
- **Frontend:** Deployed on Vercel/Netlify
