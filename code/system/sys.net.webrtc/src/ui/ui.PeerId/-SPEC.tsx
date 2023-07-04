import { PeerId, PeerIdProps } from '.';
import { cuid, Dev } from '../../test.ui';

type T = { props: PeerIdProps };
const initial: T = {
  props: {
    peer: cuid(),
    fontSize: 24,
    enabled: true,
  },
};

export default Dev.describe('PeerId', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return <PeerId {...e.state.props} onClick={(e) => console.info('⚡️ onClick', e)} />;
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

    dev.hr(-1, 5);

    dev.button('prefix: "me"', (e) => e.change((d) => (d.props.prefix = '  me:  ')));
    dev.button('prefix: (undefined)', (e) => e.change((d) => (d.props.prefix = undefined)));

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
      fontsize(24);
    });
  });
});
