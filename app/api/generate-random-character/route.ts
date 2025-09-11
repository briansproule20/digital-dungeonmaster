import { openai } from "../../../echo";
import { generateText } from "ai";

export async function POST(req: Request) {
    try {
        console.log("Generate random character API route called");
        const body = await req.json();
        const { userPrompt } = body;
        console.log("Request body:", body);
        console.log("User prompt:", userPrompt);
        console.log("User prompt exists:", !!userPrompt);
        console.log("User prompt length:", userPrompt?.length);
        
        const systemPrompt = `You are a creative D&D character generator. Generate a ${userPrompt ? 'character based on the user\'s ideas and inspiration' : 'completely random'} D&D character with all details filled out. 

CRITICAL: Your response must be ONLY a valid JSON object with no additional text, explanations, or formatting. Return exactly this structure:

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
  "system_prompt": "COMPREHENSIVE AI CHARACTER PROMPT - This should be the longest, most detailed section"
}

CRITICAL: The system_prompt field must be extremely comprehensive and detailed. It should be 3-4 paragraphs long and include:

MANDATORY: The system_prompt MUST begin with "You are [Character Name]," - never start with a title or description.

1. CHARACTER IDENTITY: Full name, race, class, level, and alignment context
2. PERSONALITY & SPEECH: How they talk, their mannerisms, vocabulary, accent, speech patterns
3. BACKSTORY INTEGRATION: Key life experiences, motivations, fears, goals, relationships
4. BEHAVIORAL GUIDELINES: How they react to different situations, their moral compass, decision-making style
5. WORLD CONTEXT: Their place in the D&D world, knowledge level, cultural background
6. INTERACTION STYLE: How they treat friends vs enemies, authority figures, strangers

The system_prompt should give the AI everything needed to roleplay this character authentically in conversations. Include specific examples of how they might respond to common situations.

Make the character interesting, unique, and well-developed. Use creative combinations of races and classes. The system_prompt is the most important field - make it comprehensive and immersive.

IMPORTANT: Return ONLY the JSON object above. No additional text, explanations, or markdown formatting.`;

        let requestPrompt;
        
        if (userPrompt && userPrompt.trim().length > 0) {
            console.log("Using user prompt for guided generation");
            requestPrompt = `Generate a D&D character based on these specific ideas and inspiration: "${userPrompt.trim()}"

IMPORTANT: Use the user's ideas as the foundation for this character. Incorporate their vision directly into the character's design, backstory, personality, and abilities. Don't just loosely inspire - actually build the character around their specific concepts.

Expand their ideas into a complete, well-developed character. Fill out all fields with creative, specific details that incorporate and build upon their exact vision.

MOST IMPORTANT: The system_prompt field should be the longest and most comprehensive section - 3-4 paragraphs that give the AI complete context about who this character is, how they speak, what motivates them, and how they should behave in conversations. This prompt will be used for AI chat interactions, so include everything needed for authentic roleplay.

CRITICAL FORMAT: The system_prompt MUST start with "You are [Character Name]," - never begin with titles, descriptions, or anything else. Always use second person perspective throughout.`;
        } else {
            console.log("Using completely random generation");
            requestPrompt = `Generate a completely random D&D character. Make them unique and interesting with a compelling backstory. Fill out all fields with creative, specific details.

MOST IMPORTANT: The system_prompt field should be the longest and most comprehensive section - 3-4 paragraphs that give the AI complete context about who this character is, how they speak, what motivates them, and how they should behave in conversations. This prompt will be used for AI chat interactions, so include everything needed for authentic roleplay.

CRITICAL FORMAT: The system_prompt MUST start with "You are [Character Name]," - never begin with titles, descriptions, or anything else. Always use second person perspective throughout.`;
        }

        console.log("Final request prompt:", requestPrompt);
        console.log("System prompt:", systemPrompt);

        const result = await generateText({
            model: openai("gpt-4o"), 
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: requestPrompt }
            ],
        });

        console.log("Generated character result:", result.text);

        // Try to parse the JSON response with cleanup
        try {
            let jsonText = result.text.trim();
            
            // Clean up common JSON formatting issues
            // Remove any text before the first {
            const firstBrace = jsonText.indexOf('{');
            if (firstBrace > 0) {
                jsonText = jsonText.substring(firstBrace);
            }
            
            // Remove any text after the last }
            const lastBrace = jsonText.lastIndexOf('}');
            if (lastBrace > 0 && lastBrace < jsonText.length - 1) {
                jsonText = jsonText.substring(0, lastBrace + 1);
            }
            
            // Try to parse the cleaned JSON
            const characterData = JSON.parse(jsonText);
            console.log("Successfully parsed character data:", characterData);
            
            // Validate that we have the required fields
            if (!characterData.name || !characterData.description || !characterData.system_prompt) {
                console.error("Missing required fields in generated character:", characterData);
                throw new Error("Missing required fields in generated character");
            }

            console.log("Returning successfully generated character");
            return new Response(JSON.stringify(characterData), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } catch (parseError) {
            console.error("Failed to parse JSON response:", parseError);
            console.error("Raw response that failed to parse:", result.text);
            console.log("Attempting to extract JSON from response...");
            
            // Try to extract JSON using regex as last resort
            try {
                const jsonMatch = result.text.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const extractedJson = jsonMatch[0];
                    console.log("Extracted JSON:", extractedJson);
                    const characterData = JSON.parse(extractedJson);
                    
                    if (characterData.name && characterData.description && characterData.system_prompt) {
                        console.log("Successfully recovered character from extracted JSON");
                        return new Response(JSON.stringify(characterData), {
                            status: 200,
                            headers: { "Content-Type": "application/json" }
                        });
                    }
                }
            } catch (extractError) {
                console.error("Failed to extract JSON:", extractError);
            }
            
            console.log("All parsing attempts failed, falling back to default character");
            
            // Fallback: return a basic character if JSON parsing fails
            const fallbackCharacter = {
                name: "Kael Shadowstep",
                class: "Rogue",
                race: "Human",
                level: 3,
                alignment: "Chaotic Neutral",
                appearance: "A hooded figure with weathered hands and keen eyes, wearing dark leather armor with hidden daggers",
                description: "A mysterious traveler who keeps their past hidden behind a charming smile and quick wit, always watching the shadows.",
                backstory: "Once the child of a wealthy merchant family, Kael's life changed when bandits attacked their caravan. After escaping and living on the streets, they learned the arts of stealth and survival. Now they wander between cities, seeking both fortune and clues about the bandits who destroyed their old life.",
                personality_traits: ["Cautiously curious", "Quick-witted", "Secretly compassionate"],
                system_prompt: "You are Kael Shadowstep, a 3rd-level Human Rogue with a Chaotic Neutral alignment. You grew up in a merchant family but lost everything to bandits, forcing you to survive on the streets where you learned stealth, lockpicking, and the art of reading people. You speak with wit and charm, often using humor to deflect serious questions about your past. You're naturally curious but cautious, always assessing threats and opportunities. Your speech is clever and sometimes sarcastic, peppered with street slang and merchant terminology from your upbringing. You're secretly compassionate, especially toward other outcasts and those who've lost family, though you hide this behind a roguish exterior. You're motivated by both survival and a deep desire to find the bandits who killed your family. You trust slowly but once earned, your loyalty runs deep. In conversations, you tend to deflect personal questions with jokes, ask probing questions about others, and offer practical advice drawn from street experience. You're comfortable with morally gray situations and believe the ends often justify the means. You respect competence over authority and are always looking for the angle or opportunity in any situation."
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
