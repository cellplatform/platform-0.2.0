import { type t } from '../common';

type M = React.MouseEventHandler;
type XY = { x: number; y: number };

export type UseMouseProps = {
  onDown?: M;
  onUp?: M;
  onEnter?: M;
  onLeave?: M;
  onDrag?: UseMouseDragHandler;
};

export type UseMouseMovement = {
  readonly x: number;
  readonly y: number;
  readonly movement: XY;
  readonly client: XY;
  readonly page: XY;
  readonly offset: XY;
  readonly screen: XY;
  readonly button: number;
  readonly modifiers: t.KeyboardModifierFlags;
};

/**
 * Events
 */
export type UseMouseDragHandler = (e: UseMouseDragHandlerArgs) => void;
export type UseMouseDragHandlerArgs = UseMouseMovement & { cancel(): void };
