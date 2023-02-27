import { PeerId, PeerIdProps } from '.';
import { cuid, Dev } from '../../test.ui';

type T = { props: PeerIdProps };
const initial: T = { props: { peer: cuid() } };

export default Dev.describe('PeerId', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        return <PeerId {...e.state.props} onClick={(e) => console.info('⚡️ onClick', e)} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'spec'} data={e.state} expand={1} />);

    dev.section('abbreviate', (dev) => {
      dev.button('none', (e) => e.change((d) => (d.props.abbreviate = false)));
      dev.button('6 chars', (e) => e.change((d) => (d.props.abbreviate = 6)));
      dev.button('[4, 4] chars', (e) => e.change((d) => (d.props.abbreviate = [4, 4])));
    });

    dev.hr();

    dev.boolean((btn) =>
      btn
        .label('copyOnCLick')
        .value((e) => e.state.props.copyOnClick)
        .onClick((e) => e.change((d) => Dev.toggle(d.props, 'copyOnClick'))),
    );

    dev.hr();

    dev.section('fontSize', (dev) => {
      const fontsize = (value?: number, label?: string) => {
        const text = label ?? `${value}px`;
        dev.button(text, (e) => e.change((d) => (d.props.fontSize = value)));
      };

      fontsize(8);
      fontsize(undefined, '(default)');
      fontsize(24);
    });
  });
});
