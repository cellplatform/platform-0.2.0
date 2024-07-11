import { CmdBar } from 'sys.ui.react.common';
import type { CmdBarStatefulProps } from 'sys.ui.react.common/src/types';

import { Sync } from '../../crdt.sync';
import { Cmd, Color, css, Dev, Doc, ObjectPath, Pkg, SampleCrdt, type t } from '../../test.ui';
import { Info } from '../ui.Info';

type P = CmdBarStatefulProps;
type T = {
  docuri?: t.UriString;
  props: P;
  debug: { useLens?: boolean; docVisible?: boolean };
  current: { isFocused?: boolean; argv?: string };
};
const initial: T = { props: {}, debug: {}, current: {} };

/**
 * Spec
 */
const name = `${Pkg.name}:Crdt:CmdBar.Sample`;

export default Dev.describe(name, async (e) => {
  type LocalStore = T['debug'] &
    Pick<T, 'docuri'> &
    Pick<P, 'theme' | 'useKeyboard' | 'useHistory'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    docuri: undefined,
    useLens: true,
    useKeyboard: true,
    useHistory: true,
    docVisible: false,
  });

  let doc: t.Doc | undefined;
  const db = await SampleCrdt.init({ broadcastAdapter: true });
  let cmdbar: t.CmdBarRef | undefined;

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    const sample = SampleCrdt.dev(state, local, db.store);

    await state.change((d) => {
      d.docuri = local.docuri;
      d.props.theme = local.theme;
      d.props.useKeyboard = local.useKeyboard;
      d.props.useHistory = local.useHistory;
      d.debug.useLens = local.useLens;
      d.debug.docVisible = local.docVisible;
    });
    doc = await sample.get();

    /**
     * Render: <CmdBar>
     */
    const renderCommandBar = () => {
      const { props } = state.current;

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
            state.change((d) => (d.current.argv = e.initial.text));

            const events = cmdbar.ctrl.events(dispose$);
            events.on('Invoke', (e) => console.info(`⚡️ Invoke`, e.params));
          }}
          onFocusChange={(e) => state.change((d) => (d.current.isFocused = e.is.focused))}
          onChange={(e) => state.change((d) => (d.current.argv = e.to))}
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
      .render<T>((e) => {
        const { props, current } = e.state;
        const theme = Color.theme(props.theme);
        Dev.Theme.background(ctx, theme, 1);

        const docuri = doc?.uri;
        const address = docuri ? `crdt:${Doc.Uri.id(docuri, { shorten: 5 })}` : '';

        return (
          <CmdBar.Dev.Main
            theme={theme.name}
            fields={['Module.Run', 'Module.Args']}
            argsCard={{
              ctrl: cmdbar,
              argv: current.argv,
              focused: { cmdbar: cmdbar?.current.focused },
              title: { left: address, right: 'main' },
              style: { marginBottom: 40 },
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
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header.border(-0.1).render((e) => {
      const { debug, docuri } = state.current;
      const { store, index } = db;
      return (
        <Info
          stateful={true}
          fields={['Repo', 'Doc', 'Doc.URI', 'Doc.Object']}
          data={{
            repo: { store, index },
            document: {
              ref: docuri,
              uri: { head: true },
              object: {
                visible: debug.docVisible,
                expand: { level: 1 },
                onToggleClick(e) {
                  state.change((d) => (local.docVisible = Dev.toggle(d.debug, 'docVisible')));
                },
                beforeRender(mutate) {
                  const paths = CmdBar.Path.defaults;
                  const resolve = CmdBar.Path.resolver(paths);
                  const cmd = resolve(mutate).cmd;
                  if (cmd) {
                    const resolve = Cmd.Path.resolver();
                    const tx = resolve.tx(cmd);
                    if (tx) {
                      ObjectPath.delete(mutate, paths.cmd);
                      ObjectPath.mutate(mutate, [`cmd(tx.${tx})`], cmd);
                    }
                  }
                },
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
    const link = Dev.Link.pkg(Pkg, dev);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (e) => (local.theme = e));
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.useKeyboard;
        btn
          .label((e) => `useKeyboard`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.useKeyboard = Dev.toggle(d.props, 'useKeyboard')));
          });
      });
      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.useHistory;
        btn
          .label((e) => `useHistory`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.useHistory = Dev.toggle(d.props, 'useHistory')));
          });
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button('redraw', (e) => dev.redraw());
    });

    dev.hr(5, 20);

    dev.section(['Sample State', 'CRDT'], (dev) => {
      dev.button((btn) => {
        btn
          .label(`create`)
          .enabled((e) => !doc)
          .onClick(async (e) => (doc = await sample.get()));
      });
      dev.button((btn) => {
        btn
          .label(`delete`)
          .enabled((e) => !!doc)
          .onClick(async (e) => (doc = await sample.delete()));
      });
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>(async (e) => {
      const { props, docuri } = e.state;
      const data = {
        props,
        docuri: Doc.Uri.id(docuri, { shorten: 5 }),
      };
      return <Dev.Object name={name} data={data} expand={{ paths: ['$'] }} fontSize={11} />;
    });
  });
});
