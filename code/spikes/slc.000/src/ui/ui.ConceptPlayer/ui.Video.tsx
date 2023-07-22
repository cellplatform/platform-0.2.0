import { DEFAULTS, Vimeo, css, type t } from './common';

export type VideoProps = {
  vimeo?: t.VimeoInstance;
  video?: t.ConceptPlayerVideo;
  style?: t.CssValue;
};

export const Video: React.FC<VideoProps> = (props) => {
  const { video = {}, vimeo } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      ...Wrangle.gridCss(video?.pos),
    }),
    player: css({}),
  };

  const elPlayer = video.id && vimeo && (
    <Vimeo.Player
      //
      instance={vimeo}
      video={video.id}
      style={styles.player}
      borderRadius={15}
    />
  );

  return <div {...css(styles.base, props.style)}>{elPlayer}</div>;
};

/**
 * Helpers
 */
const Wrangle = {
  gridCss(input?: t.Pos): t.CSSProperties {
    const pos = input ?? DEFAULTS.pos;
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
