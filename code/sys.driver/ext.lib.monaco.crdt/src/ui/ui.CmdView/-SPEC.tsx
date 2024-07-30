import { CmdView, DEFAULTS } from '.';
import { Color, Crdt, Dev, Doc, Immutable, Json, Pkg, rx, SampleCrdt } from '../../test.ui';
import { CmdBar, type t } from './common';

import { Info as CrdtInfo } from 'ext.lib.automerge';

type P = t.CmdViewProps;
type D = {
  docuri?: string;
  argv?: string;
  isFocused?: boolean;
  docObjectOpen?: boolean;
  passDocProp?: boolean;
};

/**
 * Spec
 */
const name = DEFAULTS.displayName;

export default Dev.describe(name, async (e) => {
  type LocalStore = { props?: t.JsonString; debug?: t.JsonString };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    props: undefined,
    debug: undefined,
  });

  local.props = undefined;

  const State = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props)),
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, { docObjectOpen: true })),
  } as const;

  const Props = {
    get doc() {
      const debug = State.debug.current;
      return debug.passDocProp ? doc : undefined;
    },
  } as const;

  let doc: t.Doc | undefined;
  let cmdbar: t.CmdBarRef | undefined;
  const db = await SampleCrdt.init({ broadcastAdapter: true });

  State.props.change((d) => {
    const editor = Doc.ensure(d, 'editor', {});
    editor.lensPath = ['sample.CmdView'];
  });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<D>(e);
    const sample = SampleCrdt.dev(db.repo.store, State.debug);

    doc = await sample.get();
    const props$ = State.props.events().changed$;
    const debug$ = State.debug.events().changed$;

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(1000))
      .subscribe(() => {
        local.props = Json.stringify(State.props.current);
        local.debug = Json.stringify(State.debug.current);
      });

    rx.merge(props$, debug$)
      .pipe(rx.debounceTime(100))
      .subscribe(() => dev.redraw());

    /**
     * Render: <CmdBar>
     */
    const renderCommandBar = () => {
      return (
        <CmdBar.Stateful
          {...State.props.current}
          state={doc}
          paths={['sample.CmdBar']}
          onReady={(e) => {
            const { dispose$ } = e;
            cmdbar = e.cmdbar;
            console.info('⚡️ CmdBar.Stateful.onReady:', e);

            if (doc) Crdt.Sync.Textbox.listen(e.textbox, doc, e.paths.text, { dispose$ });
            State.debug.change((d) => (d.argv = e.initial.text));

            const events = cmdbar.ctrl.events(dispose$);
            events.on('Invoke', (e) => console.info(`⚡️ Invoke`, e.params));
          }}
          onFocusChange={(e) => State.debug.change((d) => (d.isFocused = e.is.focused))}
          onChange={(e) => State.debug.change((d) => (d.argv = e.to))}
        />
      );
    };

    ctx.debug.width(360);
    ctx.subject
      .size('fill-x')
      .display('grid')
      .render<D>((e) => {
        const props = State.props.current;
        const theme = Color.theme(props.theme);
        Dev.Theme.background(dev, theme, 1);
        return (
          <CmdView
            {...props}
            doc={Props.doc}
            repo={db.repo}
            border={1}
            style={{ height: 250 }}
            onHistoryStackClick={(e) => console.info(`⚡️ onHistoryStackClick:`, e)}
          />
        );
      });

    /**
     * Footer: <CmdBar>
     */
    ctx.host.footer.padding(0).render((e) => renderCommandBar());
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<D>(e);

    dev.header.border(-0.1).render((e) => {
      const ref = Props.doc?.uri;
      const debug = State.debug.current;
      const { store, index } = db.repo;

      return (
        <CrdtInfo
          stateful={true}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            repo: { store, index },
            document: {
              ref,
              uri: { head: true },
              object: {
                visible: debug.docObjectOpen,
                onToggleClick: (e) => State.debug.change((d) => Dev.toggle(d, 'docObjectOpen')),
              },
            },
          }}
        />
      );
    });
  });

  e.it('ui:debug', (e) => {
    const dev = Dev.tools<D>(e);
    const sample = SampleCrdt.dev(db.repo.store, State.debug);

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, State.props);
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const state = State.props;
        const current = () => !!state.current.enabled;
        btn
          .label(() => `enabled`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'enabled')));
      });
      dev.boolean((btn) => {
        const value = () => !!State.props.current.historyStack;
        btn
          .label(() => `historyStack`)
          .value(() => value())
          .onClick(() => State.props.change((d) => Dev.toggle(d, 'historyStack')));
      });
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = () => !!State.props.current.editor?.readOnly;
        btn
          .label(() => `editor.readOnly`)
          .value(() => value())
          .onClick(() => {
            State.props.change((d) => Dev.toggle(Doc.ensure(d, 'editor', {}), 'readOnly'));
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Sample State', (dev) => {
      dev.button((btn) => {
        btn
          .label(`create`)
          .enabled(() => !doc)
          .onClick(async () => (doc = await sample.get()));
      });
      dev.button((btn) => {
        btn
          .label(`delete`)
          .right(() => (doc ? `crdt:${Doc.Uri.shorten(doc.uri)}` : ''))
          .enabled(() => !!doc)
          .onClick(async () => (doc = await sample.delete()));
      });

      dev.hr(-1, 5);

      dev.button((btn) => {
        type T = { count: number };
        const getCount = () => doc?.current?.count ?? 0;
        btn
          .label(`increment`)
          .right(() => `count: ${getCount()} + 1`)
          .enabled(() => !!doc)
          .onClick(() => {
            doc?.change((d) => (d.count = ((d as T).count || 0) + 1));
            dev.redraw('debug');
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const state = State.debug;
        const current = () => !!state.current.passDocProp;
        btn
          .label(() => (current() ? `props.doc` : 'props.doc: <undefined>'))
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'passDocProp')));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>(() => {
      const data = {
        props: State.props.current,
        debug: State.debug.current,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
