import React from 'react';
import { DevActions, ObjectView } from 'sys.ui.dev';
import { TextInput } from '..';
import { t, rx, slug, time } from '../common';
import { DevSample } from './DEV.Sample';

type Ctx = {
  events: t.TextInputEvents;
  props: t.TextInputProps;
  debug: {
    render: boolean;
    isNumericMask: boolean;
    status?: t.TextInputStatus;
    hint: boolean;
    updateHandlerEnabled: boolean;
  };
  output: { status?: t.TextInputStatus };
};

/**
 * Actions
 */
export const actions = DevActions<Ctx>()
  .namespace('ui.Text.Input')
  .context((e) => {
    if (e.prev) return e.prev;

    const instance = { bus: rx.bus(), id: `foo.${slug()}` };
    const events = TextInput.Events({ instance });

    const ctx: Ctx = {
      events,
      props: {
        instance,
        isEnabled: true,
        isReadOnly: false,
        isPassword: false,

        placeholder: 'my placeholder',
        placeholderStyle: { italic: true, opacity: 0.3 },
        focusOnLoad: true,

        autoCapitalize: false,
        autoComplete: false,
        autoCorrect: false,
        autoSize: false,
        spellCheck: false,
      },

      debug: { render: true, isNumericMask: false, hint: true, updateHandlerEnabled: true },
      output: {},
    };
    return ctx;
  })

  .init(async (e) => {
    const { ctx } = e;

    ctx.events.$.subscribe((e) => {
      // console.log('events.$:', e);
    });
  })

  .items((e) => {
    e.boolean('render', (e) => {
      if (e.changing) e.ctx.debug.render = e.changing.next;
      e.boolean.current = e.ctx.debug.render;
    });

    e.hr();
  })

  .items((e) => {
    e.title('Props');

    e.boolean('isEnabled', (e) => {
      if (e.changing) e.ctx.props.isEnabled = e.changing.next;
      e.boolean.current = e.ctx.props.isEnabled;
    });

    e.boolean('isReadOnly', (e) => {
      if (e.changing) e.ctx.props.isReadOnly = e.changing.next;
      e.boolean.current = e.ctx.props.isReadOnly;
    });

    e.boolean('isPassword', (e) => {
      if (e.changing) e.ctx.props.isPassword = e.changing.next;
      e.boolean.current = e.ctx.props.isPassword;
    });

    e.hr(1, 0.1);

    e.boolean('focusAction: "Select"', (e) => {
      if (e.changing) e.ctx.props.focusAction = e.changing.next ? 'Select' : undefined;
      e.boolean.current = Boolean(e.ctx.props.focusAction);
    });

    e.hr(1, 0.1);

    e.boolean('autoCapitalize', (e) => {
      if (e.changing) e.ctx.props.autoCapitalize = e.changing.next;
      e.boolean.current = e.ctx.props.autoCapitalize;
    });

    e.boolean('autoComplete', (e) => {
      if (e.changing) e.ctx.props.autoComplete = e.changing.next;
      e.boolean.current = e.ctx.props.autoComplete;
    });

    e.boolean('autoCorrect', (e) => {
      if (e.changing) e.ctx.props.autoCorrect = e.changing.next;
      e.boolean.current = e.ctx.props.autoCorrect;
    });

    e.boolean('autoSize', (e) => {
      if (e.changing) e.ctx.props.autoSize = e.changing.next;
      e.boolean.current = e.ctx.props.autoSize;
    });

    e.boolean('spellCheck', (e) => {
      if (e.changing) e.ctx.props.spellCheck = e.changing.next;
      e.boolean.current = e.ctx.props.spellCheck;
    });

    e.hr(1, 0.1);

    e.textbox((config) =>
      config
        .title('placeholder')
        .initial((config.ctx.props.placeholder || '<nothing>').toString())
        .pipe((e) => {
          if (e.changing?.action === 'invoke') {
            e.textbox.current = e.changing.next || undefined;
            e.ctx.props.placeholder = e.textbox.current;
          }
        }),
    );

    e.hr();
  })

  .items((e) => {
    e.title('Events');

    e.button('⚡️ Status', async (e) => {
      const res = await e.ctx.events.status.get();
      e.ctx.debug.status = res.status;
      console.group('🌳 Status');
      console.log('status', res.status);
      console.log('size', res.status?.size);
      console.groupEnd();
    });

    e.hr(1, 0.1);

    e.button('⚡️ Focus', (e) => e.ctx.events.focus.fire());
    e.button('⚡️ Blur', (e) => e.ctx.events.focus.fire(false));

    e.hr(1, 0.1);

    e.button('⚡️ Select (All)', (e) => e.ctx.events.select.fire());
    e.button('⚡️ Cursor: Start', (e) => e.ctx.events.cursor.start());
    e.button('⚡️ Cursor: End', (e) => e.ctx.events.cursor.end());

    e.hr();
  })

  .items((e) => {
    e.title('Mask');

    e.boolean('isNumeric', (e) => {
      if (e.changing) e.ctx.debug.isNumericMask = e.changing.next;
      e.boolean.current = e.ctx.debug.isNumericMask;
    });
    e.hr();
  })

  .items((e) => {
    e.title('Debug');

    let valueCounter = 0;
    e.button('change: value', (e) => {
      const focus = e.ctx.events.focus.fire;
      valueCounter++;
      e.ctx.props.value = `value-${valueCounter}`;
      time.delay(0, () => focus());
    });

    e.boolean('hint (auto-complete)', (e) => {
      if (e.changing) e.ctx.debug.hint = e.changing.next;
      e.boolean.current = e.ctx.debug.hint;
    });

    e.boolean('update handler enabled', (e) => {
      if (e.changing) e.ctx.debug.updateHandlerEnabled = e.changing.next;
      e.boolean.current = e.ctx.debug.updateHandlerEnabled;
    });

    e.hr(1, 0.1);

    e.component((e) => {
      return (
        <ObjectView
          name={'props'}
          data={e.ctx.props}
          style={{ MarginX: 15 }}
          fontSize={10}
          expandPaths={['$']}
        />
      );
    });

    e.hr(1, 0.1);

    e.component((e) => {
      return (
        <ObjectView
          name={'status'}
          data={e.ctx.output.status}
          style={{ MarginX: 15 }}
          fontSize={10}
          expandPaths={['$']}
        />
      );
    });
  })

  .subject((e) => {
    const { debug } = e.ctx;

    let mask: t.TextInputMaskHandler | undefined;
    if (debug.isNumericMask) mask = TextInput.Masks.isNumeric;

    e.settings({
      host: { background: -0.04 },
      layout: {
        width: e.ctx.props.autoSize ? undefined : 200,
        cropmarks: -0.2,
      },
    });

    if (debug.render) {
      const props = { ...e.ctx.props, mask };
      e.render(<DevSample props={props} debug={debug} />);
    }
  });

export default actions;
