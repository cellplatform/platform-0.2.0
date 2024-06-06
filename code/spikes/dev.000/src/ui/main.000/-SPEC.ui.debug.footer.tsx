import { BADGES, Color, Pkg, css, type t } from './common';

export type DebugFooterProps = {
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const DebugFooter: React.FC<DebugFooterProps> = (props) => {
  const {} = props;

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      padding: 7.5,
    }),
    block: css({ display: 'block' }),
    version: css({
      fontFamily: 'monospace',
      fontSize: 11,
      alignSelf: 'center',
      justifySelf: 'end',
    }),
  };

  const badge = BADGES.ci.node;
  const elBadge = (
    <a href={badge?.href} target={'_blank'} rel={'noopener noreferrer'}>
      <img {...styles.block} src={badge?.image} />
    </a>
  );

  const elVersion = <div {...styles.version}>{`v${Pkg.version}`}</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elBadge}
      {elVersion}
    </div>
  );
};
