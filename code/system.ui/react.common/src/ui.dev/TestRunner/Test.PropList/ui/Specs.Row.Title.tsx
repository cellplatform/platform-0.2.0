import { css, type t } from '../common';

export type TitleProps = {
  text?: string;
  style?: t.CssValue;
};

export const Title: React.FC<TitleProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({ marginBottom: 5 }),
    title: css({ fontSize: 9 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.title}>{props.text}</div>
    </div>
  );
};
