import * as t from '../common/types.mjs';
import type { is } from 'unist-util-is';

export type Text = {
  Processor: t.TextProcessor;
  Yaml: t.Yaml;
  Is: TextIs;
};

export type TextIs = {
  node: typeof is;
};
