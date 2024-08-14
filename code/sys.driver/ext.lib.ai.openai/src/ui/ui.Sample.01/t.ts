import type { t } from './common';
export type * from '../common/t';

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

/**
 * UI Components
 */
export type SampleEnv = {
  store: t.Store;
  docuri: string;
  accessToken?: string;
};

export type SampleProps = {
  text?: string;
  env?: t.SampleEnv;
  style?: t.CssValue;
  onChange?: t.EditorEventHandler;
  onCmdEnterKey?: t.EditorEventHandler;
};

export type EditorEventHandler = (e: EditorEventHandlerArgs) => void;
export type EditorEventHandlerArgs = {
  content: t.EditorContent;
  selections: t.EditorSelection[];
};
