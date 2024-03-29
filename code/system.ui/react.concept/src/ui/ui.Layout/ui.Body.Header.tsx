import { css, type t } from './common';

export type HeaderProps = {
  slug?: t.SlugListItem;
  style?: t.CssValue;
};

export const Header: React.FC<HeaderProps> = (props) => {
  const { slug } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      alignContent: 'end',
      boxSizing: 'border-box',
      paddingBottom: 5,
    }),
    title: css({
      fontSize: 12,
    }),
  };

  const elTitle = slug && <div {...styles.title}>{slug.title}</div>;

  return <div {...css(styles.base, props.style)}>{elTitle}</div>;
};
