/**
 * Message
 */
export type Message = { role: ChatCompletionRole; content: string };
export type MessagePayload = { messages: Message[] };

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
