#!/usr/bin/env ts-node

import dotenv from 'dotenv';
dotenv.config();

type DotEnv = {
  OPENAI_SECRET_KEY: string;
};

const env = process.env as DotEnv;
const API_KEY = env.OPENAI_SECRET_KEY;

console.log('API_KEY', API_KEY);
