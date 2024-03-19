import { css, type t } from '../common';

export type TitleProps = {
  text?: string;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const Title: React.FC<TitleProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({ MarginY: 8 }),
    title: css({ fontSize: 11, opacity: 0.5 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>{props.text}</div>
    </div>
  );
};
