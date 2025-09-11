import { openai } from "@/echo";
import { generateText } from "ai";

export async function POST(req: Request) {
    try {
        console.log("API route called");
        const { messages, heroSystemPrompt } = await req.json();
        console.log("Received messages:", messages);
        console.log("Hero system prompt:", heroSystemPrompt);
        
        const systemPrompt = heroSystemPrompt || "You are an experienced Dungeonmaster for tabletop RPGs like D&D. Help players with campaigns, characters, rules, and creative storytelling. Be enthusiastic and knowledgeable about fantasy adventures.";

        const allMessages = [
            { role: "system", content: systemPrompt },
            ...messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content
            }))
        ];
        console.log("All messages:", allMessages);

        const result = await generateText({
            model: openai("gpt-4o"), 
            messages: allMessages,
        });

        console.log("Generated response:", result.text);

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