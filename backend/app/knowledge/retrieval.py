from google import genai
from app.database import get_db


def retrieve_context(query: str, client: genai.Client, k: int = 4) -> str:
    """Embed query, find top-k matching chunks via pgvector cosine similarity, return formatted context."""
    result = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=query,
    )
    query_embedding = result.embeddings[0].values

    db = get_db()
    response = db.rpc("match_knowledge", {
        "query_embedding": query_embedding,
        "match_count": k,
    }).execute()

    if not response.data:
        return ""

    return "\n\n---\n\n".join(
        f"## {chunk['title']}\n{chunk['content']}"
        for chunk in response.data
    )
