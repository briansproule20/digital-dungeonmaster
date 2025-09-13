import { openai } from '@/echo';
import { experimental_generateImage as generateImage } from 'ai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log('Received prompt:', prompt);

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Add system prompt to ensure character is centered for circular avatar
    const systemPrompt = "high quality digital painting, face and upper body centered in frame, tight crop showing head and shoulders, ideal for circular avatar or D&D token, detailed character design, centered composition";
    const fullPrompt = `${systemPrompt}, ${prompt}`;
    
    console.log('Generating image with model: gpt-image-1');
    console.log('Full prompt:', fullPrompt);
    const result = await generateImage({
      model: openai.image('gpt-image-1'),
      prompt: fullPrompt,
    });

    console.log('Generated result:', result);
    console.log('Image URL:', result.image);

    return Response.json({ imageUrl: result.image });
  } catch (error) {
    console.error('Error generating avatar:', error);
    return Response.json({ error: 'Failed to generate avatar', details: error.message }, { status: 500 });
  }
}
