import { COLORS, Color, DEFAULTS, FC, css, type t } from './common';

const View: React.FC<t.EmptyProps> = (props) => {
  const { message = DEFAULTS.message } = props;
  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: props.abs ? 0 : undefined,
      userSelect: 'none',
      display: 'grid',
      placeItems: 'center',
    }),
    message: css({
      fontSize: 14,
      color: Color.alpha(COLORS.DARK, 0.5),
      fontStyle: props.italic ? 'italic' : undefined,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.message}>{message}</div>
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const Empty = FC.decorate<t.EmptyProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Concept.Empty' },
);
