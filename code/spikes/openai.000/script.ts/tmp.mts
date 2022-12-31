#!/usr/bin/env ts-node

import pc from 'picocolors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

type DotEnv = {
  OPENAI_SECRET_KEY: string;
};

dotenv.config();
const env = process.env as DotEnv;
const apiKey = env.OPENAI_SECRET_KEY;

const configuration = new Configuration({ apiKey });
const openai = new OpenAIApi(configuration);
const res = await openai.listModels();

console.info();
console.info(pc.green(`OpenAI test models:`));
res.data.data.map((item, i) => {
  console.info(pc.gray(` | model: "${pc.white(item.id)}"`));
});
console.info();

try {
  const prompt = "make a list of 5 members of the ARPA community from the 1960's";
  const completion = await openai.createCompletion({
    model: 'davinci',
    prompt,
    stream: false,
    max_tokens: 100,
  });
  console.log('completion.data', completion.data);
} catch (error: any) {
  console.log('error', error.message);
}
