import type { is } from 'unist-util-is';
import type { t } from '../common';

export type Text = {
  Is: TextIs;
  Processor: t.TextProcessor;
  Markdown: t.Markdown;
  Yaml: t.Yaml;
  Fuzzy: t.Fuzzy;
};

export type TextIs = {
  node: typeof is;
};
