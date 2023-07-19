import { Dev, type t } from '../../test.ui';

import { GroupVideo } from '.';
import { Connect } from '../ui.Connect';

type T = {
  props: t.GroupVideoProps;
  network?: t.NetworkDocSharedRef;
};
const initial: T = { props: {} };

export default Dev.describe('GroupVideo', async (e) => {
  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const dev = Dev.tools<T>(e, initial);
    const state = await ctx.state<T>(initial);

    ctx.debug.width(340);
    ctx.subject
      .backgroundColor(1)
      .size('fill')
      .display('grid')
      .render<T>((e) => {
        return <GroupVideo {...e.state.props} />;
      });
  });

  e.it('ui:header', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.header
      .padding(0)
      .border(-0.1)
      .render((e) => {
        return (
          <Connect.Stateful
            margin={[0, 0, 20, 0]}
            onReady={(e) => {
              state.change((d) => (d.network = e.info.state));
              e.client.$.subscribe((d) => dev.redraw());
            }}
            onChange={(e) =>
              state.change((d) => {
                d.props.selected = e.selected;
                d.props.client = e.client;
              })
            }
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const { props, network } = e.state;
      const data = {
        props,
        'state:(public)': network?.current,
      };
      return <Dev.Object name={'GroupVideo'} data={data} expand={1} />;
    });
  });
});
