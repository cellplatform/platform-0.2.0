import { Model, type t } from './common';

/**
 * Tap into component event handlers
 * and bubble through the command <Observable>.
 */
export function useBubbleEvents(base: t.LabelItemPropsHandlers, item?: t.LabelItemState) {
  const dispatch = Model.Item.commands(item);
  const handlers: t.LabelItemPropsHandlers = {
    ...base,

    onKeyDown(e) {
      dispatch.key.down(e);
      base.onKeyDown?.(e);
    },
    onKeyUp(e) {
      dispatch.key.up(e);
      base.onKeyUp?.(e);
    },
    onActionClick(e) {
      dispatch.action(e);
      base.onActionClick?.(e);
    },
    onClick(e) {
      dispatch.click(e);
      base.onClick?.(e);
    },
    onDoubleClick(e) {
      dispatch.click(e);
      base.onDoubleClick?.(e);
    },
    onLabelDoubleClick(e) {
      dispatch.click(e);
      base.onLabelDoubleClick?.(e);
    },
  };

  /**
   * API
   */
  return handlers;
}
