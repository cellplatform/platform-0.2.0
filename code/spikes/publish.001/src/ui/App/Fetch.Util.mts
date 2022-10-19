export type UrlPathString = string;

import { Text } from 'sys.text';

const processor = Text.Processor.markdown();

export const FetchUtil = {
  async markdown(path: UrlPathString) {
    const res = await fetch(path);
    const text = await res.text();
    const md = await processor.toHtml(text);
    return md;
  },

  async json(path: UrlPathString) {
    const res = await fetch(path);
    const text = await res.text();
    return JSON.parse(text);
  },
};
