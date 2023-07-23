import { DEFAULTS, Position, Vimeo, css, type t } from './common';

export type VideoProps = {
  vimeo?: t.VimeoInstance;
  slug?: t.ConceptSlugVideo;
  style?: t.CssValue;
};

export const VideoLayout: React.FC<VideoProps> = (props) => {
  const { slug = {}, vimeo } = props;
  const pos = slug.position;

  /**
   * [Render]
   */
  const styles = {
    player: css({}),
  };

  const elPlayer = Boolean(slug.id && vimeo) && (
    <Vimeo.Player
      //
      instance={vimeo}
      video={slug.id}
      style={styles.player}
      borderRadius={10}
    />
  );

  return (
    <Position position={pos} style={props.style}>
      {elPlayer}
    </Position>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  gridCss(input?: t.Pos): t.CSSProperties {
    const pos = input ?? DEFAULTS.position;
    return {
      display: 'grid',
      justifyContent: Wrangle.justifyContent(pos[0]),
      alignContent: Wrangle.alignContent(pos[1]),
    } as const;
  },

  justifyContent(x: t.PositionX) {
    if (x === 'left') return 'start';
    if (x === 'center') return 'center';
    if (x === 'right') return 'end';
    return 'start';
  },

  alignContent(x: t.PositionY) {
    if (x === 'top') return 'start';
    if (x === 'center') return 'center';
    if (x === 'bottom') return 'end';
    return 'start';
  },
};
