import { callModel } from './generate.js'
import { MODELS } from './models.js'

async function runTest() {
  console.log('--- LOCAL AI GENERATION TEST ---')
  
  const provider = process.argv[2] || 'google'
  const apiKey = process.argv[3] || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.DEEPSEEK_API_KEY
  
  if (!apiKey && provider !== 'ollama') {
    console.error('Error: Please provide an API key as an argument or in environment variables.')
    console.log('Usage: bun src/test-local.ts [google|deepseek|ollama] [YOUR_API_KEY]')
    process.exit(1)
  }
  
  const modelConfig = MODELS.find(m => m.provider === provider)
  if (!modelConfig) {
    console.error(`Error: Provider ${provider} not found in model configurations.`)
    process.exit(1)
  }
  
  console.log(`Using model: ${modelConfig.label} (${modelConfig.modelId})`)
  console.log('Sending prompt: "Hello, tell me a 1-sentence joke about coding without any emojis."')
  console.log('Response stream:')
  
  try {
    const prompt = 'Hello, tell me a 1-sentence joke about coding without any emojis.'
    const response = await callModel(
      modelConfig,
      apiKey || null,
      prompt,
      (chunk) => process.stdout.write(chunk)
    )
    console.log('\n\n--- TEST SUCCESSFUL ---')
    console.log(`Full response length: ${response.length} characters`)
  } catch (error: any) {
    console.error('\n\n--- TEST FAILED ---')
    console.error(error)
    process.exit(1)
  }
}

runTest()
