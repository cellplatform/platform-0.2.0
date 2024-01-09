import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import { R } from './common.mjs';

/**
 * Setup API client.
 */
dotenv.config();
const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

/**
 * Helpers
 */
const Print = {
  error(error: any) {
    console.log('error', error);
    console.log('-------------------------------------------');
    console.log('error.status', error.status);
    console.log('error', error.message);
  },

  async models() {
    const res = await openai.listModels();
    const list = res.data.data;
    list.forEach((item) => console.log(' > model:', item.id));
  },
};

export async function askGtp(
  prompt: string,
  options: { temperature?: number; model?: string } = {},
) {
  const temperature = R.clamp(0, 1, options.temperature ?? 0.5);
  const model = options.model ?? 'gpt-3.5-turbo';

  const res = await openai.createChatCompletion({
    model,
    temperature,
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: prompt },
    ],
  });

  const data = res.data;
  console.log('res.status;', res.status);
  console.log('data.model', data.model);
  console.log('data.usage', data.usage);
  console.log('data.choices', data.choices);

  return res;
}

try {
  // const m = await openai.listModels();

  await Print.models();

  console.log('-------------------------------------------');
  const prompt = `
write a haiku about camping with friends, and the bonds physical discomfort in the great 
outdoors can create a strong bonding and possibly spiritual experience of community  
  `;

  const res = await askGtp(prompt);

  const choices = res.data.choices;

  console.log('choices', choices);
} catch (error: any) {
  Print.error(error);
}
