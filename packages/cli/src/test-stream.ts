import { createDeepSeek } from '@ai-sdk/deepseek'
import { streamText } from 'ai'

async function testStream() {
  const apiKey = 'sk-fd5741afcaa6489babb509913b0c827d';
  console.log('Testing streaming with DeepSeek...');
  
  const deepseek = createDeepSeek({ apiKey })
  const model = deepseek('deepseek-chat')
  
  try {
    const result = streamText({
      model,
      prompt: 'Hello, tell me a 1-sentence joke about coding without any emojis.',
      temperature: 0.3,
      maxOutputTokens: 100
    });
    
    console.log('Iterating over textStream:');
    for await (const chunk of result.textStream) {
      console.log('Chunk:', JSON.stringify(chunk));
    }
    
    console.log('Stream completed.');
  } catch (err: any) {
    console.error('Error:', err);
  }
}

testStream();
