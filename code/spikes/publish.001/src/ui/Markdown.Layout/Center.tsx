import { css, t } from '../common';

export type CenterProps = {
  children: React.ReactNode;
  style?: t.CssValue;
};

export const Center: React.FC<CenterProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({ Flex: 'x-center-center' }),
    body: css({}),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>{props.children}</div>
    </div>
  );
};
