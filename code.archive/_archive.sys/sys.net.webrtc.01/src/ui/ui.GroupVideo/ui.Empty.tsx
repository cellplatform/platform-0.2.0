import { DEFAULTS, css, type t } from './common';

export type EmptyProps = {
  message?: string | JSX.Element;
  style?: t.CssValue;
};

export const Empty: React.FC<EmptyProps> = (props) => {
  const { message = DEFAULTS.empty.message } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      userSelect: 'none',
      opacity: 0.3,

      display: 'grid',
      placeItems: 'center',
    }),
  };

  return <div {...css(styles.base, props.style)}>{message}</div>;
};
