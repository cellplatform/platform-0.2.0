import { DEFAULTS, LabelItem } from '..';
import { Dev, Time, type t } from '../../../test.ui';
import { Sample, type A } from './-Sample';

type T = {
  ref?: t.LabelItemRef;
  item: t.LabelItem<A>;
  props: t.LabelItemProps;
  debug: { subjectBg?: boolean; useRenderers?: boolean };
};
const initial: T = {
  item: {},
  props: { focusOnReady: true },
  debug: {},
};

const name = LabelItem.displayName ?? '';
export default Dev.describe(name, (e) => {
  type LocalStore = T['debug'] &
    Pick<t.LabelItemProps, 'focused' | 'editing' | 'selected' | 'indent' | 'padding' | 'debug'> &
    Pick<t.LabelItem, 'label' | 'placeholder' | 'enabled'>;
  const localstore = Dev.LocalStorage<LocalStore>('dev:sys.ui.comon.Item.LabelItem');
  const local = localstore.object({
    label: undefined,
    placeholder: undefined,
    enabled: DEFAULTS.enabled,
    selected: DEFAULTS.selected,
    indent: DEFAULTS.indent,
    padding: DEFAULTS.padding,
    editing: DEFAULTS.editing,
    focused: DEFAULTS.focused,
    debug: DEFAULTS.debug,
    subjectBg: true,
    useRenderers: true,
  });

  const State = {
    toDisplayProps(state: t.DevCtxState<T>): t.LabelItemProps {
      const { debug } = state.current;

      return {
        ...state.current.props,
        item: state.current.item,
        renderers: debug.useRenderers ? Sample.renderers : undefined,

        onReady(e) {
          console.info('⚡️ onReady', e);
        },
        onFocusChange(e) {
          console.info('⚡️ onFocusChange', e);
          state.change((d) => (d.props.focused = e.focused));
        },
        onClick(e) {
          console.info('⚡️ onClick', e);
        },
        onActionClick(e) {
          console.info('⚡️ onActionClick', e);
        },
        onLabelDoubleClick(e) {
          console.info('⚡️ onLabelDoubleClick', e);
        },
        onEditChange(e) {
          console.info('⚡️ onEditChange', e);
          state.change((d) => (local.label = d.item.label = e.label));
        },
        onKeyDown(e) {
          console.info('⚡️ onKeyDown', e);
        },
        onKeyUp(e) {
          console.info('⚡️ onKeyUp', e);
        },
      };
    },
  };

  e.it('ui:init', async (e) => {
    const ctx = Dev.ctx(e);
    const state = await ctx.state<T>(initial);

    state.change((d) => {
      d.item.label = local.label;
      d.item.placeholder = local.placeholder;
      d.item.right = Sample.actions().right;
      d.item.enabled = local.enabled;

      d.props.editing = local.editing;
      d.props.selected = local.selected;
      d.props.indent = local.indent;
      d.props.padding = local.padding;
      d.props.focused = local.focused;
      d.props.debug = local.debug;

      d.debug.subjectBg = local.subjectBg;
      d.debug.useRenderers = local.useRenderers;
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
        const change = (to: string) =>
          state.change((d) => (local.label = d.item.label = to || undefined));
        txt
          .placeholder('label text')
          .value((e) => e.state.item.label)
          .margin([0, 0, 10, 0])
          .onChange((e) => change(e.to.value))
          .onEnter((e) => {
            const text = (e.state.current.item.label ?? '').trim().toLowerCase();
            if (text === 'lorem') change(Dev.Lorem.toString());
          });
      });

      dev.textbox((txt) => {
        const change = (to: string) => {
          state.change((d) => (local.placeholder = d.item.placeholder = to || undefined));
        };
        txt
          .placeholder('placeholder')
          .value((e) => e.state.item.placeholder)
          .margin([0, 0, 10, 0])
          .onChange((e) => change(e.to.value))
          .onEnter((e) => {
            const text = (e.state.current.item.placeholder ?? '').trim().toLowerCase();
            if (text === 'lorem') change(Dev.Lorem.toString());
          });
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.item.enabled);
        btn
          .label((e) => `item.enabled`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.enabled = Dev.toggle(d.item, 'enabled'))));
      });

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.editing);
        btn
          .label((e) => `editing`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.editing = Dev.toggle(d.props, 'editing'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.selected);
        btn
          .label((e) => `selected`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.selected = Dev.toggle(d.props, 'selected'))));
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

    dev.section(['Samples', 'props ↑'], (dev) => {
      const updateLocalStorage = () => {
        const data = state.current;
        local.enabled = data.item.enabled;

        local.selected = data.props.selected;
        local.editing = data.props.editing;
        local.padding = data.props.padding;
        local.indent = data.props.indent;
        local.debug = data.props.debug;

        local.subjectBg = data.debug.subjectBg;
      };

      dev.button('default', async (e) => {
        await e.change((d) => {
          d.item.enabled = DEFAULTS.enabled;
          d.props.editing = DEFAULTS.editing;
          d.props.selected = DEFAULTS.selected;
          d.props.focused = DEFAULTS.focused;
          d.props.padding = DEFAULTS.padding;
          d.props.indent = DEFAULTS.indent;
        });
        updateLocalStorage();
      });

      dev.hr(-1, 5);

      dev.button('selected', async (e) => {
        await e.change((d) => {
          d.props.editing = false;
          d.props.selected = true;
        });
        updateLocalStorage();
      });

      dev.button('selected, focused', async (e) => {
        await e.change((d) => {
          d.props.editing = false;
          d.props.selected = true;
          d.props.focused = true;
        });
        updateLocalStorage();
      });

      dev.hr(-1, 5);

      dev.button('editing, focused', async (e) => {
        await e.change((d) => {
          d.props.editing = true;
          d.props.selected = false;
          d.props.focused = true;
        });
        updateLocalStorage();
        focus();
      });

      dev.button('editing → selected', async (e) => {
        await e.change((d) => {
          d.props.editing = true;
          d.props.selected = true;
          d.props.focused = false;
        });
        updateLocalStorage();
        focus();
      });

      dev.button('editing → selected, focused', async (e) => {
        await e.change((d) => {
          d.props.editing = true;
          d.props.selected = true;
          d.props.focused = true;
        });
        updateLocalStorage();
        focus();
      });

      dev.hr(-1, 5);

      dev.button('actions: undefined', async (e) => {
        await e.change((d) => {
          d.item.left = undefined;
          d.item.right = undefined;
        });
      });

      dev.button('actions: (left) null', async (e) => {
        await e.change((d) => (d.item.left = null));
      });

      dev.button('actions: (left) undefined', async (e) => {
        await e.change((d) => (d.item.left = undefined));
      });

      dev.button('actions: (left) single', async (e) => {
        const sample = Sample.actions();
        await e.change((d) => (d.item.left = sample.left[0]));
      });

      dev.button('actions: (left) multiple', async (e) => {
        const sample = Sample.actions();
        await e.change((d) => (d.item.left = sample.left));
      });

      dev.button('actions: (right) single', async (e) => {
        const sample = Sample.actions();
        await e.change((d) => (d.item.right = sample.right[1]));
      });

      dev.button('actions: (right) multiple', async (e) => {
        const sample = Sample.actions();
        await e.change((d) => (d.item.right = sample.right));
      });

      dev.button('actions: (right) button', async (e) => {
        await e.change((d) => (d.item.right = { kind: 'right:button' }));
      });

      dev.hr(-1, 5);

      const spinning = (label: string, spinning: boolean) => {
        dev.button((btn) =>
          btn.label(label).onClick(async (e) => {
            const sample = Sample.actions({ spinning });
            await e.change((d) => {
              d.item.left = sample.left;
              d.item.right = sample.right;
            });
          }),
        );
      };
      spinning('actions: spinning (start)', true);
      spinning('actions: spinning (stop)', false);

      dev.hr(-1, 5);

      dev.button(['reset', '🌳'], async (e) => {
        await e.change((d) => {
          d.item.label = undefined;
          d.item.placeholder = undefined;
          d.item.left = undefined;
          d.item.right = undefined;
          d.item.enabled = true;
          d.props.focused = false;
          d.props.selected = false;
          d.props.editing = false;
        });
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

      dev.hr(-1, 5);

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.props.debug);
        btn
          .label((e) => `debug`)
          .value((e) => value(e.state))
          .onClick((e) => e.change((d) => (local.debug = Dev.toggle(d.props, 'debug'))));
      });

      dev.boolean((btn) => {
        const value = (state: T) => Boolean(state.debug.useRenderers);
        btn
          .label((e) => `use renderers`)
          .value((e) => value(e.state))
          .onClick((e) => {
            e.change((d) => (local.useRenderers = Dev.toggle(d.debug, 'useRenderers')));
          });
      });
    });

    dev.hr(5, 20);

    dev.section(['Methods', 'inputRef = { ƒ }'], (dev) => {
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
      const data = {
        item: e.state.item,
        props,
      };
      return <Dev.Object name={name} data={data} expand={1} />;
    });
  });
});
