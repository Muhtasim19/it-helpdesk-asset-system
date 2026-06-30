# IT Help Desk & Asset Management System

A full-stack IT help desk application for managing company assets, support tickets, user authentication, and dashboard statistics.

The project uses a React frontend, a FastAPI backend, and PostgreSQL for persistent data storage.

## Features

- User registration and login
- JWT-based authentication
- Protected frontend routes
- Role-based access control
- Dashboard statistics
- Asset creation and listing
- Asset status and assignment tracking
- Ticket creation and listing
- Ticket priority management
- Ticket status updates
- Responsive user interface
- Form validation and API error handling
- Automatic success and error messages
- Swagger API documentation

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- React Hook Form

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT authentication
- Passlib and bcrypt

## Project Structure

```text
it-helpdesk-asset-system/
├── backend/
│   ├── .venv/
│   ├── .env
│   └── backend/
│       ├── app/
│       │   ├── models/
│       │   ├── routers/
│       │   ├── schemas/
│       │   ├── utils/
│       │   ├── database.py
│       │   └── main.py
│       └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── .gitignore
├── .nvmrc
└── README.md
```

## Prerequisites

Install the following software before running the project:

- Node.js
- npm
- Python 3
- PostgreSQL
- Git

This project includes an `.nvmrc` file. If you use NVM, run:

```bash
nvm use
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Muhtasim19/it-helpdesk-asset-system.git
cd it-helpdesk-asset-system
```

### 2. Create the PostgreSQL database

Open PostgreSQL:

```bash
psql -U postgres -h localhost
```

Create the database:

```sql
CREATE DATABASE helpdesk_db;
```

Exit PostgreSQL:

```sql
\q
```

### 3. Configure backend environment variables

Create this file:

```text
backend/.env
```

Add the following variables:

```env
DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/helpdesk_db
SECRET_KEY=YOUR_RANDOM_SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Generate a random secret key with:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Do not commit the `.env` file or any real passwords, tokens, or secret keys.

### 4. Install and run the backend

From the project root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cd backend
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

To deactivate the Python environment:

```bash
deactivate
```

### 5. Install and run the frontend

Open a second terminal and run:

```bash
cd frontend
nvm use
npm install
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

## Production Build

To create a production frontend build:

```bash
cd frontend
npm run build
```

The generated files will be placed in:

```text
frontend/dist/
```

## Main API Endpoints

### Authentication

```text
POST /register
POST /login
```

### Assets

```text
GET  /assets
POST /assets
```

### Tickets

```text
GET    /tickets/
POST   /tickets/
GET    /tickets/{ticket_id}
PUT    /tickets/{ticket_id}
DELETE /tickets/{ticket_id}
```

### Dashboard

```text
GET /dashboard/
```

Use Swagger at `/docs` as the source of truth for request and response schemas.

## User Roles

The application supports two main roles:

- `user`
- `admin`

Administrators can perform restricted asset-management operations. Users can access the permitted dashboard, asset, and ticket features based on backend authorization rules.

For local testing, a user's role can be updated directly in PostgreSQL:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'user@example.com';
```

Log out and sign in again after changing a role because the JWT contains role information.

## Main User Flow

1. Register an account.
2. Sign in.
3. View dashboard statistics.
4. View available assets.
5. Create assets when authorized.
6. Create help desk tickets.
7. Update ticket status.
8. Log out.

## Color Palette

The interface uses the following project palette:

```text
Lavender Grey: #A7A5C6
Lavender Grey: #8797B2
Slate Grey:    #6D8A96
Blue Slate:    #5D707F
Strong Cyan:   #66CED6
White:         #FFFFFF
Black:         #111111
```




## Testing Checklist

Before submission or deployment, verify:

- Registration works
- Login works
- Invalid login displays an error
- Dashboard statistics load
- Assets load
- Admin asset creation works
- Unauthorized asset creation is blocked
- Tickets load
- Ticket creation works
- Ticket status updates persist after refresh
- Logout removes the access token
- Protected routes redirect to login
- `npm run build` succeeds

## Current Scope

The current MVP includes authentication, dashboard statistics, asset management, ticket creation, and ticket status management.

Ticket assignment to a technician requires backend assignment-field support and can be added as the next enhancement.

## Security Notes

- Never commit `.env`.
- Never commit database passwords.
- Never commit JWT access tokens.
- Never commit secret keys.
- Rotate any credential that has been accidentally exposed.
- Python cache files and virtual environments should remain excluded through `.gitignore`.

## Contributors

- Muhtasim Haq — Frontend development and integration
- Sabirul — Backend development

## License

See the `LICENSE` file for license information.

---

© 2026 IT Help Desk. All rights reserved.
