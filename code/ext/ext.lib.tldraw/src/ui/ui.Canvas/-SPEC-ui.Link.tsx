import { COLORS, Icons, css, type t } from './common';

export type LinkProps = {
  href: string;
  title?: string;
  style?: t.CssValue;
};

export const Link: React.FC<LinkProps> = (props) => {
  const { href, title } = props;
  const url = new URL(href);
  const label = `${title || ''} ${url.hostname}`.trim();

  /**
   * Render
   */
  const styles = {
    base: css({
      marginBottom: 5,
      display: 'grid',
      justifyContent: 'start',
      gridTemplateColumns: '1fr auto',
      columnGap: '8px',
    }),
    a: css({
      fontSize: 14,
      display: 'grid',
      alignContent: 'center',
      textDecoration: 'none',
      color: COLORS.DARK,
      ':hover': { color: COLORS.BLUE },
    }),
  };

  const elAnchor = (
    <a {...styles.a} href={url.href} target={'_blank'} rel={'noopener noreferrer'}>
      {label}
    </a>
  );

  const elIcon = <Icons.ExternalLink size={16} opacity={0.5} />;

  return (
    <div {...css(styles.base, props.style)}>
      {elAnchor}
      {elIcon}
    </div>
  );
};
