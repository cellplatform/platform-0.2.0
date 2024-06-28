import { useState } from 'react';
import { BADGES, Color, Peer, PeerUI, Pkg, css, type t } from './common';

export type DebugFooterProps = {
  network: t.NetworkStore;
  selectedStream?: MediaStream;
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onStreamSelected?: (stream?: MediaStream) => void;
};

export const DebugFooter: React.FC<DebugFooterProps> = (props) => {
  const { network } = props;
  const peer = network.peer;
  const media = peer.current.connections.filter((conn) => Peer.Is.Kind.media(conn));
  const hasMedia = media.length > 0;

  /**
   * Hooks
   */
  const [_, setRedraw] = useState(0);
  const redraw = () => setRedraw((n) => n + 1);

  /**
   * Render
   */
  const styles = {
    base: css({ display: 'grid', userSelect: 'none' }),
    avatars: css({
      display: hasMedia ? 'grid' : 'none',
      borderBottom: `solid 1px ${Color.alpha(Color.DARK, 0.15)}`,
      padding: 10,
    }),
  };

  const elAvatars = (
    <div {...styles.avatars}>
      <PeerUI.AvatarTray
        peer={peer}
        size={100}
        muted={false}
        onTotalChanged={redraw}
        selected={props.selectedStream}
        onSelection={(e) => props.onStreamSelected?.(e.selected)}
      />
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elAvatars}
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
      userSelect: 'auto',
    }),
  };

  const elBadge = (
    <a href={badge?.href} target={'_blank'} rel={'noopener noreferrer'} tabIndex={-1}>
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
