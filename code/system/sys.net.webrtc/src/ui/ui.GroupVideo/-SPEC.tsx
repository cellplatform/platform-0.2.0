import { Dev, type t, rx } from '../../test.ui';

import { GroupVideo } from '.';
import { Connect } from '../ui.Connect';

type T = {
  props: t.GroupVideoProps;
};
const initial: T = { props: {} };

export default Dev.describe('GroupVideo', async (e) => {
  let network: t.NetworkDocSharedRef;

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
            onReady={async (e) => {
              console.info('⚡️ Connect.onReady:', e);
              network = e.info.state;
              const $ = e.client.$.pipe(rx.mergeWith(network.$));
              $.subscribe(() => dev.redraw());
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

    dev.section('debug', (dev) => {
      const count = (label: string, by: number) => {
        dev.button((btn) => {
          const current = () => (network?.current.tmp.count ?? 0) as number;
          const next = () => current() + by;
          btn
            .label(label)
            .right(() => `${current()} ${by < 0 ? '-' : '+'} ${Math.abs(by)}`)
            .onClick((e) => {
              network?.change((d) => (d.tmp.count = next()));
            });
        });
      };

      count('increment', 1);
      // count('decrement', -1);
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer.border(-0.1).render<T>((e) => {
      const { props } = e.state;
      const data = {
        props,
        'state:(public)': network?.current,
      };
      return <Dev.Object name={'GroupVideo'} data={data} expand={1} />;
    });
  });
});
