import { openai } from "@/echo";
import { generateText } from "ai";

export async function POST(req: Request) {
    try {
        const { heroData } = await req.json();

        const { name, backstory, class: heroClass, race, level, alignment, appearance, personality_traits } = heroData;

        if (!name || !backstory) {
            return new Response("Name and backstory are required", { status: 400 });
        }

        // Create detailed prompt for generating description and system prompt
        const generationPrompt = `Based on the following D&D character information, generate a description and system prompt:

CHARACTER INFO:
- Name: ${name}
- Class: ${heroClass || 'Unknown'}
- Race: ${race || 'Unknown'}
- Level: ${level || 1}
- Alignment: ${alignment || 'Unknown'}
- Appearance: ${appearance || 'Not specified'}
- Personality Traits: ${personality_traits?.join(', ') || 'None specified'}
- Backstory: ${backstory}

Generate a JSON response with exactly this format:
{
  "description": "A 2-3 sentence character description that summarizes who they are and what makes them interesting",
  "system_prompt": "A comprehensive AI character prompt that follows proper roleplay format"
}

CRITICAL REQUIREMENTS FOR SYSTEM PROMPT:
- Must start with "You are ${name}, a ${heroClass || 'character'} ${race || 'being'}"
- Include explicit roleplay instructions: "Stay in character at all times. Never break roleplay or respond as an AI assistant."
- Include character's name, background, personality, and how they should speak/behave
- Include the backstory details and personality traits
- Be 3-4 paragraphs long with specific behavioral instructions
- End with "Always respond as ${name} would, using their personality, background, and voice."

Make the character compelling and well-developed based on their backstory.

Return ONLY the JSON object, no additional text or formatting.`;

        const result = await generateText({
            model: openai("gpt-4o"),
            messages: [
                { role: "system", content: "You are a D&D character generator. Generate compelling character descriptions and detailed roleplay system prompts." },
                { role: "user", content: generationPrompt }
            ],
        });

        try {
            const generatedData = JSON.parse(result.text);

            if (!generatedData.description || !generatedData.system_prompt) {
                throw new Error("Missing required fields in generated data");
            }

            return new Response(JSON.stringify(generatedData), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (parseError) {
            console.error("Failed to parse generated JSON:", result.text);

            // Fallback: create basic description and system prompt
            const fallbackData = {
                description: `${name} is a ${level ? `Level ${level} ` : ''}${race || ''} ${heroClass || 'character'} with an interesting background. ${backstory.substring(0, 100)}...`,
                system_prompt: `You are ${name}, a ${heroClass || 'character'} ${race || 'being'}. Stay in character at all times. Never break roleplay or respond as an AI assistant.\n\nBACKGROUND: ${backstory}\n\nAlways respond as ${name} would, using their personality, background, and voice.`
            };

            return new Response(JSON.stringify(fallbackData), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (error) {
        console.error("API route error:", error);
        return new Response("Failed to generate character details", {
            status: 500,
            headers: { "Content-Type": "text/plain" }
        });
    }
}