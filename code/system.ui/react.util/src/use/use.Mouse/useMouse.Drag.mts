import { useState } from 'react';
import { type t } from '../common';

/**
 * Internal hook that trackes mouse movement events (drag).
 */
export function useMouseDrag(onMove?: t.UseMouseDragHandler) {
  const enabled = Boolean(onMove);
  const [dragging, setDragging] = useState(false);
  const [movement, setMovement] = useState<t.UseMouseMovement>();

  const reset = () => {
    setDragging(false);
    setMovement(undefined);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!enabled) return;
    const movement = Wrangle.toMouseMovement(event);
    setDragging(true);
    setMovement(movement);
    onMove?.({ event, movement, cancel: api.cancel });
  };

  const handleSelectStart = (e: Event) => {
    // NB: Prevent content around the slider from being selected while thumb is dragging.
    e.preventDefault();
  };

  /**
   * API
   */
  const api = {
    enabled,
    is: { dragging },
    movement,
    start() {
      const attach = document.addEventListener;
      attach('mousemove', handleMouseMove);
      attach('selectstart', handleSelectStart);
      attach('mouseup', api.cancel);
    },
    cancel() {
      const detach = document.removeEventListener;
      detach('mousemove', handleMouseMove);
      detach('selectstart', handleSelectStart);
      detach('mouseup', api.cancel);
      reset();
    },
  } as const;
  return api;
}

/**
 * Helpers
 */
const Wrangle = {
  toMouseMovement(e: MouseEvent): t.UseMouseMovement {
    const { x, y } = e;
    const modifiers: t.KeyboardModifierFlags = {
      shift: e.shiftKey,
      ctrl: e.ctrlKey,
      alt: e.altKey,
      meta: e.metaKey,
    };
    return {
      x,
      y,
      movement: { x: e.movementX, y: e.movementY },
      client: { x: e.clientX, y: e.clientY },
      page: { x: e.pageX, y: e.pageY },
      offset: { x: e.offsetX, y: e.offsetY },
      screen: { x: e.screenX, y: e.screenY },
      modifiers,
      button: e.button,
    };
  },
} as const;
