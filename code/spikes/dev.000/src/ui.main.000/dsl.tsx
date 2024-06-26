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
  async matchView(argv: string, main: t.Main) {
    const { args, first } = wrangle.args(argv);

    if (first === 'load') {
      const { loaderView } = await import('./dsl.load');
      return loaderView(args, main);
    }

    return;
  },

  /**
   * Run the command when the [Invoke] action is triggered (eg ENTER key).
   */
  async invoke(argv: string, main: t.Main) {
    const { args, first, pos } = wrangle.args(argv);

    if (first === 'cast') {
      const text = pos[1];
      console.log('cast:', text);
      const send = main.cmd.fc.method('send:cast', 'send:cast:res');
      const res = await send({ text }).promise();
      console.log('cast:response:', res);
    }

    if (first === 'load') {
      const { loadModule } = await import('./dsl.load');
      return loadModule(args, main);
    }

    return;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  args(argv: string) {
    const args = Args.parse(argv);
    const pos = Args.positional(args);
    const first = (pos[0] || '').toLowerCase();
    return { argv, pos, first, args };
  },
} as const;
