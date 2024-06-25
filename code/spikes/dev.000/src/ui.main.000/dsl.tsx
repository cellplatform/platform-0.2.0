import { Args, type t } from './common';

/**
 * Sketch of what an implementation for the command-line parser
 * DSL will end up looking like.
 *
 * NOTE:
 *    Itentional "naive" implmentation to spot patterns before
 *    the actual structure presents itself, or is "discovered."
 */
export const DSL = {
  /**
   * Match a given command to produce a renderable UI <View>.
   */
  async matchView(argv: string, doc: t.Lens) {
    const args = Args.parse(argv);
    const pos = Args.positional(args);
    const lname = (pos[0] || '').toLowerCase();

    if (lname === 'load') {
      const { loaderView } = await import('./dsl.load');
      return loaderView(args, doc);
    }

    return;
  },
} as const;
