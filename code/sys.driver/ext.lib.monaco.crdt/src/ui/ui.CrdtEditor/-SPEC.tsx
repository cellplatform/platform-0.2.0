import { CrdtEditor, DEFAULTS } from '.';
import { Color, Crdt, Dev, Doc, Immutable, Json, rx, SampleCrdt, slug } from '../../test.ui';
import { CmdBar, type t } from './common';

import { Info as CrdtInfo } from 'ext.lib.automerge';

type P = t.CrdtEditorProps;
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
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });
  const State = {
    props: Immutable.clonerRef<P>(Json.parse<P>(local.props, DEFAULTS.props)),
    debug: Immutable.clonerRef<D>(
      Json.parse<D>(local.debug, { docObjectOpen: true, passDocProp: true }),
    ),
  } as const;

  type F = t.CrdtEditorInfoField;
  const setFields = (fields?: F[]) => {
    State.props.change((d) => {
      const data = d.data ?? (d.data = {});
      const info = data.info ?? (data.info = {});
      info.fields = fields;
    });
  };
  const identity = `foo:${slug()}`;
  const Props = {
    get doc() {
      const debug = State.debug.current;
      return debug.passDocProp ? doc : undefined;
    },

    get current(): t.CrdtEditorProps {
      const doc = Props.doc;
      const repo = db.repo;
      const current = State.props.current;
      return {
        ...current,
        editor: { ...current.editor, identity },
        data: { ...current.data, doc, repo },
      };
    },
  } as const;

  let doc: t.Doc | undefined;
  let cmdbar: t.CmdBarRef | undefined;
  const db = await SampleCrdt.init({ broadcastAdapter: true });

  State.props.change((d) => {
    const editor = Doc.ensure(d, 'editor', {});
    editor.dataPath = ['sample.CrdtEditor'];
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

    ctx.debug.width(360);
    ctx.subject
      .size('fill-x', 150)
      .display('grid')
      .render<D>((e) => {
        const props = Props.current;
        const theme = Color.theme(props.theme);
        Dev.Theme.background(dev, theme, 1);

        return (
          <CrdtEditor
            {...props}
            border={1}
            style={{ height: 350 }}
            identityLabel={{ position: [null, null, -22, 6] }}
            onHistoryStackClick={(e) => console.info(`⚡️ CrdtEditor.onHistoryStackClick:`, e)}
            onChange={(e) => console.info(`⚡️ CrdtEditor.onChange:`, e)}
            onDataReady={(e) => {
              const uri = e.doc.uri;
              const id = uri.slice(-4);
              console.info(`⚡️ CrdtEditor.onDataReady("${id}"):`, e);

              e.dispose$.subscribe(() => {
                console.info(`⚡️ CrdtEditor.onDataReady("${id}") → dispose( 💥 )`);
              });

              // NB: the lens is already seeded with a [dispose$].
              e.lens.events().changed$.subscribe((e) => {
                console.info('⚡️ CrdtEditor.lens.changed', e);
              });
            }}
          />
        );
      });

    /**
     * Footer: <CmdBar>
     */
    ctx.host.footer.padding(0).render((e) => {
      return (
        <CmdBar.Stateful
          state={doc}
          paths={['sample.CmdBar']}
          onReady={(e) => {
            console.info('⚡️ CmdBar.Stateful.onReady:', e);
            cmdbar = e.cmdbar;
            const { dispose$ } = e;

            /**
             * Sync with CRDT.
             */
            if (doc) Crdt.Sync.Textbox.listen(e.textbox, doc, e.paths.text, { dispose$ });

            /**
             * Text → [argv].
             */
            const changeArgv = (text: string) => State.debug.change((d) => (d.argv = text));
            changeArgv(e.initial.text);
            cmdbar.onChange((e) => changeArgv(e.text), { debounce: 100, dispose$ });

            /**
             * Commands.
             */
            const events = cmdbar.ctrl.events(dispose$);
            events.on('Invoke', (e) => console.info(`⚡️ Invoke`, e.params));
          }}
          onFocusChange={(e) => State.debug.change((d) => (d.isFocused = e.is.focused))}
        />
      );
    });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<D>(e);

    dev.header.border(-0.1).render((e) => {
      const debug = State.debug.current;
      const { store, index } = db.repo;

      return (
        <CrdtInfo.Stateful
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          repos={{ main: { store, index } }}
          data={{
            repo: 'main',
            document: {
              uri: Props.doc?.uri,
              address: { head: true },
              object: { visible: debug.docObjectOpen },
            },
          }}
          onDocToggleClick={(e) => State.debug.change((d) => Dev.toggle(d, 'docObjectOpen'))}
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
      dev.boolean((btn) => {
        const state = State.props;
        const current = () => !!state.current.editorOnly;
        btn
          .label(() => `editorOnly`)
          .value(() => current())
          .onClick(() => state.change((d) => Dev.toggle(d, 'editorOnly')));
      });
      dev.hr(1, 15);
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

    dev.hr(5, 20);

    dev.section('Fields', (dev) => {
      dev.row(() => {
        const defaultFields = DEFAULTS.Panel.Info.fields.default;
        return (
          <CrdtEditor.FieldSelector
            selected={State.props.current.data?.info?.fields ?? defaultFields}
            onClick={(e) => setFields(e.next<F>(defaultFields))}
          />
        );
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
