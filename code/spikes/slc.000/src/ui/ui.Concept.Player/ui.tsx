import { COLORS, Color, SeekBar, css, Vimeo, type t } from './common';
import { DownloadButton } from './ui.DownloadButton';
import { PlayButton } from './ui.PlayButton';

export const View: React.FC<t.ConceptPlayerProps> = (props) => {
  const { vimeo, slug, onPlayToggle, onPlayComplete, download } = props;
  const player = Vimeo.usePlayer(vimeo, { onPlayToggle, onPlayComplete });
  const status = player.status;
  const thumbColor = status?.playing ? COLORS.BLUE : Color.alpha(COLORS.DARK, 0.5);

  /**
   * Handlers
   */
  const handleToggle = () => player.toggle();
  const handleSeekClick: t.SeekBarClickHandler = (e) => {
    if (!status) return;

    /**
     * TODO 🐷
     * - immediate UI update.
     * - wait for "status" to update, then use the new value.
     */

    const secs = status.duration * e.progress;
    player.events?.seek.fire(secs);
    if (!player.playing) player.play();
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignContent: 'center',
    }),
    left: css({ display: 'grid', marginRight: 15 }),
    middle: css({ display: 'grid', alignContent: 'center' }),
    right: css({ display: 'grid', marginLeft: 15 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <PlayButton isPlaying={player.playing} onClick={handleToggle} />
      </div>
      <div {...styles.middle}>
        <SeekBar thumbColor={thumbColor} progress={status?.percent} onClick={handleSeekClick} />
      </div>
      {download && (
        <div {...styles.right}>
          <DownloadButton data={download} />
        </div>
      )}
    </div>
  );
};
