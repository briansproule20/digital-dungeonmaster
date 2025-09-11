import { openai } from "../../../echo";
import { generateText } from "ai";

export async function POST(req: Request) {
    try {
        console.log("Generate system prompt API route called");
        const { characterData } = await req.json();
        console.log("Character data:", characterData);
        
        // Build character context from the form data
        const characterInfo = [];
        if (characterData.name) characterInfo.push(`Name: ${characterData.name}`);
        if (characterData.race) characterInfo.push(`Race: ${characterData.race}`);
        if (characterData.class) characterInfo.push(`Class: ${characterData.class}`);
        if (characterData.level) characterInfo.push(`Level: ${characterData.level}`);
        if (characterData.alignment) characterInfo.push(`Alignment: ${characterData.alignment}`);
        if (characterData.appearance) characterInfo.push(`Appearance: ${characterData.appearance}`);
        if (characterData.description) characterInfo.push(`Description: ${characterData.description}`);
        if (characterData.backstory) characterInfo.push(`Backstory: ${characterData.backstory}`);
        if (characterData.personality_traits && characterData.personality_traits.length > 0) {
            characterInfo.push(`Personality Traits: ${characterData.personality_traits.join(', ')}`);
        }

        const characterContext = characterInfo.join('\n');
        
        const systemPrompt = `You are a creative D&D character writer specializing in AI system prompts. Generate a comprehensive system prompt for AI chat interactions based on the provided character details.

CRITICAL REQUIREMENTS:
- The system prompt MUST begin with "You are [Character Name]," - never start with titles or descriptions
- Use second person perspective throughout ("You are", "You speak", "You believe")
- Make it 3-4 paragraphs long with complete character context
- Include specific speech patterns, mannerisms, and behavioral guidelines
- Incorporate all provided character details naturally

The system prompt should include:
1. Character identity with race, class, level, alignment
2. Personality and speech patterns 
3. Backstory integration and motivations
4. Behavioral guidelines for different situations
5. How they interact with others
6. Specific examples of how they might respond

Make it comprehensive enough for authentic AI roleplay conversations.`;

        const userPrompt = `Generate a comprehensive AI system prompt for this D&D character:

${characterContext}

CRITICAL: The system prompt must start with "You are [Character Name]," and be written in second person perspective. Make it detailed enough for authentic AI chat roleplay, incorporating all the character's details, personality, and background into how they should behave and speak in conversations.`;

        const result = await generateText({
            model: openai("gpt-4o"), 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
        });

        console.log("Generated system prompt:", result.text);

        return new Response(result.text, {
            status: 200,
            headers: { "Content-Type": "text/plain" }
        });
    } catch (error) {
        console.error("Generate system prompt API error:", error);
        return new Response("Sorry, I encountered an error generating the system prompt. Please try again.", {
            status: 500,
            headers: { "Content-Type": "text/plain" }
        });
    }
}
