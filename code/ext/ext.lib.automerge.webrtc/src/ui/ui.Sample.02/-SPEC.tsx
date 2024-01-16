import { type t } from './common';

import { Delete, Dev, Doc, TestDb, WebrtcStore, rx } from '../../test.ui';
import { createEdge } from './-SPEC.createEdge';
import { PeerRepoList } from './common';
import { Sample } from './ui.Sample';

type T = {
  reload?: boolean;
  modalElement?: JSX.Element;
};
const initial: T = {};

/**
 * Spec
 */
const name = 'Sample.02';
export default Dev.describe(name, async (e) => {
  let left: t.SampleEdge;
  let right: t.SampleEdge;
  let selected: { edge: t.NetworkConnectionEdge; item: t.StoreIndexDoc } | undefined;

  const loadCodeEditor = async (state: t.DevCtxState<T>) => {
    console.log('💦 load module: sys.ui.react.monaco');
    const { MonacoEditor } = await import('sys.ui.react.monaco');
    await state.change((d) => (d.modalElement = <MonacoEditor style={{ opacity: 0.9 }} />));
  };

  const loadDiagramEditor = async (state: t.DevCtxState<T>) => {
    console.log('💦 load module: ext.lib.tldraw');
    const { Canvas } = await import('ext.lib.tldraw');
    // @ts-ignore
    await import('@tldraw/tldraw/tldraw.css');
    await state.change((d) => (d.modalElement = <Canvas style={{ opacity: 0.9 }} />));
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);

    left = await createEdge('Left', ['Focus.OnArrowKey', 'Shareable', 'Deletable']);
    right = await createEdge('Right', ['Shareable', 'Deletable']);

    const state = await ctx.state<T>(initial);
    await state.change((d) => {});
    const resetReloadClose = () => state.change((d) => (d.reload = false));

    const monitor = (edge: t.SampleEdge) => {
      const redraw = () => dev.redraw('debug');
      const debounce = rx.debounceTime(50);
      const peer = edge.network.peer.events();
      const repo$ = edge.model.events();
      peer.cmd.conn$.pipe(debounce).subscribe(redraw);
      edge.network.$.pipe(debounce).subscribe(redraw);

      edge.network.$.pipe(debounce).subscribe((e) => {
        console.log('network', e);
      });

      edge.network.added$.pipe().subscribe((e) => {
        console.log('network.added$', e);
      });

      edge.network.shared.$.pipe().subscribe(async (e) => {
        const tmp = e.change.doc.tmp ?? {};

        console.log('shared$', edge.kind, tmp);

        if (tmp.foo === 'CodeEditor') {
          loadCodeEditor(state);
        } else if (tmp.foo === 'DiagramEditor') {
          loadDiagramEditor(state);
        } else {
          await state.change((d) => (d.modalElement = undefined));
        }
      });

      repo$.active$.pipe(debounce).subscribe(redraw);
      repo$.active$.subscribe((e) => (selected = { edge, item: e.item }));
    };
    monitor(left);
    monitor(right);

    ctx.debug.width(300);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        if (e.state.reload) {
          return <TestDb.DevReload onCloseClick={resetReloadClose} />;
        } else {
          return <Sample left={left} right={right} modalElement={e.state.modalElement} />;
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
        return (
          <PeerRepoList.Info
            title={edge.kind}
            fields={['Repo', 'Peer', 'Network.Shared', 'Network.Shared.Json']}
            data={{ network }}
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

      const getShared = () => {
        return {
          left: left.network.shared.doc,
          right: right.network.shared.doc,
        } as const;
      };

      type TFoo = { type: 'foo'; payload: { foo: number } };

      const listenToEphemeral = async () => {
        const shared = getShared();
        if (!shared.left || !shared.right) return;

        const events = {
          left: shared.left.events(),
          right: shared.right.events(),
        };

        events.left.ephemeral.in$.subscribe((e) => {
          console.log('left|in$', e);
          // loadCodeEditor();
        });
        events.right.ephemeral.in$.subscribe((e) => {
          console.log('right|in$', e);
          loadCodeEditor(state);
        });

        const foo$ = events.right.ephemeral.type$<TFoo>(
          (e) => typeof e.message === 'object' && e.message?.type === 'foo',
        );
        foo$.subscribe((e) => console.log('foo$', e));
      };

      dev.button('tmp-1: listen', (e) => listenToEphemeral());

      dev.button('tmp-2: broadcast', (e) => {
        const shared = getShared();
        if (!shared.left || !shared.right) return;

        const send = (data: any) => {
          (shared.left as t.DocRefHandle<t.CrdtShared>)?.handle.broadcast(data);
        };

        console.log('------------------- send ---------------------');
        send({ type: 'foo', payload: { foo: 123 } });
        send('hello');
        send(['foo']);
        send(123);
      });

      dev.hr(-1, 5);

      const addTmpButton = (title: string, fn: (doc: t.DocRef<t.CrdtShared>) => any) => {
        dev.button(title, (e) => {
          const left = getShared().left;
          if (left) fn(left);
        });
      };

      const tmp = (doc: t.CrdtShared) => doc.tmp ?? (doc.tmp = {});
      addTmpButton('tmp-3: loader → <CodeEditor>', (doc) => {
        doc.change((d) => (tmp(d).foo = 'CodeEditor'));
      });
      addTmpButton('tmp-4: loader → <DiagramEditor>', (doc) => {
        doc.change((d) => (tmp(d).foo = 'DiagramEditor'));
      });
      addTmpButton('tmp-5: loader → remove', (doc) => {
        doc.change((d) => delete tmp(d).foo);
      });

      dev.hr(5, 20);

      dev.button('purge ephemeral', (e) => {
        const purge = (edge: t.SampleEdge) => WebrtcStore.Shared.purge(edge.model.index);
        purge(left);
        purge(right);
        e.change((d) => (d.reload = true));
      });

      dev.hr(-1, 5);

      const deleteButton = (label: string, fn: () => Promise<any>) => {
        dev.button([`delete db: ${label}`, '💥'], async (e) => {
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
