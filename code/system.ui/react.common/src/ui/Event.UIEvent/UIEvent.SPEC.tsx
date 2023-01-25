import { UIEventPipeHookArgs, UIEvents } from '.';
import { Dev, rx, slug } from '../../test.ui';
import { DevSample, SampleEventCtx } from './-dev/Sample';

type T = {
  render: boolean;
  args: UIEventPipeHookArgs<SampleEventCtx, HTMLDivElement>;
};

export default Dev.describe('UIEvent', (e) => {
  const instance = `demo.${slug()}`;
  const bus = rx.bus();
  const events = UIEvents<SampleEventCtx>({ bus, instance });

  const initial: T = {
    render: true,
    args: {
      bus,
      instance,
      ctx: { index: 0, message: 'hello' },
    },
  };

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);
    ctx.subject
      .display('grid')
      .backgroundColor(1)
      .render<T>((e) => {
        if (!e.state.render) return <div />;
        return <DevSample args={e.state.args} />;
      });

    events.$.subscribe((e) => {
      console.info(`events.$:`, e);
    });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'info'} data={e.state} expand={1} />);

    dev.title('useEventPipe(bus)').hr();

    dev.boolean((btn) =>
      btn
        .label('render')
        .value((e) => e.state.render)
        .onClick((e) => e.change((d) => Dev.toggle(d, 'render'))),
    );
  });
});
