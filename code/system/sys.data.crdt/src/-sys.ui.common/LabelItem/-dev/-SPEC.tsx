import { DEFAULTS, LabelItem } from '..';
import { Dev, Time, type t } from '../../test.ui';
import { Sample } from './-Sample';

type T = {
  ref?: t.LabelItemRef;
  props: t.LabelItemProps;
  debug: { subjectBg?: boolean };
};
const initial: T = {
  props: { focusOnReady: true },
  debug: {},
};

export default Dev.describe('Namespace.Item', (e) => {
  type LocalStore = T['debug'] &
    Pick<
      t.LabelItemProps,
      'label' | 'enabled' | 'selected' | 'indent' | 'padding' | 'editing' | 'focused'
    >;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.comon.Item.LabelItem');
  const local = localstore.object({
    label: '',
    enabled: DEFAULTS.enabled,
    selected: DEFAULTS.selected,
    indent: DEFAULTS.indent,
    padding: DEFAULTS.padding,
    editing: DEFAULTS.editing,
    focused: DEFAULTS.focused,
    subjectBg: true,
  });

  const State = {
    toDisplayProps(state: t.DevCtxState<T>): t.LabelItemProps {
      const { debug } = state.current;

      return {
        ...state.current.props,

        onReady(e) {
          console.info('⚡️ onReady', e);
        },

        onChange(e) {
          console.info('⚡️ onChange', e);
          state.change((d) => (local.label = d.props.label = e.label));
        },

        onFocusChange(e) {
          console.info('⚡️ onFocusChange', e);
        },

        onEnter(e) {
          console.info('⚡️ onEnter', e);
        },

        onClick(e) {
          console.info('⚡️ onClick', e);
        },

        onLabelDoubleClick(e) {
          console.info('⚡️ onLabelDoubleClick', e);
        },
      };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.props.label = local.label;
      d.props.enabled = local.enabled;
      d.props.selected = local.selected;
      d.props.indent = local.indent;
      d.props.padding = local.padding;
      d.props.editing = local.editing;
      d.props.focused = local.focused;
      d.props.right = Sample.actions().right;
      d.debug.subjectBg = local.subjectBg;
    });

    ctx.debug.width(300);
    ctx.subject
      .size([280, null])
      .display('grid')
      .render<T>((e) => {
        const { debug } = e.state;
        ctx.subject.backgroundColor(debug.subjectBg ? 1 : 0);

        return (
          <LabelItem
            {...State.toDisplayProps(state)}
            onReady={(e) => {
              console.info('⚡️ onReady:', e);
              state.change((d) => (d.ref = e.ref));
            }}
          />
        );
      });
  });

  e.it('ui:debug', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    const focus = () => {
      const ref = state.current.ref;
      Time.delay(0, () => ref?.focus());
    };

    dev.section('Properties', (dev) => {
      dev.textbox((txt) => {
        const change = (to: string) => state.change((d) => (local.label = d.props.label = to));
        txt
          .placeholder('label text')
          .value((e) => e.state.props.label)
          .margin([0, 0, 10, 0])
          .onChange((e) => change(e.to.value))
          .onEnter((e) => {
            const text = (e.state.current.props.label ?? '').trim().toLowerCase();
            if (text === 'lorem') change(Dev.Lorem.toString());
          });
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.enabled);
        btn
          .label((e) => `enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.props, 'enabled'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.selected);
        btn
          .label((e) => `selected`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.selected = Dev.toggle(d.props, 'selected'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.editing);
        btn
          .label((e) => `editing`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.editing = Dev.toggle(d.props, 'editing'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.focused);
        btn
          .label((e) => `focused`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.focused = Dev.toggle(d.props, 'focused'))));
      });

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const defaultValue = DEFAULTS.indent;
        const value = (state: T) => state.props.indent ?? defaultValue;
        btn
          .label((e) => `indent = ${value(e.state)}`)
          .value((e) => value(e.state) !== defaultValue)
          .onClick((e) => {
            e.change((d) => {
              const current = d.props.indent ?? defaultValue;
              const next = current === defaultValue ? 15 : defaultValue;
              local.indent = d.props.indent = next;
            });
          });
      });

      dev.boolean((btn) => {
        const defaultValue = DEFAULTS.padding;
        const value = (state: T) => state.props.padding ?? defaultValue;
        btn
          .label((e) => `padding = ${value(e.state)}`)
          .value((e) => value(e.state) === defaultValue)
          .onClick((e) => {
            e.change((d) => {
              const current = d.props.padding ?? defaultValue;
              const next = current === defaultValue ? 0 : defaultValue;
              local.padding = d.props.padding = next;
            });
          });
      });
    });

    dev.hr(5, 20);

    dev.section(['States', 'changes ↑'], (dev) => {
      const updateLocalStorage = () => {
        const data = state.current;
        local.enabled = data.props.enabled;
        local.selected = data.props.selected;
        local.editing = data.props.editing;
        local.padding = data.props.padding;
        local.indent = data.props.indent;
        local.subjectBg = data.debug.subjectBg;
      };

      dev.button('default', async (e) => {
        await e.change((d) => {
          d.props.enabled = DEFAULTS.enabled;
          d.props.selected = DEFAULTS.selected;
          d.props.editing = DEFAULTS.editing;
          d.props.padding = DEFAULTS.padding;
          d.props.indent = DEFAULTS.indent;
          d.props.focused = DEFAULTS.focused;
        });
        updateLocalStorage();
      });

      dev.button('editing, focused', async (e) => {
        await e.change((d) => {
          d.props.selected = false;
          d.props.editing = true;
          d.props.focused = true;
        });
        updateLocalStorage();
        focus();
      });

      dev.hr(-1, 5);

      dev.button('selected', async (e) => {
        await e.change((d) => {
          d.props.selected = true;
          d.props.editing = false;
        });
        updateLocalStorage();
      });

      dev.button('editing → selected', async (e) => {
        await e.change((d) => {
          d.props.selected = true;
          d.props.editing = true;
          d.props.focused = false;
        });
        updateLocalStorage();
        focus();
      });

      dev.button('editing → selected, focused', async (e) => {
        await e.change((d) => {
          d.props.selected = true;
          d.props.editing = true;
          d.props.focused = true;
        });
        updateLocalStorage();
        focus();
      });

      dev.hr(-1, 5);

      dev.button('actions: undefined', async (e) => {
        await e.change((d) => {
          d.props.left = undefined;
          d.props.right = undefined;
        });
      });

      dev.button('actions: (left) single', async (e) => {
        const sample = Sample.actions();
        await e.change((d) => (d.props.left = sample.left[0]));
      });

      dev.button('actions: (left) multiple', async (e) => {
        const sample = Sample.actions();
        await e.change((d) => (d.props.left = sample.left));
      });

      dev.button('actions: (right) multiple', async (e) => {
        const sample = Sample.actions();
        await e.change((d) => (d.props.right = sample.right));
      });

      dev.button('actions: spinning', async (e) => {
        const sample = Sample.actions({ spinning: true });
        await e.change((d) => {
          d.props.left = sample.left;
          d.props.right = sample.right;
        });
      });

      dev.hr(-1, 5);

      dev.button(['clear', '"text"'], async (e) => {
        await e.change((d) => (d.props.label = undefined));
        updateLocalStorage();
        focus();
      });
    });

    dev.hr(5, 20);

    dev.section('Debug', (dev) => {
      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.subjectBg);
        btn
          .label((e) => `background`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.subjectBg = Dev.toggle(d.debug, 'subjectBg'))));
      });
    });

    dev.hr(5, 20);

    dev.section(['Methods', 'ref={ ƒ }'], (dev) => {
      type F = (ref: t.LabelItemRef) => void;
      const focusThen = (msecs: number, ref: t.LabelItemRef, fn: F) => {
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
      action('focus → blur', (ref) => focusThen(500, ref, () => ref.blur()));
      dev.hr(-1, 5);
      action('selectAll', (ref) => focusThen(0, ref, () => ref.selectAll()));
      dev.hr(-1, 5);
      action('cursorTo → start', (ref) => focusThen(0, ref, () => ref.cursorToStart()));
      action('cursorTo → end', (ref) => focusThen(0, ref, () => ref.cursorToEnd()));
    });
  });

  e.it('ui:footer', async (e) => {
    const dev = Dev.tools<T>(e, initial);
    const state = await dev.state();

    dev.footer.border(-0.1).render<T>((e) => {
      const props = State.toDisplayProps(state);
      const data = { props };
      return <Dev.Object name={'<Namespace.Item>'} data={data} expand={1} />;
    });
  });
});
