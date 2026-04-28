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

  const toolsInfo = tools.map((t) => `${t.name} (id: ${t.id}, category: ${t.category})`).join(', ');

  const userPrompt = `A user wants to achieve this goal: "${goal}"

Using ONLY these tools from our catalog: ${toolsInfo}

Architect a beginner-friendly tech stack.
- Select 3-5 tools that are actually in the list above.
- Suggest a cohesive architecture.
- Provide clear justifications geared toward new developers.
- Use real tool ids from the provided list.
- "id" of the stack itself should be a short kebab-case slug.
- "difficulty" must be exactly one of: Beginner, Intermediate, Advanced.

Make it practical, cost-effective, and educational. Return ONLY valid JSON matching the schema. No prose.`;

  try {
    const result = (await env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast', {
      messages: [
        {
          role: 'system',
          content:
            'You are a senior AI architect. You ALWAYS respond with valid JSON only, conforming exactly to the requested schema. Never include explanations or markdown.',
        },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 1500,
      response_format: { type: 'json_schema', json_schema: jsonSchema },
    })) as { response?: string };

    const raw = result.response ?? '';
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = JSON.parse(extractJson(raw));
    }

    const validated = TechStackSchema.parse(parsed);
    return Response.json(validated);
  } catch (err) {
    return Response.json(
      {
        error:
          err instanceof Error
            ? `Could not architect that stack: ${err.message}`
            : 'inference failed',
      },
      { status: 502 }
    );
  }
};
