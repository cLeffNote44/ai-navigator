interface Env {
  AI: Ai;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let toolName: string;
  try {
    const body = (await request.json()) as { toolName?: unknown };
    if (typeof body.toolName !== 'string' || !body.toolName.trim()) {
      return Response.json({ error: 'toolName is required' }, { status: 400 });
    }
    toolName = body.toolName.trim().slice(0, 200);
  } catch {
    return Response.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  const prompt = `Explain the AI technology or tool "${toolName}" for a total beginner.
Break it down into:
- 💡 What is it? (Use a simple analogy)
- 🚀 Why it's a "Game Changer"
- 🛠️ Typical Use Cases for New Developers
- 📈 Difficulty & Learning Path

Format nicely in Markdown. Use emojis to keep it engaging. Be accurate and reference the tool's role in the broader AI ecosystem.`;

  try {
    const result = await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'system', content: 'You are an expert AI educator who writes clear, beginner-friendly explanations of AI tools and technologies.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1024,
    });

    const text = (result as { response?: string }).response ?? '';
    return Response.json({ text });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'inference failed' },
      { status: 502 }
    );
  }
};
