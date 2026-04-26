import { google } from '@ai-sdk/google';
import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { AITool, TechStack } from '../types';

const model = google('gemini-1.5-flash');

// Schema for structured stack generation
const TechStackSchema = z.object({
  id: z.string(),
  stackName: z.string(),
  description: z.string(),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  estimatedCost: z.string(),
  tools: z.array(z.object({
    id: z.string(),
    name: z.string(),
    justification: z.string(),
  })),
  connections: z.array(z.object({
    from: z.string(),
    to: z.string(),
    label: z.string(),
  })).optional(),
});

export async function getToolDetails(toolName: string): Promise<string> {
  try {
    const { text } = await generateText({
      model,
      prompt: `Explain the AI technology or tool "${toolName}" for a total beginner.
Break it down into:
- 💡 What is it? (Use a simple analogy)
- 🚀 Why it's a "Game Changer"
- 🛠️ Typical Use Cases for New Developers
- 📈 Difficulty & Learning Path

Format nicely in Markdown. Use emojis to keep it engaging. Be accurate and reference the tool's role in the broader AI ecosystem.`,
    });
    return text;
  } catch (error) {
    console.error(`Error fetching details for ${toolName}:`, error);
    return "Failed to load deep-dive details. Check your connection or API key.";
  }
}

export async function generateGuidedStack(goal: string, tools: AITool[]): Promise<TechStack> {
  const toolsInfo = tools.map(t => `${t.name} (id: ${t.id}, category: ${t.category})`).join(', ');

  try {
    const { object } = await generateObject({
      model,
      schema: TechStackSchema,
      prompt: `A user wants to achieve this goal: "${goal}"

Using ONLY these tools from our catalog: ${toolsInfo}

Architect a beginner-friendly tech stack.
- Select 3-5 tools that are actually in the list above.
- Suggest a cohesive architecture.
- Provide clear justifications geared toward new developers.
- Use real tool ids from the provided list.

Make it practical, cost-effective, and educational.`,
    });

    return object as TechStack;
  } catch (error) {
    console.error("Stack Generation Error:", error);
    throw new Error("I couldn't architect that stack right now. Please try a different goal.");
  }
}
