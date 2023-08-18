import { Dev, type t } from '../../test.ui';
import { Button } from './Button';

const DEFAULTS = Button.DEFAULTS;

type T = {
  props: t.ButtonProps;
  debug: { bg: boolean; useLabel: boolean; padding: boolean };
};
const initial: T = {
  props: {
    isEnabled: DEFAULTS.isEnabled,
    block: DEFAULTS.block,
    spinning: DEFAULTS.spinning,
    tooltip: 'My Button',
    label: 'Hello-🐷',
  },
  debug: { bg: true, useLabel: true, padding: false },
};

type LocalStore = T['debug'];
const localstore = Dev.LocalStorage<LocalStore>('dev:key');
const local = localstore.object({ ...initial.debug });

export default Dev.describe('Button', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    await state.change((d) => {
      d.debug.bg = local.bg;
      d.debug.useLabel = local.useLabel;
    });

    ctx.subject.display('grid').render<T>((e) => {
      const { debug } = e.state;
      ctx.subject.backgroundColor(debug.bg ? 1 : 0);

      const props = {
        ...e.state.props,
        padding: debug.padding ? 20 : undefined,
      };

      if (!debug.useLabel) {
        props.label = 'Label-🐷';
        props.children = undefined;
      } else {
        props.label = undefined;
        props.children = <div>{'My Child Element'}</div>;
      }

      // const styles = {
      //   base: css({}),
      // };

      return (
        <Button
          {...props}
          onMouse={(e) => console.info(`⚡️ onMouse`, e)}
          onClick={(e) => {
            console.info('⚡️ onClick', e);
            // state.change((d) => Dev.toggle(d.props, 'spinning'));
          }}
        />
      );
    });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.section('Properties', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('isEnabled')
          .value((e) => e.state.props.isEnabled)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'isEnabled'))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => 'spinning')
          .value((e) => e.state.props.spinning)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'spinning'))),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label('block')
          .value((e) => e.state.props.block)
          .onClick((e) => e.change((d) => Dev.toggle(d.props, 'block'))),
      );
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.button((btn) =>
        btn
          .label('content: <child element>')
          .right((e) => (!e.state.debug.useLabel ? '← current' : ''))
          .onClick((e) => e.change((d) => (d.debug.useLabel = false))),
      );

      dev.button((btn) =>
        btn
          .label('content: "label" property')
          .right((e) => (e.state.debug.useLabel ? '← current' : ''))
          .onClick((e) => e.change((d) => (d.debug.useLabel = true))),
      );

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => `background (${e.state.debug.bg ? 'showing' : 'transparent'})`)
          .value((e) => Boolean(e.state.debug.bg))
          .onClick((e) => e.change((d) => (local.bg = Dev.toggle(d.debug, 'bg')))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `padding`)
          .value((e) => Boolean(e.state.debug.padding))
          .onClick((e) => e.change((d) => (local.padding = Dev.toggle(d.debug, 'padding')))),
      );
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);

    dev.footer.border(-0.1).render<T>((e) => {
      const data = { props: e.state.props };
      return <Dev.Object name={'Button'} data={data} expand={1} />;
    });
  });
});
