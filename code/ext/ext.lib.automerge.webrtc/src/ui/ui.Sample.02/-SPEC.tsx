import { type t } from './common';

import { COLORS, Delete, Dev, Doc, PeerUI, TestDb, WebrtcStore, rx } from '../../test.ui';
import { createEdge } from './-SPEC.edge';
import { monitorKeyboard } from './-SPEC.keyboard';
import { factory } from '../ui.Sample.02.loaders';
import { PeerRepoList } from './common';
import { AuthIdentity } from './ui.Dev.Identity';
import { ShellDivider } from './ui.Dev.ShellDivider';
import { Sample } from './ui.Subject';

type TShared = {
  main?: t.Lens<t.SampleSharedMain>;
  harness?: t.Lens<t.HarnessShared>;
};
type T = { reload?: boolean; accessToken?: string; stream?: MediaStream };
const initial: T = {};

type SampleNamespace = 'foo.main' | 'foo.harness';

/**
 * Spec
 */
const name = 'Sample.02';
export default Dev.describe(name, async (e) => {
  let left: t.SampleEdge;
  let right: t.SampleEdge;
  let selected: { edge: t.NetworkConnectionEdge; item: t.StoreIndexDoc } | undefined;

  let ns: t.NamespaceManager<SampleNamespace> | undefined;
  const Shared: TShared = {};

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    left = await createEdge('Left', ['Focus.OnArrowKey', 'Shareable', 'Deletable', 'Copyable']);
    right = await createEdge('Right', ['Shareable', 'Deletable', 'Copyable']);

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
    left.network.shared().then((shared) => {
      ns = shared.namespace.typed<SampleNamespace>();
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
      };

      events.main.changed$.pipe(rx.debounceTime(100)).subscribe((e) => dev.redraw('subject'));
      events.harness.changed$.pipe(rx.debounceTime(100)).subscribe((e) => {
        const shared = e.after;
        ctx.debug.width(shared.debugPanel ?? true ? 300 : 0);
        dev.redraw();
      });

      monitorKeyboard(Shared.harness);
    });

    ctx.debug.width(300);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        if (e.state.reload)
          return <TestDb.DevReload onCloseClick={() => state.change((d) => (d.reload = false))} />;

        const shared = Shared.harness!;
        const edge = shared?.current.edge;
        const store = left.network.store;

        let elOverlay: JSX.Element | undefined;
        const def = Shared.main?.current.module;
        if (def && def.target === 'main') {
          const { docuri, name: typename } = def;
          const style = { backgroundColor: COLORS.WHITE };
          const accessToken = state.current.accessToken;
          const stream = state.current.stream;
          elOverlay = factory
            .ctx({ store, docuri, accessToken, stream })
            .render(typename, { style });
        }

        const onStreamSelection: t.PeerStreamSelectionHandler = (e) => {
          state.change((d) => (d.stream = e.selected));
          dev.redraw();
        };

        const elAvatars = (
          <PeerUI.AvatarTray
            peer={left.network.peer}
            gap={10}
            size={28}
            style={{
              Absolute: [null, null, 0 - (28 + 10), 10],
              pointerEvents: elOverlay ? 'none' : 'auto',
              opacity: elOverlay ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
            onSelection={onStreamSelection}
          />
        );

        const elSubject = (
          <Sample
            overlay={elOverlay}
            left={{ ...left, visible: edge?.Left.visible }}
            right={{ ...right, visible: edge?.Right.visible }}
            stream={e.state.stream}
            onStreamSelection={onStreamSelection}
          />
        );

        return (
          <>
            {elSubject}
            {elAvatars}
          </>
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.row((e) => {
      return (
        <AuthIdentity
          jwt={e.state.accessToken}
          onAccessToken={(jwt) => state.change((d) => (d.accessToken = jwt))}
        />
      );
    });
    dev.hr(5, 20);

    const edgeDebug = (edge: t.SampleEdge) => {
      const network = edge.network;

      dev.row((e) => {
        const shared = Shared.harness;
        const getLayout = (d?: t.HarnessShared) => d?.edge[edge.kind];
        const layout = getLayout(shared?.current);
        const defaultFields: t.InfoField[] = [
          'Visible',
          'Repo',
          'Peer',
          'Network.Transfer',
          'Network.Shared',
        ];

        if (!layout?.fields) {
          shared?.change((d) => (d.edge[edge.kind].fields = defaultFields));
        }

        return (
          <PeerRepoList.Info
            title={edge.kind}
            fields={layout?.fields ?? defaultFields}
            data={{
              network,
              visible: {
                value: layout?.visible ?? true,
                enabled: !!layout,
                onToggle(visible) {
                  shared?.change((d) => (d.edge[edge.kind].visible = !visible));
                },
              },
              shared: {
                onIconClick(e) {
                  shared?.change((d) => {
                    const edge = getLayout(d)!;
                    const fields = edge.fields ?? [];
                    edge.fields = fields.includes('Network.Shared.Json')
                      ? fields.filter((f) => f !== 'Network.Shared.Json')
                      : [...fields, 'Network.Shared.Json'];
                  });
                },
              },
            }}
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
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', () => dev.redraw());
      dev.hr(-1, 5);

      const getShared = async () => {
        return {
          left: await left.network.shared(),
          right: await right.network.shared(),
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

        const foo$ = events.right.ephemeral.type$<TFoo>(
          (e) => typeof e.message === 'object' && e.message?.type === 'foo',
        );
        foo$.subscribe((e) => console.log('foo$', e));
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
      loadButton(`ƒ → load → <ModuleNamespace>`, 'ModuleNamespace', 'main');
      dev.hr(-1, 5);
      loadButton(`ƒ → load → CodeEditor`, 'CodeEditor', 'main');
      loadButton(`ƒ → load → CodeEditor (AI)`, 'CodeEditor.AI', 'main');
      loadButton(`ƒ → load → DiagramEditor`, 'DiagramEditor', 'main');
      loadButton(`ƒ → load → Deno Deploy`, 'Deno.Deploy', 'main');
      loadButton(`ƒ → load → FaceAPI`, 'FaceAPI', 'main');
      loadButton(`ƒ → load → Image (Crdt)`, 'ImageCrdt', 'main');

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
          type T = t.DocRefHandle<t.CrdtShared>;
          (shared.left.doc as T)?.handle.broadcast(data);
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

      const selectedDoc = async (edge: t.NetworkConnectionEdge, item: t.StoreIndexDoc) => {
        if (!item || !edge) return;
        const doc = await edge.network.store.doc.get(item.uri);
        return doc?.toObject();
      };

      const jwt = e.state.accessToken;
      const data = {
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
