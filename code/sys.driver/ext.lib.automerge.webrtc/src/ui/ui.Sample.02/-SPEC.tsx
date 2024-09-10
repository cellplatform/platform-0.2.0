import { type t } from './common';

import {
  COLORS,
  Delete,
  Dev,
  Doc,
  Icons,
  Peer,
  PeerUI,
  TestDb,
  TestEdge,
  WebrtcStore,
  css,
  rx,
} from '../../test.ui';
import { factory } from '../ui.Sample.02.loaders';
import { monitorKeyboard } from './-SPEC.keyboard';
import { PeerRepoList } from './common';
import { AuthIdentity } from './ui.Dev.Identity';
import { ShellDivider } from './ui.Dev.ShellDivider';
import { Sample } from './ui.Subject';

type TShared = {
  main?: t.Lens<t.SampleSharedMain>;
  harness?: t.Lens<t.HarnessShared>;
};
type T = {
  reload?: boolean;
  accessToken?: string;
  stream?: MediaStream;
};
const initial: T = {};

type SampleNamespace = 'foo.main' | 'foo.harness';

/**
 * Spec
 */
const name = 'Sample.02';
export default Dev.describe(name, async (e) => {
  let left: t.SampleEdge;
  let right: t.SampleEdge;
  let selected: { edge: t.NetworkConnectionEdge; item: t.StoreIndexItem } | undefined;

  let ns: t.NamespaceManager<SampleNamespace> | undefined;
  const Shared: TShared = {};

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    const logLevel = 'Debug';
    left = await TestEdge.create('Left', {
      behaviors: ['Focus.OnArrowKey', 'Shareable', 'Deletable', 'Copyable'],
      logLevel,
    });
    right = await TestEdge.create('Right', {
      behaviors: ['Shareable', 'Deletable', 'Copyable'],
    });

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});

    const monitor = (edge: t.SampleEdge) => {
      const redraw = () => dev.redraw('debug');
      const debounce = rx.debounceTime(50);
      const peer = edge.network.peer.events();
      const repo$ = edge.model.events();
      peer.cmd.conn$.pipe(debounce).subscribe(redraw);

      const events = { network: edge.network.events() } as const;
      events.network.$.pipe(debounce).subscribe(redraw);

      events.network.$.pipe(debounce).subscribe((e) => {});
      events.network.added$.pipe().subscribe((e) => console.log('network.added$', e));

      repo$.active$.pipe(debounce).subscribe(redraw);
      repo$.active$.subscribe(({ item }) => (selected = { edge, item }));
    };
    monitor(left);
    monitor(right);

    /**
     * When the shared namespace becomes ready (i.e. the network is now connected)
     * the initialize the sample namespace.
     */
    (() => {
      const shared = left.network.shared;
      ns = shared.ns.typed<SampleNamespace>();
      Shared.main = ns.lens<t.SampleSharedMain>('foo.main', {});
      Shared.harness = ns.lens<t.HarnessShared>('foo.harness', {
        debugPanel: true,
        edge: {
          Left: { visible: true, showJson: true },
          Right: { visible: true, showJson: true },
        },
      });

      const events = {
        main: Shared.main.events(),
        harness: Shared.harness.events(),
      } as const;

      events.main.changed$.pipe(rx.debounceTime(100)).subscribe((e) => {
        dev.redraw('subject');
        dev.redraw('debug');
      });
      events.harness.changed$.pipe(rx.debounceTime(100)).subscribe((e) => {
        const shared = e.after;
        ctx.debug.width(shared.debugPanel ?? true ? 300 : 0);
        dev.redraw();
      });

      monitorKeyboard(Shared.harness);
    })();

    const onStreamSelection: t.PeerStreamSelectionHandler = (e) => {
      state.change((d) => (d.stream = e.selected));
      dev.redraw();
    };

    ctx.debug.width(300);
    ctx.debug.header.border(-0.1).render((e) => {
      const conns = left.network.peer.current.connections;
      const media = conns.filter((c) => Peer.Is.Kind.media(c));
      const total = media.length;
      const empty = total === 0;

      const styles = {
        base: css({ display: 'grid', placeItems: 'center' }),
      };
      const elEmpty = empty && (
        <div {...styles.base}>
          <Icons.Person opacity={0.3} />
        </div>
      );
      const elAvatars = !empty && (
        <PeerUI.AvatarTray
          //
          peer={left.network.peer}
          onSelection={onStreamSelection}
          muted={true}
        />
      );

      return elAvatars || elEmpty || null;
    });

    /**
     * Subject
     */
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        if (e.state.reload)
          return <TestDb.DevReload onCloseClick={() => state.change((d) => (d.reload = false))} />;

        const store = left.network.repo.store;

        let elOverlay: JSX.Element | undefined;
        const def = Shared.main?.current.module;
        if (def && def.target === 'main') {
          const { docuri, name: typename } = def;
          const style = { backgroundColor: COLORS.WHITE };
          const accessToken = state.current.accessToken;
          const stream = state.current.stream;
          const peerid = left.network.peer.id;
          elOverlay = factory
            .ctx({ store, docuri, accessToken, stream, peerid })
            .render(typename, { style });
        }

        return (
          <Sample
            left={left}
            right={right}
            overlay={elOverlay}
            stream={e.state.stream}
            onStreamSelection={onStreamSelection}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return null; // TEMP 🐷
      return (
        <AuthIdentity
          jwt={e.state.accessToken}
          onAccessToken={(jwt) => state.change((d) => (d.accessToken = jwt))}
        />
      );
    });
    // dev.hr(5, 20);

    const edgeDebug = (edge: t.SampleEdge) => {
      const network = edge.network;

      dev.row((e) => {
        const shared = Shared.harness;
        const getLayout = (d?: t.HarnessShared) => d?.edge[edge.kind];
        const layout = getLayout(shared?.current);
        const defaultFields: t.InfoField[] = ['Repo', 'Peer', 'Network.Transfer', 'Network.Shared'];

        if (!layout?.fields) {
          shared?.change((d) => (d.edge[edge.kind].fields = defaultFields));
        }

        return (
          <PeerRepoList.Info.Stateful
            title={`${edge.kind} Column`}
            fields={layout?.fields ?? defaultFields}
            network={network}
          />
        );
      });
    };

    edgeDebug(left);
    dev.row((e) => <ShellDivider />);
    edgeDebug(right);

    dev.hr(5, 20);

    dev.section('', (dev) => {
      const isConnected = () => left.network.peer.current.connections.length > 0;

      const connectButton = (label: string, fn: () => void) => {
        dev.button((btn) => {
          btn
            .label(() => `connect: ${label}`)
            .right((e) => (!isConnected() ? '🌳' : ''))
            .onClick((e) => fn());
        });
      };

      connectButton('left → right', () => left.network.peer.connect.data(right.network.peer.id));
      connectButton('left ← right', () => right.network.peer.connect.data(left.network.peer.id));
      dev.hr(-1, 5);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', () => dev.redraw());
      dev.hr(-1, 5);

      const getShared = async () => {
        return {
          left: left.network.shared,
          right: right.network.shared,
        } as const;
      };

      type TFoo = { type: 'foo'; payload: { foo: number } };

      const listenToEphemeral = async () => {
        const shared = await getShared();
        if (!shared.left || !shared.right) return;

        const events = {
          left: shared.left.doc.events(),
          right: shared.right.doc.events(),
        };

        events.left.ephemeral.in$.subscribe((e) => {
          console.log('left|in$', e);
          // loadCodeEditor();
        });
        events.right.ephemeral.in$.subscribe((e) => {
          console.log('right|in$', e);
          // loadCodeEditor(state);
        });

        events.right.ephemeral
          .in<TFoo>()
          .filter((e) => typeof e.message === 'object')
          .filter((e) => e.message?.type === 'foo')
          .subscribe((e) => console.log('ephemeral foo$', e));
      };

      const loadButton = (label: string, name: t.SampleName, target: t.SampleModuleDefTarget) => {
        const isEnabled = () => {
          if (!(Shared.main && Shared.harness)) return false;
          if (!selected?.item.uri) return false;
          return true;
        };
        dev.button((btn) => {
          btn
            .label(label)
            .enabled(() => isEnabled())
            .onClick((e) => {
              const docuri = selected?.item.uri;

              if (!(Shared.main && Shared.harness)) return;
              if (!docuri) return;
              const def: t.SampleModuleDef = { name, docuri, target };
              if (target === 'main') Shared.main.change((d) => (d.module = def));
              if (target === 'dev:header') Shared.harness.change((d) => (d.module = def));
              dev.redraw();
            });
        });
      };
      loadButton(`ƒ → load → CodeEditor`, 'CodeEditor', 'main');
      loadButton(`ƒ → load → CodeEditor (AI)`, 'CodeEditor.AI', 'main');
      loadButton(`ƒ → load → Deno Deploy`, 'Deno.Deploy', 'main');
      loadButton(`ƒ → load → Image (Crdt)`, 'ImageCrdt', 'main');
      loadButton(`ƒ → load → Automerge.Info`, 'AutomergeInfo', 'main');
      loadButton(`ƒ → load → common.CmdBar`, 'CmdBar', 'main');

      dev.hr(-1, 5);

      const unloadButton = (target: t.SampleModuleDefTarget) => {
        dev.button((btn) => {
          const isEnabled = () => !!Shared.main && !!selected?.item.uri;
          btn
            .label(`ƒ → (unload ${target})`)
            .right((e) => '💥')
            .enabled((e) => isEnabled())
            .onClick((e) => {
              if (target === 'main') Shared.main?.change((d) => delete d.module);
              dev.redraw();
            });
        });
      };
      unloadButton('main');

      dev.hr(-1, 5);

      dev.button('console: tmp-1: listen', (e) => listenToEphemeral());
      dev.button('console: tmp-2: broadcast', async (e) => {
        const shared = await getShared();
        if (!shared.left || !shared.right) return;

        const send = (data: any) => {
          Doc.ephemeral.broadcast(shared.left.doc, data);
        };

        console.log('------------------- send ---------------------');
        send({ type: 'foo', payload: { foo: 123 } });
        send('hello');
        send(['foo']);
        send(123);
      });

      dev.hr(5, 20);

      dev.button(['purge ephemeral', '💦'], (e) => {
        const purge = (edge: t.SampleEdge) => WebrtcStore.Shared.purge(edge.model.index);
        purge(left);
        purge(right);
        e.change((d) => (d.reload = true));
      });

      dev.hr(-1, 5);

      const deleteButton = (label: string, fn: () => Promise<any>) => {
        dev.button([`delete fs/db: ${label}`, '💥'], async (e) => {
          await e.change((d) => (d.reload = true));
          await fn();
        });
      };
      deleteButton(TestDb.EdgeSample.left.name, TestDb.EdgeSample.left.deleteDatabase);
      deleteButton(TestDb.EdgeSample.right.name, TestDb.EdgeSample.right.deleteDatabase);
      dev.hr(-1, 5);
      deleteButton('(both)', TestDb.EdgeSample.deleteDatabases);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>(async (e) => {
      const total = (edge: t.SampleEdge) => edge.model.index.doc.current.docs.length;
      const shorten = (uri: string) => Doc.Uri.id(uri, { shorten: 6 });
      const formatEdge = (edge: t.SampleEdge) => {
        return {
          total: total(edge),
          index: edge.model.index.doc.current,
          'index:uri': shorten(edge.model.index.doc.uri),
        };
      };

      const selectedDoc = async (edge: t.NetworkConnectionEdge, item: t.StoreIndexItem) => {
        if (!item || !edge) return;
        const repo = edge.network.repo;
        const doc = await repo.store.doc.get(item.uri);
        return doc?.toObject();
      };

      const data = {
        peerid: left.network.peer.id,
        [`left[${total(left)}]`]: formatEdge(left),
        [`right[${total(right)}]`]: formatEdge(right),
        [`selected:edge`]: selected ? selected.edge.kind : undefined,
        [`selected:doc:uri`]: selected ? Doc.Uri.id(selected.item.uri, { shorten: 4 }) : undefined,
        [`selected:doc`]: selected ? await selectedDoc(selected.edge, selected.item) : undefined,
      };

      return (
        <Dev.Object
          name={name}
          data={Delete.empty(data)}
          expand={{ level: 1, paths: ['$'] }}
          fontSize={11}
        />
      );
    });
  });
});
