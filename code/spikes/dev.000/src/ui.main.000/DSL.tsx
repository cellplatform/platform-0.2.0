import { Args, Doc, Wrangle, type t } from './common';
import { sampleDeploy } from './DSL.deploy';

type O = Record<string, unknown>;

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
  async invoke(main: t.Shell, argv: string, issuer?: t.IdString) {
    const { args, action, pos } = wrangle.args<t.RootCommands>(argv);
    const issuedBySelf = issuer === main.self.id;
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
        const text = Wrangle.docUri.fromId(id);
        main.cmdbar?.ctrl.update({ text });
      }
    }

    if (action.startsWith('crdt:')) {
      const id = Wrangle.docUri.toId(action);
      const uri = `automerge:${id}`;
      const doc = await main.repo.tmp.store.doc.get(uri);
      if (doc && pos[1] === 'deploy' && issuedBySelf) sampleDeploy(main, doc);
    }

    if (action === 'me' && pos[1] === 'deploy' && issuedBySelf) {
      const doc = main.state.me;
      sampleDeploy(main, doc);
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

    if (action === 'new.tab') {
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

    const renderCrdt = async (id: string, repo?: t.ShellRepo) => {
      if (!id) return null;
      const { CrdtView } = await import('./ui.CrdtView');
      const uri = id.startsWith('automerge:') ? id : `automerge:${id}`;
      return <CrdtView main={main} theme={theme} docuri={uri} repo={repo} />;
    };

    if (action.startsWith('crdt:')) {
      const id = Wrangle.docUri.toId(action);
      return renderCrdt(id);
    }

    if (action === 'me') {
      const doc = main.state.me;
      return renderCrdt(doc.uri, main.repo.fs);
    }
    if (action === 'shared') {
      const uri = main.state.shared.doc.uri;
      return renderCrdt(uri, main.repo.tmp);
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
