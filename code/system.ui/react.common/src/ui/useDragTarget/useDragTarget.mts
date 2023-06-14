import { useEffect, useRef, useState } from 'react';
import { type t } from '../common';
import { readDropEvent } from './util.mjs';

type OnDrop = (e: t.Dropped) => void;
type Args<T extends HTMLElement> = {
  ref?: React.RefObject<T>;
  isEnabled?: boolean;
  onDrop?: OnDrop;
  onDragOver?: (e: { isOver: boolean }) => void;
};

/**
 * Provides hooks for treating a DIV element as a "drag-n-drop" target.
 */
export function useDragTarget<T extends HTMLElement>(
  input?: Partial<Args<T>> | OnDrop,
): t.DragTargetHook<T> {
  const args = wrangle<T>(useRef<T>(null), input);
  const { ref, onDrop, isEnabled = true } = args;

  const [isDragOver, setDragOver] = useState<boolean>(false);
  const [dropped, setDropped] = useState<t.Dropped | undefined>();

  const changeDragOver = (isOver: boolean) => {
    setDragOver((prev) => {
      if (isOver !== prev) args.onDragOver?.({ isOver });
      return isOver;
    });
  };

  const reset = () => {
    changeDragOver(false);
    setDropped(undefined);
  };

  useEffect(() => {
    const el = ref.current as HTMLElement;
    let count = 0;

    const dragHandler = (fn?: (e: Event) => void) => {
      return (e: Event) => {
        if (isEnabled) {
          e.preventDefault();
          fn?.(e);
          changeDragOver(count > 0);
        }
      };
    };

    const handleDragEnter = dragHandler(() => count++);
    const handleDragOver = dragHandler(() => (count = count === 0 ? 1 : count));
    const handleDragLeave = dragHandler(() => count--);
    const handleMouseLeave = dragHandler(() => (count = 0));

    const handleDrop = async (e: DragEvent) => {
      if (isEnabled) {
        e.preventDefault();
        changeDragOver(false);
        count = 0;
        const { files, urls } = await readDropEvent(e);
        const dropped: t.Dropped = { files, urls };
        setDropped(dropped);
        onDrop?.(dropped);
      }
    };

    el.addEventListener('dragenter', handleDragEnter);
    el.addEventListener('dragover', handleDragOver);
    el.addEventListener('dragleave', handleDragLeave);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('drop', handleDrop);

    return () => {
      el.removeEventListener('dragenter', handleDragEnter);
      el.removeEventListener('dragover', handleDragOver);
      el.removeEventListener('dragleave', handleDragLeave);
      el.removeEventListener('mouseleave', handleMouseLeave);
      el.removeEventListener('drop', handleDrop);
    };
  }, [ref, isEnabled, onDrop]); // eslint-disable-line

  return {
    ref,
    isDragOver,
    isDropped: Boolean(dropped),
    isEnabled,
    dropped,
    reset,
  };
}

/**
 * [Helpers]
 */
function wrangle<T extends HTMLElement>(
  ref: React.RefObject<T>,
  input?: Partial<Args<T>> | OnDrop,
) {
  if (typeof input === 'function') return { ref, onDrop: input };
  if (input === undefined) return { ref };
  return { ...input, ref: input.ref ?? ref };
}
