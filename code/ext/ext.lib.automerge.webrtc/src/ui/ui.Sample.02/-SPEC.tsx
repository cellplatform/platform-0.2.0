import { type t } from './common';

import { Delete, Dev, Doc, TestDb, WebrtcStore, rx } from '../../test.ui';
import { createEdge } from './-SPEC.createEdge';
import { monitorKeyboard } from './-SPEC.keyboard';
import { PeerRepoList } from './common';
import { loadFactory } from './-loader/factory';
import { Loader } from './ui.Loader';
import { Sample } from './ui.Sample';

type T = { reload?: boolean };
const initial: T = {};

type SampleNamespace = 'foo.sample' | 'dev.harness';

/**
 * Spec
 */
const name = 'Sample.02';
export default Dev.describe(name, async (e) => {
  let left: t.SampleEdge;
  let right: t.SampleEdge;
  let selected: { edge: t.NetworkConnectionEdge; item: t.StoreIndexDoc } | undefined;

  let ns: t.NamespaceManager<SampleNamespace> | undefined;
  let sharedOverlay: t.Lens<t.SampleSharedOverlay> | undefined;
  let sharedDevHarness: t.Lens<t.DevHarnessShared> | undefined;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    left = await createEdge('Left', ['Focus.OnArrowKey', 'Shareable', 'Deletable', 'Copyable']);
    right = await createEdge('Right', ['Shareable', 'Deletable', 'Copyable']);

    const state = await ctx.state<T>(initial);
    const resetReloadClose = () => state.change((d) => (d.reload = false));
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
      sharedOverlay = ns.lens<t.SampleSharedOverlay>('foo.sample', {});
      sharedDevHarness = ns.lens<t.DevHarnessShared>('dev.harness', {
        debugPanel: true,
        edge: { Left: { visible: true }, Right: { visible: true } },
      });

      sharedDevHarness
        .events()
        .changed$.pipe(rx.debounceTime(100))
        .subscribe(async (e) => {
          const m = e.after;
          ctx.debug.width(m.debugPanel ?? true ? 300 : 0);

          /**
           * Header component.
           */
          if (m.module) {
            const store = left.network.store;
            const { typename, docuri } = m.module;
            const el = await loadFactory({ store, typename, docuri });
            if (el && m.module.target === 'header') {
              dev.header.border(-0.1).render(el);
            }
          }

          dev.redraw();
        });

      monitorKeyboard(sharedDevHarness);
      dev.redraw();
    });

    ctx.debug.width(300);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        if (e.state.reload) {
          return <TestDb.DevReload onCloseClick={resetReloadClose} />;
        } else {
          const store = left.network.store;
          const lens = sharedOverlay;
          const edge = sharedDevHarness?.current.edge;
          const elOverlay = lens && <Loader store={store} lens={lens} factory={loadFactory} />;
          return (
            <Sample
              left={{ ...left, visible: edge?.Left.visible }}
              right={{ ...right, visible: edge?.Right.visible }}
              overlay={elOverlay}
            />
          );
        }
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.section('Peers', (dev) => {
      const isConnected = () => left.network.peer.current.connections.length > 0;
      const disconnect = () => {
        left.network.peer.disconnect();
        state.change((d) => (d.reload = true));
      };

      const connectButton = (label: string, fn: () => void) => {
        dev.button((btn) => {
          btn
            .label(() => `connect: ${label}`)
            .right((e) => (!isConnected() ? '🌳' : ''))
            // .enabled((e) => !isConnected())
            .onClick((e) => fn());
        });
      };

      connectButton('left → right', () => left.network.peer.connect.data(right.network.peer.id));
      connectButton('left ← right', () => right.network.peer.connect.data(left.network.peer.id));
      dev.hr(-1, 5);
      dev.button((btn) => {
        btn
          .label(() => (isConnected() ? 'disconnect' : 'not connected'))
          .right((e) => (isConnected() ? '💥' : ''))
          .enabled((e) => isConnected())
          .onClick((e) => disconnect());
      });
    });

    dev.hr(5, 20);

    const edgeDebug = (edge: t.SampleEdge) => {
      const network = edge.network;

      dev.row((e) => {
        const shared = sharedDevHarness;
        const edgeLayout = shared?.current.edge[edge.kind];
        return (
          <PeerRepoList.Info
            title={edge.kind}
            fields={[
              'Visible',
              'Repo',
              'Peer',
              'Network.Transfer',
              'Network.Shared',
              'Network.Shared.Json',
            ]}
            data={{
              network,
              visible: {
                value: edgeLayout?.visible ?? true,
                enabled: !!edgeLayout,
                onToggle(visible) {
                  shared?.change((d) => (d.edge[edge.kind].visible = !visible));
                },
              },
            }}
          />
        );
      });
    };

    edgeDebug(left);
    dev.hr(-1, 20);
    edgeDebug(right);

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
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

      const loaderButton = (
        label: string,
        typename: string,
        target: 'Main:Overlay' | 'Dev:Header',
      ) => {
        const isEnabled = () => !!sharedOverlay && !!selected?.item.uri;
        dev.button((btn) => {
          btn
            .label(label)
            .enabled(() => isEnabled())
            .onClick((e) => {
              const docuri = selected?.item.uri;
              if (!(sharedOverlay && sharedDevHarness)) return;
              if (!docuri) return;

              if (target === 'Main:Overlay') {
                sharedOverlay.change((d) => (d.module = { typename, docuri }));
              }
              if (target === 'Dev:Header') {
                sharedDevHarness.change((d) => (d.module = { typename, docuri, target: 'header' }));
              }
            });
        });
      };

      loaderButton(`ƒ → load → Auth`, 'Auth', 'Dev:Header');
      loaderButton(`ƒ → load → CodeEditor`, 'CodeEditor', 'Main:Overlay');
      loaderButton(`ƒ → load → DiagramEditor`, 'DiagramEditor', 'Main:Overlay');

      dev.hr(-1, 5);

      dev.button((btn) => {
        const isEnabled = () => !!sharedOverlay && !!selected?.item.uri;
        btn
          .label('ƒ → 💥')
          .right((e) => 'unload')
          .enabled((e) => isEnabled())
          .onClick((e) => sharedOverlay?.change((d) => delete d.module));
      });

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

    dev.footer.border(-0.1).render<T>((e) => {
      const total = (edge: t.SampleEdge) => edge.model.index.doc.current.docs.length;
      const shorten = (uri: string) => Doc.Uri.id(uri, { shorten: 6 });
      const formatEdge = (edge: t.SampleEdge) => {
        return {
          total: total(edge),
          index: edge.model.index.doc.current,
          'index:uri': shorten(edge.model.index.doc.uri),
        };
      };

      const formatSelected = (item?: t.StoreIndexDoc) => {
        if (!item) return;

        const shared = item.shared
          ? { ...item.shared, version: item.shared.version?.value ?? -1 }
          : undefined;

        return {
          ...item,
          uri: Doc.Uri.automerge(item.uri, { shorten: 6 }),
          shared,
        };
      };

      const data = {
        state: e.state,
        [`left[${total(left)}]`]: formatEdge(left),
        [`right[${total(right)}]`]: formatEdge(right),
        [`selected:edge`]: selected ? selected.edge.kind : undefined,
        [`selected:uri`]: selected
          ? Doc.Uri.automerge(selected.item.uri, { shorten: 4 })
          : undefined,
        [`selected`]: formatSelected(selected?.item),
      };

      return (
        <Dev.Object
          name={name}
          data={Delete.empty(data)}
          fontSize={11}
          expand={{
            level: 1,
            paths: [
              '$',
              // '$.selected',
              // '$.selected.shared',
            ],
          }}
        />
      );
    });
  });
});
