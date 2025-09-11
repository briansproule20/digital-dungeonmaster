import { openai } from "../../../echo";
import { generateText } from "ai";

export async function POST(req: Request) {
    try {
        console.log("Generate backstory API route called");
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
        if (characterData.personality_traits && characterData.personality_traits.length > 0) {
            characterInfo.push(`Personality Traits: ${characterData.personality_traits.join(', ')}`);
        }

        const characterContext = characterInfo.join('\n');
        
        const systemPrompt = `You are a creative D&D character writer specializing in compelling backstories. Generate a detailed backstory based on the provided character details.

Focus on creating a rich narrative that:
- Explains how they became their current class and level
- Incorporates their race's cultural background and experiences
- Reflects their alignment through past choices and events
- Shows how their personality traits developed
- Includes formative experiences, relationships, and conflicts
- Provides motivation for their current adventures
- Connects their appearance to their life experiences

The backstory should be engaging, specific, and provide depth that enhances roleplay opportunities. Write it as a cohesive narrative paragraph or two that brings the character to life.`;

        const userPrompt = `Generate a compelling backstory for this D&D character:

${characterContext}

Create a rich narrative that explains their background, how they developed their skills and personality, key life events that shaped them, and what motivates them. Make it specific and engaging, incorporating all their character details naturally.`;

        const result = await generateText({
            model: openai("gpt-4o"), 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
        });

        console.log("Generated backstory:", result.text);

        return new Response(result.text, {
            status: 200,
            headers: { "Content-Type": "text/plain" }
        });
    } catch (error) {
        console.error("Generate backstory API error:", error);
        return new Response("Sorry, I encountered an error generating the backstory. Please try again.", {
            status: 500,
            headers: { "Content-Type": "text/plain" }
        });
    }
}
