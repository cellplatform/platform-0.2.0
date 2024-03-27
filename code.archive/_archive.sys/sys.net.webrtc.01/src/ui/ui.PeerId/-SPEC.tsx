import { PeerId } from '.';
import { cuid, Dev, type t } from '../../test.ui';

type T = {
  props: t.PeerIdProps;
  debug: { assignClickHandler: boolean; message: boolean };
};
const initial: T = {
  props: {
    peer: cuid(),
    fontSize: 24,
    enabled: PeerId.DEFAULTS.enabled,
    copyable: true,
  },
  debug: { assignClickHandler: true, message: false },
};

export default Dev.describe('PeerId', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);

    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        const { props, debug } = e.state;

        const onClick: t.PeerIdClickHandler = (e) => {
          e.copy();
          console.info('⚡️ onClick', e);
        };

        return <PeerId {...props} onClick={debug.assignClickHandler ? onClick : undefined} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

    dev.section('abbreviate', (dev) => {
      dev.button('none', (e) => e.change((d) => (d.props.abbreviate = false)));
      dev.button('6 chars', (e) => e.change((d) => (d.props.abbreviate = 6)));
      dev.button('[4, 4] chars', (e) => e.change((d) => (d.props.abbreviate = [4, 4])));
      dev.button('[3, 6] chars', (e) => e.change((d) => (d.props.abbreviate = [3, 6])));
    });

    dev.hr();

    dev.boolean((btn) =>
      btn
        .label((e) => `enabled`)
        .value((e) => Boolean(e.state.props.enabled))
        .onClick((e) => e.change((d) => Dev.toggle(d.props, 'enabled'))),
    );

    dev.boolean((btn) =>
      btn
        .label((e) => `copyable`)
        .value((e) => Boolean(e.state.props.copyable))
        .onClick((e) => e.change((d) => Dev.toggle(d.props, 'copyable'))),
    );

    dev.hr(-1, 5);
    dev.button('peer: none', (e) => e.change((d) => (d.props.peer = undefined)));
    dev.button('peer: <cuid>', (e) => e.change((d) => (d.props.peer = cuid())));

    dev.hr(-1, 5);
    dev.button('prefix: "me"', (e) => e.change((d) => (d.props.prefix = '  me:  ')));
    dev.button('prefix: (undefined)', (e) => e.change((d) => (d.props.prefix = undefined)));

    dev.hr(-1, 5);
    dev.button('message: none', (e) => e.change((d) => (d.props.message = undefined)));
    dev.button('message: "copied"', (e) => e.change((d) => (d.props.message = 'copied')));

    dev.hr();

    dev.section('fontSize', (dev) => {
      const fontsize = (value?: number, label?: string) => {
        const text = label ?? `${value}px`;
        dev.button((btn) =>
          btn
            .label(text)
            .right((e) => (e.state.props.fontSize === value ? 'current' : ''))
            .onClick((e) => e.change((d) => (d.props.fontSize = value))),
        );
      };
      fontsize(8);
      fontsize(undefined, `${PeerId.DEFAULTS.fontSize}px (undefined → default)`);
      fontsize(16);
      fontsize(24);
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      const value = (state: T) => Boolean(state.debug.assignClickHandler);
      dev.boolean((btn) => {
        btn
          .label((e) => `onClick → ${value(e.state) ? 'ƒ' : '<undefined>'}`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'assignClickHandler')));
      });
    });
  });
});
