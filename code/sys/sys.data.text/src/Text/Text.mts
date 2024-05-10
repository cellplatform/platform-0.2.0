import { t, Yaml } from '../common';
import { TextProcessor as Processor } from '../Text.Processor';
import { Is } from './Text.Is.mjs';
import { Markdown } from '../Markdown';
import { Fuzzy } from '../Fuzzy';

/**
 * Module Root Index
 */
export const Text: t.Text = {
  Is,
  Processor,
  Markdown,
  Yaml,
  Fuzzy,
};
