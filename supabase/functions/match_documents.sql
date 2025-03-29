
-- Create a function to match documents by similarity
CREATE OR REPLACE FUNCTION match_documents(query_embedding vector(1536), match_threshold float, match_count int)
RETURNS TABLE(
  id bigint,
  title text,
  content text,
  type text,
  created_at timestamptz,
  similarity float,
  organization_id text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kb.id,
    kb.title,
    kb.content,
    kb.type,
    kb.created_at,
    1 - (kb.embedding <=> query_embedding) as similarity,
    kb.organization_id
  FROM knowledge_base kb
  WHERE 1 - (kb.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
