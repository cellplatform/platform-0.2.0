import type { Hono } from 'npm:hono';
import type { Env, BlankSchema } from 'npm:hono/types';

export type HonoApp = Hono<Env, BlankSchema, '/'>;

/**
 * https://platform.openai.com/docs
 */
export type ModelName = 'gpt-3.5-turbo' | 'gtp-4';
export type ModelListItem = {
  id: string;
  created: number;
  ownedBy: 'system' | 'openai' | 'openai-internal';
};

/**
 * Message
 */
export type Message = { role: ChatCompletionRole; content: string };
export type MessagePayload = {
  model?: ModelName;
  messages: Message[];
};

/**
 * Chat Completion
 */
export type ChatCompletionRole = 'system' | 'user' | 'assistant' | 'tool' | 'function';
export type CompletionChoice = { index: number; message: Message };
export type Completion = {
  id: string;
  created: number;
  object: string;
  model: string;
  choices: CompletionChoice[];
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
};
