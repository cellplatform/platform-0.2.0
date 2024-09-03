import { CmdBar } from 'sys.ui.react.common';
import type { CmdBarStatefulProps } from 'sys.ui.react.common/src/types';

import { Sync } from '../../crdt.sync';
import { Color, css, Dev, Doc, Immutable, Json, Pkg, rx, SampleCrdt, type t } from '../../test.ui';
import { Info } from '../ui.Info';

type P = CmdBarStatefulProps;
type D = {
  docuri?: t.UriString;
  useLens?: boolean;
  isFocused?: boolean;
  argv?: string;
};

/**
 * Spec
 */
const name = `${Pkg.name}:Crdt:CmdBar.Sample`;

export default Dev.describe(name, async (e) => {
  type LocalStore = { props?: string; debug?: string };
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({ props: undefined, debug: undefined });
  const State = {
    props: Immutable.clonerRef<P>(
      Json.parse<P>(local.props, {
        theme: 'Dark',
        useKeyboard: true,
        useHistory: true,
      }),
    ),
    debug: Immutable.clonerRef<D>(Json.parse<D>(local.debug, { useLens: true })),
  } as const;

  const db = await SampleCrdt.init({ broadcastAdapter: true });
  let doc: t.Doc | undefined;
  let cmdbar: t.CmdBarRef | undefined;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
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
      .subscribe(() => ctx.redraw());

    /**
     * Render: <CmdBar>
     */
    const renderCommandBar = () => {
      const props = State.props.current;

      const t = (prop: string, time: t.Msecs = 50) => `${prop} ${time}ms`;
      const transition = [t('opacity'), t('border')].join(', ');
      const isFocused = cmdbar?.current.focused;
      const styles = {
        base: css({ position: 'relative' }),
        label: css({
          Absolute: [-22, 10, null, null],
          fontSize: 10,
          fontFamily: 'monospace',
          opacity: isFocused ? 1 : 0.3,
          transition,
        }),
      };

      const elCmdBar = (
        <CmdBar.Stateful
          {...props}
          state={doc}
          onReady={(e) => {
            console.info('⚡️ CmdBar.Stateful.onReady:', e);

            const { dispose$ } = e;
            cmdbar = e.cmdbar as t.CmdBarRef;
            if (doc) Sync.Textbox.listen(e.textbox, doc, e.paths.text, { dispose$ });
            State.debug.change((d) => (d.argv = e.initial.text));

            const events = cmdbar.ctrl.events(dispose$);
            events.on('Invoke', (e) => console.info(`⚡️ Invoke`, e.params));
          }}
          onFocusChange={(e) => State.debug.change((d) => (d.isFocused = e.is.focused))}
          onChange={(e) => State.debug.change((d) => (d.argv = e.to))}
          onSelect={(e) => console.info(`⚡️ CmdBar.Stateful.onSelect`, e)}
        />
      );

      return (
        <div {...styles.base}>
          <div {...styles.label}>{'cmdbar'}</div>
          {elCmdBar}
        </div>
      );
    };

    ctx.debug.width(330);
    ctx.subject
      .size('fill')
      .display('grid')
      .render<D>(() => {
        const props = State.props.current;
        const debug = State.debug.current;

        const theme = Color.theme(props.theme);
        Dev.Theme.background(ctx, theme, 1);

        const docuri = doc?.uri;
        const address = docuri ? `crdt:${Doc.Uri.id(docuri, { shorten: 5 })}` : '';

        const ctrl = cmdbar;
        return (
          <CmdBar.Dev.Main
            theme={theme.name}
            fields={['Module.Run', 'Module.Args']}
            argsCard={{
              ctrl,
              argv: debug.argv,
              focused: { cmdbar: cmdbar?.current.focused },
              title: { left: address, right: 'main' },
              style: { marginBottom: 40 },
            }}
            run={{
              ctrl,
              onInvoke(e) {
                console.log('⚡️ CmdBar.Dev.Main:Run: onRun', e);
              },
            }}
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
      const debug = State.debug.current;
      const { store, index } = db.repo;
      return (
        <Info.Stateful
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          repos={{ main: { store, index } }}
          data={{
            document: {
              uri: debug.docuri,
              repo: 'main',
              address: { head: true },
              object: { expand: { level: 1 } },
            },
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<D>(e);
    const sample = SampleCrdt.dev(db.repo.store, State.debug);

    dev.section('Properties', (dev) => {
      Dev.Theme.immutable(dev, State.props);
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = () => !!State.props.current.useKeyboard;
        btn
          .label(() => `useKeyboard`)
          .value(() => value())
          .onClick((e) => State.props.change((d) => Dev.toggle(d, 'useKeyboard')));
      });
      dev.boolean((btn) => {
        const value = () => !!State.props.current.useHistory;
        btn
          .label((e) => `useHistory`)
          .value((e) => value())
          .onClick((e) => State.props.change((d) => Dev.toggle(d, 'useHistory')));
      });
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
          .right((e) => (doc ? `crdt:${Doc.Uri.shorten(doc.uri)}` : ''))
          .enabled((e) => !!doc)
          .onClick(async (e) => (doc = await sample.delete()));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<D>(e);
    dev.footer.border(-0.1).render<D>((e) => {
      const props = State.props.current;
      const debug = State.debug.current;
      const data = {
        props,
        docuri: Doc.Uri.id(debug.docuri, { shorten: 5 }),
      };
      return <Dev.Object name={name} data={data} expand={{ paths: ['$'] }} fontSize={11} />;
    });
  });
});
