import { AITool, TechStack } from '../types';

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
  const catalog = tools.map((t) => ({ id: t.id, name: t.name, category: t.category }));

  const res = await fetch('/api/generate-stack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal, tools: catalog }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "I couldn't architect that stack right now. Please try a different goal.");
  }

  return (await res.json()) as TechStack;
}
