import { z } from 'zod';

interface Env {
  AI: Ai;
}

interface CatalogTool {
  id: string;
  name: string;
  category: string;
}

const INFERENCE_TIMEOUT_MS = 30_000;
const MAX_GOAL_LENGTH = 500;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('inference timeout')), ms)
    ),
  ]);
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
    if (body.goal.trim().length > MAX_GOAL_LENGTH) {
      return Response.json(
        { error: `goal must be ${MAX_GOAL_LENGTH} characters or fewer` },
        { status: 400 }
      );
    }
    if (!Array.isArray(body.tools) || body.tools.length === 0) {
      return Response.json({ error: 'tools catalog is required' }, { status: 400 });
    }
    goal = body.goal.trim();
    tools = body.tools as CatalogTool[];
  } catch {
    return Response.json({ error: 'invalid JSON body' }, { status: 400 });
  }

  // Compact catalog representation - one line per tool, terse format.
  const toolsInfo = tools.map((t) => `${t.id}|${t.name}|${t.category}`).join('\n');

  // Worked example using an UNRELATED goal so the model adapts to the actual
  // user goal instead of copying values verbatim. Keys demonstrate exact casing.
  const jsonExample = `{
  "id": "img-pipeline-demo",
  "stackName": "Personalized Product Image Pipeline",
  "description": "Generates branded product images at scale using a fine-tuned diffusion model and CDN delivery.",
  "difficulty": "Intermediate",
  "estimatedCost": "~$10-30/month at moderate volume",
  "tools": [
    {"id": "flux-pro", "name": "Flux 1.1 Pro", "justification": "Generates the product images with strong prompt adherence."},
    {"id": "replicate", "name": "Replicate", "justification": "Hosts and bills per-second for the inference."}
  ],
  "connections": [
    {"from": "replicate", "to": "flux-pro", "label": "runs inference"}
  ]
}`;

  const userPrompt = `Goal: "${goal}"

Tools you may pick from (id|name|category, one per line):
${toolsInfo}

Pick 3-5 tools FROM THIS LIST that fit the goal above. Use the exact ids shown.

Below is a SHAPE EXAMPLE for an UNRELATED goal — match the structure, do NOT copy any values.
${jsonExample}

Hard rules for YOUR response:
- ALL string fields use proper sentence case or Title Case as shown — NEVER lowercase or kebab-case in human-readable fields.
- "id" (the stack id, top level) IS kebab-case lowercase, e.g. "ai-customer-chatbot".
- "stackName" is Title Case, e.g. "AI Customer Service Chatbot" — NEVER kebab-case.
- "description" is 1-2 complete sentences starting with a capital letter and ending in a period.
- "difficulty" is exactly: Beginner, Intermediate, or Advanced.
- Every tool "id" MUST appear verbatim in the list above.
- "justification" is one complete sentence, beginner-friendly.
- "estimatedCost" is a short human phrase (e.g. "Free tier covers most usage", "~$5/month").`;

  const systemPrompt =
    'You output ONLY valid JSON, nothing else. No prose, no markdown fences. Adapt the example structure to the user\'s actual goal — never copy example values.';

  async function callModel(): Promise<unknown> {
    // 8B-fast: ~10x faster than 70B-fp8-fast, plenty smart for "pick from list" tasks.
    // Drop json_schema mode (slow, often unsupported on smaller models) in favor of
    // json_object + concrete example in the prompt.
    const result = (await withTimeout(
      env.AI.run('@cf/meta/llama-3.1-8b-instruct-fast', {
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 800,
        response_format: { type: 'json_object' },
      }),
      INFERENCE_TIMEOUT_MS
    )) as { response?: string };

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

  const timedOut =
    lastError instanceof Error && lastError.message === 'inference timeout';
  return Response.json(
    {
      error: timedOut
        ? 'The AI took too long to respond. Please try again.'
        : 'The AI returned an invalid stack format. Try a different goal phrasing.',
    },
    { status: timedOut ? 504 : 502 }
  );
};
