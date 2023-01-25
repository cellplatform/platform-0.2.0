import React, { RefObject, useRef } from 'react';

import { containsFocus, rx, t, useFocus, withinFocus } from './common';
import { UIEvents } from './UIEvent.Events.mjs';
import { Util } from './Util.mjs';

type O = Record<string, unknown>;
type Id = string;

export type UIEventPipeHookArgs<Ctx extends O, H extends HTMLElement> = {
  bus: t.EventBus<any>;
  instance: Id;
  ctx: Ctx;
  ref?: RefObject<H>;
  redrawOnFocus?: boolean; // Cause redraw when focus/blur events fire on the [ref] element.
  enabled?: boolean;
};

/**
 * Hook for abstracting a set of DOM events through an event-bus.
 */
export function useUIEventPipe<Ctx extends O, H extends HTMLElement>(
  args: UIEventPipeHookArgs<Ctx, H>,
): t.UIEventPipeHook<Ctx, H> {
  const { instance, ctx, redrawOnFocus = false, enabled = true } = args;
  const bus = rx.busAsType<t.UIEvent>(args.bus);

  const _ref = useRef<H>(null);
  const ref = args.ref || _ref;
  const target = Util.toTarget(ref);
  useFocus(ref, { redraw: enabled && redrawOnFocus });

  const fire = (e: t.UIEvent) => {
    if (enabled) bus.fire(e);
  };

  /**
   * Target Element.
   */
  const element: t.UIEventPipeElement<H> = {
    ref,
    get containsFocus() {
      return containsFocus(ref);
    },
    get withinFocus() {
      return withinFocus(ref);
    },
  };

  /**
   * Mouse
   */
  const mouseHandler = (name: keyof t.UIEventPipeMouse): React.MouseEventHandler<H> => {
    return (e) => {
      const { button, buttons } = e;
      const mouse: t.UIMouseProps = {
        ...Util.toBase(e),
        ...Util.toModifierKeys(e),
        button,
        buttons,
        client: { x: e.clientX, y: e.clientY },
        movement: { x: e.movementX, y: e.movementY },
        page: { x: e.pageX, y: e.pageY },
        screen: { x: e.screenX, y: e.screenY },
      };
      fire({
        type: 'sys.ui.event/Mouse',
        payload: { instance, name, mouse, target, ctx },
      });
    };
  };

  /**
   * Touch
   */
  const touchHandler = (name: keyof t.UIEventPipeTouch): React.TouchEventHandler<H> => {
    return (e) => {
      const { touches, targetTouches, changedTouches } = e;
      const touch: t.UITouchProps = {
        ...Util.toBase(e),
        ...Util.toModifierKeys(e),
        touches,
        targetTouches,
        changedTouches,
      };
      fire({
        type: 'sys.ui.event/Touch',
        payload: { instance, name, touch, target, ctx },
      });
    };
  };

  /**
   * Focus
   */
  const focusHandler = (name: keyof t.UIEventPipeFocus): React.FocusEventHandler<H> => {
    return (e) => {
      const isFocused = name === 'onFocus' || name === 'onFocusCapture';
      const isBlurred = name === 'onBlur' || name === 'onBlurCapture';
      const focus: t.UIFocusProps = Util.toBase(e);
      fire({
        type: 'sys.ui.event/Focus',
        payload: { instance, name, focus, target, isFocused, isBlurred, ctx },
      });
    };
  };

  /**
   * API
   */
  return {
    bus: rx.bus.instance(bus),
    instance,
    element,
    ref,
    events: (args) => UIEvents<Ctx>({ ...args, bus, instance }),
    mouse: {
      onClick: mouseHandler('onClick'),
      onMouseDown: mouseHandler('onMouseDown'),
      onMouseDownCapture: mouseHandler('onMouseDownCapture'),
      onMouseEnter: mouseHandler('onMouseEnter'),
      onMouseLeave: mouseHandler('onMouseLeave'),
      onMouseMove: mouseHandler('onMouseMove'),
      onMouseMoveCapture: mouseHandler('onMouseMoveCapture'),
      onMouseOut: mouseHandler('onMouseOut'),
      onMouseOutCapture: mouseHandler('onMouseOutCapture'),
      onMouseOver: mouseHandler('onMouseOver'),
      onMouseOverCapture: mouseHandler('onMouseOverCapture'),
      onMouseUp: mouseHandler('onMouseUp'),
      onMouseUpCapture: mouseHandler('onMouseUpCapture'),
    },
    touch: {
      onTouchCancel: touchHandler('onTouchCancel'),
      onTouchCancelCapture: touchHandler('onTouchCancelCapture'),
      onTouchEnd: touchHandler('onTouchEnd'),
      onTouchEndCapture: touchHandler('onTouchEndCapture'),
      onTouchMove: touchHandler('onTouchMove'),
      onTouchMoveCapture: touchHandler('onTouchMoveCapture'),
      onTouchStart: touchHandler('onTouchStart'),
      onTouchStartCapture: touchHandler('onTouchStartCapture'),
      onTouchOut: touchHandler('onTouchOut'),
      onTouchOutCapture: touchHandler('onTouchOutCapture'),
    },
    focus: {
      onFocus: focusHandler('onFocus'),
      onFocusCapture: focusHandler('onFocusCapture'),
      onBlur: focusHandler('onBlur'),
      onBlurCapture: focusHandler('onBlurCapture'),
    },
  };
}
