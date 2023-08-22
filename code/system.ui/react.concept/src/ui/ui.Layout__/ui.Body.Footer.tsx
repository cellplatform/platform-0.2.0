import { Video, css, type t } from './common';

export type FooterProps = {
  slug?: t.SlugListItem;
  video?: t.LayoutVideoState;
  style?: t.CssValue;
  onVideo?: t.LayoutVideoHandler;
};

export const Footer: React.FC<FooterProps> = (props) => {
  const { slug, video } = props;
  const fireVideo = (next: Partial<t.LayoutVideoState>) => props.onVideo?.({ ...video, ...next });

  /**
   * [Render]
   */
  const styles = {
    base: css({
      PaddingX: 8,
      display: 'grid',
      alignItems: 'center',
    }),
    playbar: css({}),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Video.PlayBar
        status={video?.status}
        style={styles.playbar}
        size={'Medium'}
        useKeyboard={true}
        onSeek={(e) => fireVideo({ timestamp: e.seconds })}
        onMute={(e) => fireVideo({ muted: e.muted })}
        onPlayAction={(e) => {
          const playing = e.is.playing;
          const timestamp = e.replay ? 0 : undefined;
          fireVideo({ playing, timestamp });
        }}
      />
    </div>
  );
};
