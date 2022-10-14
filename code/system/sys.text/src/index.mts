import { Yaml } from './common/index.mjs';
import { TextProcessor } from './TextProcessor/TextProcessor.mjs';

/**
 * Exports
 */
export { Pkg } from './index.pkg.mjs';
export { TextProcessor };
export { Markdown, Markdown as default } from './Markdown/index.mjs';

/**
 *
 * Module Root Index
 * :> sys.text
 *
 */
export const Text = {
  Yaml,
  Processor: TextProcessor,
};
