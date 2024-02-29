import OpenAI from 'npm:openai';
export { OpenAI };

export * from '../common/mod.ts';
export * from './u.is.ts';

export const DEFAULTS = { model: 'gpt-3.5-turbo' } as const;
