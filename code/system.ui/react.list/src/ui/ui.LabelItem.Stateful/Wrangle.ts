import { DEFAULTS, type t } from './common';
import { dataid } from './Wrangle.dataid';
type B = t.LabelItemBehaviorKind;

/**
 * Helpers
 */
export const Wrangle = {
  dataid,

  enabled(props: { enabled?: boolean; behaviors?: B[] }, ...match: B[]) {
    const { behaviors = DEFAULTS.behaviors.defaults } = props;
    return (props.enabled ?? true) && Wrangle.isUsing(behaviors, ...match);
  },

  isUsing(kinds: B[], ...match: B[]) {
    return match.some((kind) => kinds.includes(kind));
  },

  pluckHandlers(props: t.LabelItemPropsHandlers): t.LabelItemPropsHandlers {
    const {
      onReady,
      onEditChange,
      onKeyDown,
      onKeyUp,
      onFocusChange,
      onClick,
      onDoubleClick,
      onLabelDoubleClick,
      onEditClickAway,
      onActionClick,
    } = props;
    return {
      onReady,
      onEditChange,
      onKeyDown,
      onKeyUp,
      onFocusChange,
      onClick,
      onDoubleClick,
      onLabelDoubleClick,
      onEditClickAway,
      onActionClick,
    };
  },
} as const;
