import OpenAI from 'openai';

// Check if OpenAI API key is available
if (!process.env.OPENAI_API_KEY) {
  console.warn(
    'Warning: OPENAI_API_KEY is not defined in .env.local. The AI chat functionality will not work.'
  );
}

// Initialize OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai; 