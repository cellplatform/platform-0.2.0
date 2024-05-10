import { t, Yaml } from '../common';
import { Fuzzy } from '../Fuzzy';
import { Markdown } from '../Markdown';
import { TextProcessor as Processor } from '../Text.Processor';
import { Is } from './Text.Is';

/**
 * API
 */
export const Text: t.Text = {
  Is,
  Processor,
  Markdown,
  Yaml,
  Fuzzy,
};
