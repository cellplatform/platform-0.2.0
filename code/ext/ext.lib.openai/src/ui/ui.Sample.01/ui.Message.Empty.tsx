import { css, type t } from './common';

export type EmptyMessageProps = {
  style?: t.CssValue;
};

export const EmptyMessage: React.FC<EmptyMessageProps> = (props) => {
  /**
   * Render
   */
  const styles = {
    base: css({ display: 'grid', placeItems: 'center', padding: 6 }),
    label: css({ fontSize: 14, opacity: 0.3, userSelect: 'none' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.label}>{`nothing to display`}</div>
    </div>
  );
};
