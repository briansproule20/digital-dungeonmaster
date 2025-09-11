import { openai } from "@/echo";
import { generateText } from "ai";

export async function POST(req: Request) {
    try {
        console.log("Generate description API route called");
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
        if (characterData.backstory) characterInfo.push(`Backstory: ${characterData.backstory}`);
        if (characterData.personality_traits && characterData.personality_traits.length > 0) {
            characterInfo.push(`Personality Traits: ${characterData.personality_traits.join(', ')}`);
        }

        const characterContext = characterInfo.join('\n');
        
        const systemPrompt = `You are a creative D&D character writer. Generate a compelling, vivid character description based on the provided character details. The description should be 2-3 sentences long, capturing the essence of the character's appearance, personality, and background. Make it engaging and suitable for a D&D character sheet.

When generating the description, heavily consider and incorporate:
- Race: How their racial features and heritage show in their appearance and demeanor
- Class: How their profession/training affects their bearing, gear, and presence
- Level: Their experience level should reflect in their confidence and weathering
- Background/Backstory: Key life experiences that shaped them and show in their character
- Personality Traits: How their personality traits affect their behavior and interactions
- Alignment: How their alignment affects their behavior and interactions
- Appearance: How their appearance affects their behavior and interactions

Focus on:
- Physical appearance influenced by race and class
- Demeanor and confidence reflecting their level and experience
- Subtle hints of their background and life experiences
- What makes them memorable and unique

Keep it concise but evocative, weaving together all the character elements.`;

        const userPrompt = `Generate a character description for this D&D character:

${characterContext}

Please provide a brief but compelling description that incorporates their race, class, level, and background. Show how these elements come together in their appearance, bearing, and presence. Make it suitable for a character sheet but vivid and memorable.`;

        const result = await generateText({
            model: openai("gpt-4o"), 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
        });

        console.log("Generated description:", result.text);

        return new Response(result.text, {
            status: 200,
            headers: { "Content-Type": "text/plain" }
        });
    } catch (error) {
        console.error("Generate description API error:", error);
        return new Response("Sorry, I encountered an error generating the description. Please try again.", {
            status: 500,
            headers: { "Content-Type": "text/plain" }
        });
    }
}
