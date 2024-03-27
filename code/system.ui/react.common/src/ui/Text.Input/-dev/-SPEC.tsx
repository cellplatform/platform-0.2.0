import { Dev, type t } from '../../../test.ui';
import { DEFAULTS, KeyboardMonitor, Time } from '../common';
import { DevSample } from './DEV.Sample';

type P = t.TextInputProps;
type T = {
  props: P;
  debug: {
    render: boolean;
    status?: t.TextInputStatus;
    isHintEnabled: boolean;
    isNumericMask: boolean;
    isUpdateEnabled: boolean;
    isUpdateAsync: boolean;
    elementPlaceholder: boolean;
  };
  ref?: t.TextInputRef;
};

const initial: T = {
  props: {
    ...DEFAULTS.props,
    placeholder: 'my placeholder',
    focusOnReady: true,
    placeholderStyle: {
      ...DEFAULTS.props.placeholderStyle,
      // offset: [-10, -15],
    },
  },
  debug: {
    render: true,
    isHintEnabled: true,
    isNumericMask: false,
    isUpdateEnabled: true,
    isUpdateAsync: false,
    elementPlaceholder: false,
  },
};

export default Dev.describe('TextInput', (e) => {
  type LocalStoreDebug = T['debug'] & Pick<P, 'value' | 'theme'>;
  const localstore = Dev.LocalStorage<LocalStoreDebug>('dev:sys.ui.TextInput');
  const local = localstore.object({
    ...initial.debug,
    theme: undefined,
    value: '',
  });

  e.it('init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);
    state.change((d) => {
      d.debug = local;
      d.props.value = local.value;
      d.props.theme = local.theme;
    });

    KeyboardMonitor.on('CMD + KeyP', async (e) => {
      e.handled();
      state.current.ref?.focus();
    });

    ctx.subject
      .display('grid')
      .size([300, null])
      .render<T>((e) => {
        const { debug } = e.state;
        if (!debug.render) return;

        const autoSize = e.state.props.autoSize;
        if (autoSize) ctx.subject.size('fill-x');
        if (!autoSize) ctx.subject.size([300, null]);

        const props: t.TextInputProps = {
          ...e.state.props,
          onChanged: (e) => (local.value = e.to),
          onReady(ref) {
            console.log('⚡️ onReady:', ref);
            state.change((d) => (d.ref = ref));
          },
          onEnter(e) {
            console.info('⚡️ onEnter', e);
          },
          onEscape(e) {
            console.info('⚡️ onEscape', e);
          },
          onLabelDoubleClick(e) {
            console.info('⚡️ onLabelDoubleClick', e);
          },
        };

        Dev.Theme.background(ctx, props.theme, 1);
        return <DevSample props={props} debug={debug} />;
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    dev.footer
      .border(-0.1)
      .render<T>((e) => <Dev.Object name={'TextInput'} data={e.state} expand={1} />);

    dev.section('Configurations', (dev) => {
      const value = (value: string, label?: string) => {
        dev.button(`text: ${label ?? value}`, (e) => {
          e.change((d) => (local.value = d.props.value = value));
        });
      };
      value('hello 👋');
      value(dev.lorem(50), 'long (lorem)');
      dev.hr(-1, 5);
      value('', '(clear)');
    });

    dev.hr(5, 20);

    dev.section('Properties', (dev) => {
      Dev.Theme.switch(dev, ['props', 'theme'], (next) => (local.theme = next));
      dev.hr(-1, 5);

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
      boolean('focusOnReady');
    });

    dev.TODO(`focusActions: ${DEFAULTS.focusActions.join()}`);

    dev.hr(5, 20);

    dev.section('Actions', (dev) => {
      type F = (ref: t.TextInputRef) => void;
      const focusThen = (msecs: number, ref: t.TextInputRef, fn: F) => {
        ref.focus();
        Time.delay(msecs, () => fn(ref));
      };
      const action = (label: string, fn: F) => {
        dev.button(label, (e) => {
          const ref = e.state.current.ref;
          if (ref) fn(ref);
        });
      };
      action('focus', (ref) => ref.focus());
      action('focus( select )', (ref) => ref.focus(true));
      action('focus → blur', (ref) => focusThen(500, ref, () => ref.blur()));
      dev.hr(-1, 5);
      action('selectAll', (ref) => focusThen(0, ref, () => ref.selectAll()));
      dev.hr(-1, 5);
      action('cursorTo → Start', (ref) => focusThen(0, ref, () => ref.cursorToStart()));
      action('cursorTo → End', (ref) => focusThen(0, ref, () => ref.cursorToEnd()));
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) =>
        btn
          .label('render')
          .value((e) => e.state.debug.render)
          .onClick((e) => {
            e.change((d) => (local.render = Dev.toggle(d.debug, 'render')));
          }),
      );

      dev.boolean((btn) => {
        const current = (state: T) => (state.debug.isUpdateEnabled ? 'enabled' : 'disabled');
        btn
          .label((e) => `update handler: ${current(e.state)}`)
          .value((e) => e.state.debug.isUpdateEnabled)
          .onClick((e) => {
            e.change((d) => (local.isUpdateEnabled = Dev.toggle(d.debug, 'isUpdateEnabled')));
          });
      });

      dev.boolean((btn) => {
        const current = (state: T) => (state.debug.isUpdateAsync ? 'asynchronous' : 'synchronous');
        btn
          .label((e) => `update async: ${current(e.state)}`)
          .value((e) => e.state.debug.isUpdateAsync)
          .onClick((e) => {
            e.change((d) => (local.isUpdateAsync = Dev.toggle(d.debug, 'isUpdateAsync')));
          });
      });

      dev.hr(-1, 5);

      dev.boolean((btn) =>
        btn
          .label((e) => `mask: isNumeric`)
          .value((e) => e.state.debug.isNumericMask)
          .onClick((e) => {
            e.change((d) => (local.isNumericMask = Dev.toggle(d.debug, 'isNumericMask')));
          }),
      );

      dev.boolean((btn) =>
        btn
          .label((e) => `hinting (auto-complete)`)
          .value((e) => e.state.debug.isHintEnabled)
          .onClick((e) => {
            e.change((d) => (local.isHintEnabled = Dev.toggle(d.debug, 'isHintEnabled')));
          }),
      );

      dev.boolean((btn) => {
        btn
          .label((e) => `placeholder: ${e.state.debug.elementPlaceholder ? '<element>' : 'text'}`)
          .value((e) => e.state.debug.elementPlaceholder)
          .onClick((e) => {
            e.change((d) => {
              local.elementPlaceholder = Dev.toggle(d.debug, 'elementPlaceholder');
            });
          });
      });
    });
  });
});
