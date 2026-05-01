import { AITool, TechStack, ToolCategory } from '../types';

export async function getToolDetails(toolName: string): Promise<string> {
  try {
    const res = await fetch('/api/tool-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ toolName }),
    });
    if (!res.ok) {
      throw new Error(`request failed: ${res.status}`);
    }
    const data = (await res.json()) as { text?: string; error?: string };
    if (data.error) throw new Error(data.error);
    return data.text ?? '';
  } catch (error) {
    console.error(`Error fetching details for ${toolName}:`, error);
    return 'Failed to load deep-dive details. Check your connection or try again.';
  }
}

export async function generateGuidedStack(goal: string, tools: AITool[]): Promise<TechStack> {
  // Don't send concepts to the model — they aren't pickable "tools" and just
  // bloat the prompt. Concept entries (LLM, RAG, MCP, etc.) live in the
  // catalog as educational items only.
  const catalog = tools
    .filter((t) => t.category !== ToolCategory.CONCEPT)
    .map((t) => ({ id: t.id, name: t.name, category: t.category }));

  const res = await fetch('/api/generate-stack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal, tools: catalog }),
  });

  if (!res.ok) {
    // Cloudflare returns HTML on 502/504; fall back to a friendly message.
    let message = "I couldn't architect that stack right now. Please try a different goal.";
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      if (res.status === 502 || res.status === 504) {
        message = 'The AI took too long to respond. Try a more specific goal, or try again in a moment.';
      }
    }
    throw new Error(message);
  }

  return (await res.json()) as TechStack;
}
