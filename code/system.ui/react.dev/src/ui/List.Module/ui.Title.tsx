import { Color, COLORS, css, t } from '../common';

export type TitleProps = {
  title?: string;
  version?: string;
  badge?: t.ModuleListBadge;
  style?: t.CssValue;
};

export const Title: React.FC<TitleProps> = (props) => {
  if (!props.title?.trim()) return null;

  /**
   * Render
   */
  const styles = {
    base: css({ display: 'grid', gridTemplateColumns: `1fr auto` }),
    left: css({ fontWeight: 'bold' }),
    right: css({ display: 'grid', alignContent: 'center' }),
    block: css({ display: 'block' }),
    version: css({
      color: Color.alpha(COLORS.DARK, 0.3),
      marginLeft: 3,
    }),
  };

  const elBadge = props.badge && (
    <a href={props.badge?.href} target={'_blank'} rel={'noopener noreferrer'}>
      <img {...styles.block} src={props.badge?.image} />
    </a>
  );

  const elTitle = (
    <>
      <span>{props.title}</span>
      {props.version && <span {...styles.version}>{`@${props.version}`}</span>}
    </>
  );

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>{elTitle}</div>
      <div {...styles.right}>{elBadge}</div>
    </div>
  );
};
