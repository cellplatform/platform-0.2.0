export type ChatCompletionRole = 'system' | 'user' | 'assistant' | 'tool' | 'function';
export type Message = { role: ChatCompletionRole; content: string };
export type MessagePayload = { messages: Message[] };
