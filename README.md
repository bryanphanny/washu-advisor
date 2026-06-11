# WashU Advisor

AI-powered academic advisor for WashU students — course planning, GPA tracking, degree audit, and an AI chat advisor.

## Project Structure

```
washu-advisor/
├── backend/    # FastAPI (Python) — AI chat, RAG, course/requirements API
└── frontend/   # Next.js (TypeScript) — UI
```

## Prerequisites

- Python 3.11+
- Node.js 18+
- Supabase project (for the database)
- Anthropic API key (for the AI chat advisor)
- Google Gemini API key (optional, fallback)

## Setup

### Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and fill in SUPABASE_URL, SUPABASE_SERVICE_KEY, ANTHROPIC_API_KEY
```

### Frontend

```bash
cd frontend
npm install
# Make sure frontend/.env.local exists with your Supabase public keys
```

## Running Locally

Open two terminals.

**Terminal 1 — Backend**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```
API will be available at `http://localhost:8000`

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```
App will be available at `http://localhost:3000`

## Environment Variables

### `backend/.env`
| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key (keep secret) |
| `ANTHROPIC_API_KEY` | Anthropic API key for the AI advisor |

### `frontend/.env.local`
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

## API

Health check: `GET http://localhost:8000/health`

Swagger docs: `http://localhost:8000/docs`
