import { DEFAULTS, FC, css, type t } from './common';

const View: React.FC<t.TooSmallProps> = (props) => {
  const { message = DEFAULTS.message } = props;
  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      userSelect: 'none',
      display: 'grid',
      placeItems: 'center',
    }),
    message: css({
      opacity: 0.5,
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
export const Root = FC.decorate<t.TooSmallProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'Root' },
);
