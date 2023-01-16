import { css, t } from '../common';

export type SpecListFooterProps = {
  style?: t.CssValue;
};

export const SpecListFooter: React.FC<SpecListFooterProps> = (props) => {
  const styles = {
    base: css({ height: 80 }),
  };
  return <div {...css(styles.base, props.style)}></div>;
};
