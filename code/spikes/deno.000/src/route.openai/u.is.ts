// deno-lint-ignore-file no-explicit-any
import { Http, type t } from '../common/mod.ts';

export const Is = {
  statusOK: Http.statusOK,

  messagePayload(input: any): input is t.MessagePayload {
    if (input === null || typeof input !== 'object') return false;
    if (!Array.isArray(input.messages)) return false;
    if (input.messages.every((item: t.Message) => Is.message(item))) return false;
    return true;
  },

  message(input: any): input is t.Message {
    if (input === null || typeof input !== 'object') return false;
    return typeof input.role === 'string' && input.content === 'string';
  },
} as const;
