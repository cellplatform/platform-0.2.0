import { DEFAULTS, type t } from './common';

type B = t.LabelItemBehaviorKind;

/**
 * Helpers
 */
export const Wrangle = {
  enabled(props: { enabled?: boolean; useBehaviors?: B[] }, ...match: B[]) {
    const { useBehaviors = DEFAULTS.useBehaviors.defaults } = props;
    return (props.enabled ?? true) && Wrangle.isUsing(useBehaviors, ...match);
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
