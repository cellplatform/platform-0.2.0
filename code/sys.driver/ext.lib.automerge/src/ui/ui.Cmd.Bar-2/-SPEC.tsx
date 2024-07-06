import { CmdBar } from 'sys.ui.react.common';
import type { CmdBarStatefulProps } from 'sys.ui.react.common/src/types';

import { Sync } from '../../crdt.sync';
import { css, Dev, Doc, Pkg, SampleCrdt, type t } from '../../test.ui';
import { Info } from '../ui.Info';

type P = CmdBarStatefulProps;
type T = {
  docuri?: t.UriString;
  props: P;
  debug: { useLens?: boolean };
  current: { isFocused?: boolean };
};
const initial: T = { props: {}, debug: {}, current: {} };

/**
 * Spec
 */
const name = `${Pkg.name}:Crdt.CmdBar`;

export default Dev.describe(name, async (e) => {
  type LocalStore = Pick<T, 'docuri'> & T['debug'] & Pick<P, 'theme' | 'useKeyboard'>;
  const localstore = Dev.LocalStorage<LocalStore>(`dev:${Pkg.name}.${name}`);
  const local = localstore.object({
    theme: 'Dark',
    docuri: undefined,
    useLens: true,
    useKeyboard: true,
  });

  let doc: t.Doc | undefined;
  const db = await SampleCrdt.init({ broadcastAdapter: true });
  const cmdbar = CmdBar.Ctrl.create();

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    const sample = SampleCrdt.dev(state, local, db.store);

    await state.change((d) => {
      d.props.theme = local.theme;
      d.props.useKeyboard = local.useKeyboard;
      d.debug.useLens = local.useLens;
      d.docuri = local.docuri;
    });
    doc = await sample.get();

    ctx.debug.width(330);
    ctx.subject
      .size('fill-x')
      .display('grid')
      .render<T>((e) => {
        const { props, current } = e.state;
        const theme = props.theme;
        Dev.Theme.background(ctx, theme, 1);

        const isFocused = current.isFocused;
        const mainSize = [280, 150] as [number, number];
        const styles = {
          base: css({ position: 'relative' }),
          main: css({ Absolute: [0 - mainSize[1] - 50, 0, null, 0] }),
          label: css({
            Absolute: [-17, 5, null, null],
            fontFamily: 'monospace',
            fontSize: 10,
            opacity: isFocused ? 1 : 0.3,
            transition: `opacity 100ms ease`,
          }),
        };

        const elCmdBar = (
          <CmdBar.Stateful
            {...props}
            state={doc}
            cmd={cmdbar}
            onReady={(e) => {
              console.info('⚡️ CmdBar.Stateful.onReady:', e);
              if (doc) Sync.Textbox.listen(e.textbox, doc, e.paths.text);
            }}
            onFocusChange={(e) => {
              state.change((d) => (d.current.isFocused = e.is.focused));
            }}
          />
        );

        console.log('props.cmd', props.cmd);

        return (
          <div {...styles.base}>
            <CmdBar.Sample.Main theme={theme} style={styles.main} size={mainSize} cmd={cmdbar} />
            <div {...styles.label}>{'cmdbar'}</div>
            {elCmdBar}
          </div>
        );
      });
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
              object: { visible: false, expand: { level: 2 }, beforeRender(mutate) {} },
            },
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();
    const link = Dev.Link.pkg(Pkg, dev);
    const sample = SampleCrdt.dev(state, local, db.store);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (e) => (local.theme = e));
      dev.hr(-1, 5);
      dev.boolean((btn) => {
        const value = (state: T) => !!state.props.useKeyboard;
        btn
          .label((e) => `useKeyboard`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'useKeyboard')));
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
        doc: doc?.current,
      };
      return <Dev.Object name={name} data={data} expand={{ paths: ['$'] }} fontSize={11} />;
    });
  });
});
