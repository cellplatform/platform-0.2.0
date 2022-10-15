import { Yaml } from './common/index.mjs';
import { TextProcessor } from './TextProcessor/TextProcessor.mjs';

/**
 * Exports
 */
export { Pkg } from './index.pkg.mjs';
export { TextProcessor };

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
