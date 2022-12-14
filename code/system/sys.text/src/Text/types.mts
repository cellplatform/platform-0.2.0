import * as t from '../common/types.mjs';
import type { is } from 'unist-util-is';

export type Text = {
  Is: TextIs;
  Processor: t.TextProcessor;
  Markdown: t.Markdown;
  Yaml: t.Yaml;
};

export type TextIs = {
  node: typeof is;
};
