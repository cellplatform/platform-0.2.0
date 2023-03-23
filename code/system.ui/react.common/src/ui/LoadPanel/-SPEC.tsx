import { t, css, Dev } from '../../test.ui';
import { LoadPanel, LoadPanelProps } from './ui.LoadPanel';

type T = {
  props: LoadPanelProps;
  debug: { fullscreen: boolean };
};
const initial: T = {
  props: {},
  debug: { fullscreen: false },
};

export default Dev.describe('LoadPanel', (e) => {
  type LocalStore = T['debug'];
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.common.LoadPanel');
  const local = localstore.object(initial.debug);

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.fullscreen = local.fullscreen;
    });

    ctx.subject
      .backgroundColor(1)
      .display('grid')
      .render<T>((e) => {
        const props = e.state.props;
        const fullscreen = e.state.debug.fullscreen;
        if (fullscreen) ctx.subject.size('fill');
        if (!fullscreen) ctx.subject.size([300, null]);
        return <LoadPanel {...props} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Environment', (dev) => {
      dev.boolean((btn) =>
        btn
          .label((e) => 'fullscreen')
          .value((e) => e.state.debug.fullscreen)
          .onClick(async (e) => {
            await e.change((d) => (local.fullscreen = Dev.toggle(d.debug, 'fullscreen')));
          }),
      );
    });

    dev.hr(5, 30);

    dev.textbox((txt) =>
      txt
        .label((e) => 'load address')
        .placeholder((e) => 'uri')
        .value((e) => '')
        .onChange((e) => {})
        .onEnter((e) => {}),
    );

    /**
     * Footer
     */
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'Dev.LoadPanel'} data={e.state} expand={1} />);
  });
});
