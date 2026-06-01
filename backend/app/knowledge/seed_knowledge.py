"""
One-time script to embed all knowledge chunks and store them in Supabase.
Run from the backend directory: python -m app.knowledge.seed_knowledge
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from dotenv import load_dotenv
load_dotenv()

from google import genai
from app.knowledge.chunks import CHUNKS
from app.database import get_db


def seed():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not set")
        sys.exit(1)

    client = genai.Client(api_key=api_key)
    db = get_db()

    print(f"Embedding {len(CHUNKS)} chunks...")
    for chunk in CHUNKS:
        text = f"{chunk['title']}\n\n{chunk['content'].strip()}"
        result = client.models.embed_content(
            model="models/gemini-embedding-001",
            contents=text,
        )
        embedding = result.embeddings[0].values

        db.table("knowledge_base").upsert({
            "id": chunk["id"],
            "title": chunk["title"],
            "content": chunk["content"].strip(),
            "embedding": embedding,
        }).execute()
        print(f"  ✓ {chunk['id']}")

    print("Done — all chunks embedded and stored.")


if __name__ == "__main__":
    seed()
