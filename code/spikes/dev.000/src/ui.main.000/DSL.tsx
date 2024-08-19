import { Args, Yaml, type t, Doc } from './common';

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
   * Run the command when the [Invoke] action is triggered (eg ENTER key).
   */
  async invoke(argv: string, main: t.Shell) {
    const { args, action, pos } = wrangle.args<t.RootCommands>(argv);
    const clear = () => main.cmdbar?.ctrl.clear({});

    if (action === 'copy' || action === 'cp') {
      if (pos[1] === 'peer') {
        if (document.hasFocus()) {
          const uri = `peer:${main.self.id}`;
          navigator.clipboard.writeText(uri);
          return clear();
        }
      }
    }

    if (action === 'video' || action === 'v') {
      /**
       * TODO 🐷
       */
      const conns = main.self.current.connections;
      console.log('video:connections:', conns);

      //
    }

    if (action.startsWith('peer:')) {
      const peer = main.self;
      const peerId = action.split(':')[1];
      if (peerId !== peer.id) {
        peer.connect.data(peerId);
        return clear();
      }
    }

    if (action === 'crdt') {
      if (pos[1] === 'create') {
        const repo = main.repo.tmp;
        const doc = await repo.store.doc.getOrCreate((d) => null);
        const id = Doc.Uri.id(doc);
        const text = `crdt:a.${id}`;
        main.cmdbar?.ctrl.update({ text });
      }
    }

    if (action === 'fc') {
      const cmd = pos[1];
      if (cmd === 'cast') {
        const text = pos[2];
        console.log('cast:', text);
        const send = main.fc.method('send:cast', 'send:cast:res');
        const res = await send({ text }).promise();
        console.log('cast:response:', res);
      }
    }

    if (action === 'dev') {
      const { loadSpec } = await import('./DSL.load');
      return loadSpec(args, main);
    }

    //     if (action === 'me') {
    //       const current = main.state.me.current as any;
    //       const text = (current?.root?.config?.text ?? '') as string;
    //       const tmp = main.state.tmp;
    //
    //       try {
    //         const yaml = Yaml.parse(text);
    //
    //         if (typeof yaml.video === 'object') {
    //           const video = yaml.video as t.TmpVideo;
    //           tmp.change((d) => (d.video = video));
    //         } else {
    //           tmp.change((d) => delete d.video);
    //         }
    //
    //         if (typeof yaml.props === 'object') {
    //           tmp.change((d) => (d.props = yaml.props));
    //         } else {
    //           tmp.change((d) => delete d.props);
    //         }
    //       } catch (error) {
    //         console.error(`Failed while parsing YAML`, error);
    //       }
    //     }

    if (action === 'new.tab') {
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
    }
    if (action === 'new.window') {
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
    }

    return;
  },

  /**
   * Match a given command to produce a renderable UI <View>.
   */
  async matchView(argv: string, main: t.Shell) {
    const theme: t.CommonTheme = 'Dark';
    const { args, action } = wrangle.args<t.RootCommands>(argv);
    const pos = args._;

    if (action === 'dev') {
      const { loaderView } = await import('./DSL.load');
      return loaderView(args, main);
    }

    if (action === 'hash') {
      const { HashView } = await import('sys.ui.react.common');
      return <HashView theme={theme} bg={true} />;
    }

    if (action === 'cmd') {
      const { CmdMain } = await import('./ui.Cmd.Main');
      return <CmdMain main={main} theme={theme} />;
    }

    const renderCrdt = async (id: string) => {
      if (!id) return null;
      const { CrdtView } = await import('./ui.Crdt');
      const uri = `automerge:${id}`;
      return <CrdtView main={main} theme={theme} docuri={uri} />;
    };

    if (action.startsWith('crdt:')) {
      let id = Doc.Uri.id(action);
      id = id.replace(/^crdt\:/, '');
      id = id.replace(/^a\./, '');
      id = id.split('@')[0];
      return renderCrdt(id);
    }

    if (action === 'me') {
      console.log('-------------------------------------------');
      console.log('TODO', 'ME');

      // const { Me } = await import('./ui.Me');
      // return <Me main={main} theme={theme} />;
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
