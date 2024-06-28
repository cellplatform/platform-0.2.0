import { Args, type t, CmdBar, Yaml } from './common';

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
  async matchView(argv: string, main: t.Shell) {
    const { args, action } = wrangle.args<t.CommandAction>(argv);

    if (action === 'dev') {
      const { loaderView } = await import('./DSL.load');
      return loaderView(args, main);
    }

    if (action === 'me') {
      const { Me } = await import('./ui.Me');
      return <Me main={main} />;
    }

    return;
  },

  /**
   * Run the command when the [Invoke] action is triggered (eg ENTER key).
   */
  async invoke(argv: string, main: t.Shell) {
    const { args, action, pos } = wrangle.args<t.CommandAction>(argv);

    if (action === 'cast') {
      const text = pos[1];
      console.log('cast:', text);
      const send = main.cmd.fc.method('send:cast', 'send:cast:res');
      const res = await send({ text }).promise();
      console.log('cast:response:', res);
    }

    if (action === 'dev') {
      const { loadSpec } = await import('./DSL.load');
      return loadSpec(args, main);
    }

    if (action === 'me' && pos[1] === 'tmp') {
      const current = main.state.me.current as any;
      const text = (current?.root?.config ?? '') as string;

      const yaml = Yaml.parse(text);
      console.log('text', text);
      console.log('yaml', yaml);
    }

    return;
  },
} as const;

/**
 * Helpers
 */
const wrangle = {
  args<A>(argv: string) {
    const args = Args.parse(argv);
    const pos = Args.positional(args);
    const action = (pos[0] || '') as A;
    return { argv, pos, action, args };
  },
} as const;
