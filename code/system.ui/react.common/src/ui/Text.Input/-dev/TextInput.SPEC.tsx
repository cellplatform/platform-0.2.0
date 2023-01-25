import { TextInput } from '..';
import { Dev, t } from '../../../test.ui';
import { DevSample } from './DEV.Sample';

type T = {
  props: t.TextInputProps;
  debug: {
    render: boolean;
    isNumericMask: boolean;
    status?: t.TextInputStatus;
    hint: boolean;
    updateHandlerEnabled: boolean;
  };
  output: Record<string, any>;
};

const initial: T = {
  props: {
    ...TextInput.DEFAULTS.prop,
    placeholder: 'my placeholder',
    focusOnLoad: true,
  },
  debug: {
    hint: true,
    render: true,
    isNumericMask: false,
    updateHandlerEnabled: true,
  },
  output: {},
};

export default Dev.describe('TextInput', (e) => {
  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    await ctx.state<T>(initial);

    ctx.subject
      .display('grid')
      .size(300, null)
      .render<T>((e) => {
        const { debug } = e.state;
        if (!debug.render) return;

        const autoSize = e.state.props.autoSize;
        if (autoSize) ctx.subject.size('fill-x');
        if (!autoSize) ctx.subject.size(300, null);

        const mask = debug.isNumericMask ? TextInput.Masks.isNumeric : undefined;
        const props = { ...e.state.props, mask };
        return <DevSample props={props} debug={debug} />;
      });
  });

  e.it('debug panel', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => (
        <Dev.Object
          name={'spec.TextInput'}
          data={e.state}
          expand={{ level: 1, paths: ['$', '$.output', '$.output.status'] }}
        />
      ));

    dev.section('Configurations', (dev) => {
      const value = (value: string, label?: string) => {
        dev.button(`text: ${label ?? value}`, (e) => e.change((d) => (d.props.value = value)));
      };
      value('hello 👋');
      value(dev.lorem(50), 'long (lorem)');
    });

    dev.hr();

    dev.section('Properties', (dev) => {
      function boolean(key: keyof T['props']) {
        dev.boolean((btn) =>
          btn
            .label(key)
            .value((e) => Boolean(e.state.props[key]))
            .onClick((e) => e.change((d) => Dev.toggle(d.props, key))),
        );
      }

      boolean('isEnabled');
      boolean('isReadOnly');
      boolean('isPassword');
      dev.hr();
      boolean('autoCapitalize');
      boolean('autoCorrect');
      boolean('autoComplete');
      boolean('spellCheck');
      dev.hr();
      boolean('autoSize');
      boolean('focusOnLoad');
    });

    dev.TODO(`focusActions: ${TextInput.DEFAULTS.focusActions.join()}`);

    dev.hr();

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('render')
          .value((e) => e.state.debug.render)
          .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'render'))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `mask: isNumeric`)
          .value((e) => e.state.debug.isNumericMask)
          .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'isNumericMask'))),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `hint list (auto-complete)`)
          .value((e) => e.state.debug.hint)
          .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'hint'))),
      );

      dev.boolean((btn) => {
        const current = (state: T) => (state.debug.updateHandlerEnabled ? 'enabled' : 'disabled');
        btn
          .label((e) => `update handler: ${current(e.state)}`)
          .value((e) => e.state.debug.updateHandlerEnabled)
          .onClick((e) => e.change((d) => Dev.toggle(d.debug, 'updateHandlerEnabled')));
      });
    });

    dev.hr();
  });
});
