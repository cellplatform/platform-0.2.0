import { DEFAULTS, CmdView } from '.';
import { Doc, css, Color, Dev, Pkg, Immutable, rx, SampleCrdt, Crdt } from '../../test.ui';
import { type t, CmdBar } from './common';

import { Info as CrdtInfo } from 'ext.lib.automerge';

type P = t.CmdViewProps;
type T = {
  docuri?: string;
  props: P;
  debug: {};
};
const initial: T = { props: {}, debug: {} };

type Current = {
  isFocused?: boolean;
  argv?: string;
  docVisible?: boolean;
};

/**
 * Spec
 */
const name = DEFAULTS.displayName;
export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] & Pick<T, 'docuri'> & Pick<P, 'theme'> & { viewstateJson?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    docuri: undefined,
    viewstateJson: undefined,
  });

  let doc: t.Doc | undefined;
  let cmdbar: t.CmdBarRef | undefined;
  const viewstate = Immutable.clonerRef<Current>(JSON.parse(local.viewstateJson ?? '{}'));
  const db = await SampleCrdt.init({ broadcastAdapter: true });

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);
    const sample = SampleCrdt.dev(state, local, db.store);

    await state.change((d) => {
      d.props.theme = local.theme;
    });
    doc = await sample.get();

    const viewstate$ = viewstate.events().changed$;
    viewstate$
      .pipe(rx.debounceTime(500))
      .subscribe(() => (local.viewstateJson = JSON.stringify(viewstate.current)));
    rx.merge(viewstate$)
      .pipe()
      .subscribe(() => dev.redraw());

    /**
     * Render: <CmdBar>
     */
    const renderCommandBar = () => {
      const { props } = state.current;
      return (
        <CmdBar.Stateful
          {...props}
          state={doc}
          onReady={(e) => {
            console.info('⚡️ CmdBar.Stateful.onReady:', e);

            const { dispose$ } = e;
            cmdbar = e.cmdbar as t.CmdBarRef;
            if (doc) Crdt.Sync.Textbox.listen(e.textbox, doc, e.paths.text, { dispose$ });
            viewstate.change((d) => (d.argv = e.initial.text));

            const events = cmdbar.ctrl.events(dispose$);
            events.on('Invoke', (e) => console.info(`⚡️ Invoke`, e.params));
          }}
          onFocusChange={(e) => viewstate.change((d) => (d.isFocused = e.is.focused))}
          onChange={(e) => viewstate.change((d) => (d.argv = e.to))}
        />
      );
    };

    ctx.debug.width(360);
    ctx.subject
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;
        Dev.Theme.background(dev, props.theme, 1);
        return <CmdView {...props} />;
      });

    /**
     * Footer: <CmdBar>
     */
    ctx.host.footer.padding(0).render((e) => renderCommandBar());
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header.border(-0.1).render((e) => {
      const { debug, docuri } = state.current;
      const { store, index } = db;

      return (
        <CrdtInfo
          stateful={true}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            repo: { store, index },
            document: {
              ref: docuri,
              uri: { head: true },
              object: {
                visible: viewstate.current.docVisible,
                onToggleClick: (e) => viewstate.change((d) => Dev.toggle(d, 'docVisible')),
              },
            },
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const sample = SampleCrdt.dev(state, local, db.store);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });

    dev.hr(5, 20);

    dev.section('Sample State', (dev) => {
      dev.button((btn) => {
        btn
          .label(`create`)
          .enabled((e) => !doc)
          .onClick(async (e) => (doc = await sample.get()));
      });
      dev.button((btn) => {
        btn
          .label(`delete`)
          .right((e) => (doc ? `crdt:${Doc.Uri.shorten(doc.uri, 2)}` : ''))
          .enabled((e) => !!doc)
          .onClick(async (e) => (doc = await sample.delete()));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    dev.footer.border(-0.1).render<T>((e) => {
      const data = {
        props: e.state.props,
        current: viewstate.current,
      };
      return <Dev.Object name={name} data={data} expand={1} fontSize={11} />;
    });
  });
});
