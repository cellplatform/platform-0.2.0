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
  const styles = {
    base: css({ display: 'grid' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <VersionBadge theme={props.theme} />
    </div>
  );
};

/**
 * Version Badge Row.
 */
export type VersionBadgeProps = { style?: t.CssValue; theme?: t.CommonTheme };
export const VersionBadge: React.FC<VersionBadgeProps> = (props) => {
  const badge = BADGES.ci.node;

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