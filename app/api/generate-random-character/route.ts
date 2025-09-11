import { openai } from "@/echo";
import { generateText } from "ai";

export async function POST(req: Request) {
    try {
        console.log("Generate random character API route called");
        
        const systemPrompt = `You are a creative D&D character generator. Generate a completely random, interesting D&D character with all details filled out. Return the response as a valid JSON object with the following structure:

{
  "name": "Character name",
  "class": "D&D class",
  "race": "D&D race", 
  "level": number (1-10),
  "alignment": "One of the 9 D&D alignments",
  "appearance": "Physical description",
  "description": "2-3 sentence character description",
  "backstory": "Detailed backstory paragraph",
  "personality_traits": ["trait1", "trait2", "trait3"],
  "system_prompt": "How this character should behave in conversations"
}

Make the character interesting, unique, and well-developed. Use creative combinations of races and classes. Include specific details that make them memorable. The system_prompt should capture their personality and speaking style for AI conversations.`;

        const userPrompt = `Generate a completely random D&D character. Make them unique and interesting with a compelling backstory. Fill out all fields with creative, specific details.`;

        const result = await generateText({
            model: openai("gpt-4o"), 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
        });

        console.log("Generated character:", result.text);

        // Try to parse the JSON response
        try {
            const characterData = JSON.parse(result.text);
            
            // Validate that we have the required fields
            if (!characterData.name || !characterData.description || !characterData.system_prompt) {
                throw new Error("Missing required fields in generated character");
            }

            return new Response(JSON.stringify(characterData), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (parseError) {
            console.error("Failed to parse JSON response:", parseError);
            console.error("Raw response:", result.text);
            
            // Fallback: return a basic character if JSON parsing fails
            const fallbackCharacter = {
                name: "Mysterious Wanderer",
                class: "Rogue",
                race: "Human",
                level: 1,
                alignment: "Chaotic Neutral",
                appearance: "A hooded figure with weathered hands and keen eyes",
                description: "A mysterious traveler who keeps their past hidden behind a charming smile and quick wit.",
                backstory: "Once a merchant's child, they turned to adventure after their family's caravan was attacked by bandits. Now they wander the roads, seeking both fortune and the truth about that fateful night.",
                personality_traits: ["Curious", "Cautious", "Quick-witted"],
                system_prompt: "You are a mysterious but friendly rogue who speaks with wit and charm. You're cautious about revealing personal details but enjoy clever banter and helping others with their problems."
            };

            return new Response(JSON.stringify(fallbackCharacter), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (error) {
        console.error("Generate random character API error:", error);
        return new Response("Sorry, I encountered an error generating the character. Please try again.", {
            status: 500,
            headers: { "Content-Type": "text/plain" }
        });
    }
}
