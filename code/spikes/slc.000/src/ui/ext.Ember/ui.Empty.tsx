import { DEFAULTS, css, type t } from './common';

export type EmptyProps = {
  text?: string;
  style?: t.CssValue;
};

export const Empty: React.FC<EmptyProps> = (props) => {
  const { text = DEFAULTS.text.nothingToDisplay } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      userSelect: 'none',
      fontStyle: 'italic',
      fontSize: 14,
      opacity: 0.3,
      display: 'grid',
      placeItems: 'center',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div>{text}</div>
    </div>
  );
};
