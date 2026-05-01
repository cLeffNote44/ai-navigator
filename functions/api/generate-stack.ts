import { z } from 'zod';

interface Env {
  AI: Ai;
}

interface CatalogTool {
  id: string;
  name: string;
  category: string;
}

const TechStackSchema = z.object({
  id: z.string(),
  stackName: z.string(),
  description: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  estimatedCost: z.string(),
  tools: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        justification: z.string(),
      })
    )
    .min(1),
  connections: z
    .array(
      z.object({
        from: z.string(),
        to: z.string(),
        label: z.string(),
      })
    )
    .optional(),
});

const jsonSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    stackName: { type: 'string' },
    description: { type: 'string' },
    difficulty: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'] },
    estimatedCost: { type: 'string' },
    tools: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          justification: { type: 'string' },
        },
        required: ['id', 'name', 'justification'],
      },
    },
    connections: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          to: { type: 'string' },
          label: { type: 'string' },
        },
        required: ['from', 'to', 'label'],
      },
    },
  },
  required: ['id', 'stackName', 'description', 'difficulty', 'estimatedCost', 'tools'],
};

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) return text.slice(start, end + 1);
  return text;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let goal: string;
  let tools: CatalogTool[];
  try {
    const body = (await request.json()) as { goal?: unknown; tools?: unknown };
    if (typeof body.goal !== 'string' || !body.goal.trim()) {
      return Response.json({ error: 'goal is required' }, { status: 400 });
    }
    if (!Array.isArray(body.tools) || body.tools.length === 0) {
      return Response.json({ error: 'tools catalog is required' }, { status: 400 });
    }
    goal = body.goal.trim().slice(0, 500);
    tools = body.tools as CatalogTool[];
  } catch {
    return Response.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  // Compact catalog representation - one line per tool, terse format.
  // Cuts the prompt size roughly in half vs. the full "name (id: x, category: y)" form.
  const toolsInfo = tools.map((t) => `${t.id}|${t.name}|${t.category}`).join('\n');

  const userPrompt = `Goal: "${goal}"

Catalog (id|name|category, one per line):
${toolsInfo}

Architect a beginner-friendly tech stack of 3-5 tools FROM THE CATALOG ABOVE.
- Use real ids exactly as given.
- "difficulty" must be exactly: Beginner, Intermediate, or Advanced.
- "id" for the stack is a short kebab-case slug.
- Be concise. Return ONLY JSON matching the schema. No prose, no markdown fence.`;

  const systemPrompt =
    'You are an AI architect. Reply with VALID JSON ONLY matching the schema. No explanations, no markdown fences.';

  async function callModel(): Promise<unknown> {
    const result = (await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 800,
      response_format: { type: 'json_schema', json_schema: jsonSchema },
    })) as { response?: string };

    const raw = result.response ?? '';
    try {
      return JSON.parse(raw);
    } catch {
      return JSON.parse(extractJson(raw));
    }
  }

  // One model call + one retry on parse/validation failure.
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const parsed = await callModel();
      const validated = TechStackSchema.parse(parsed);
      return Response.json(validated);
    } catch (err) {
      lastError = err;
    }
  }

  return Response.json(
    {
      error:
        lastError instanceof Error
          ? `The AI returned an invalid stack format. Try a different goal phrasing.`
          : 'inference failed',
    },
    { status: 502 }
  );
};
