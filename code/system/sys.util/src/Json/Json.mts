import { type t } from '../common';

export const Json = {
  stringify(input: t.Json) {
    if (input === undefined) throw new Error(`[undefined] is not valid JSON input`);
    const text = JSON.stringify(input, null, 2);
    return text.includes('\n') ? `${text}\n` : text; // NB: trailing "new-line" only added if the JSON spans more than a single line
  },
};
