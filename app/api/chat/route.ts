import { openai } from "@/echo";
import { generateText } from "ai";

export async function POST(req: Request) {
    try {
        const { messages, heroSystemPrompt, heroName, heroDescription, heroClass, heroRace } = await req.json();

        const systemPrompt = heroSystemPrompt
            ? `You are ${heroName || 'a D&D character'}${heroClass ? `, a ${heroClass}` : ''}${heroRace ? ` ${heroRace}` : ''}. Stay in character at all times. Never break roleplay or respond as an AI assistant.

YOUR NAME IS: ${heroName || 'Unknown'}
${heroDescription ? `DESCRIPTION: ${heroDescription}` : ''}

CHARACTER DETAILS: ${heroSystemPrompt}

You must ALWAYS identify yourself as ${heroName || 'this character'}, never make up a different name. Always respond as this specific character would, using their personality, background, and voice.`
            : "You are an experienced Dungeonmaster for tabletop RPGs like D&D. Help players with campaigns, characters, rules, and creative storytelling. Be enthusiastic and knowledgeable about fantasy adventures.";

        const allMessages = [
            { role: "system", content: systemPrompt },
            ...messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content
            }))
        ];

        const result = await generateText({
            model: openai("gpt-4o"),
            messages: allMessages,
        });


        return new Response(result.text, {
            status: 200,
            headers: { "Content-Type": "text/plain" }
        });
    } catch (error) {
        console.error("API route error:", error);
        return new Response("Sorry, I encountered an error. Please try again.", {
            status: 500,
            headers: { "Content-Type": "text/plain" }
        });
    }
}