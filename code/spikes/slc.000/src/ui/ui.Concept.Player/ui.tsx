import { SeekBar, css, type t } from './common';
import { DownloadButton } from './ui.DownloadButton';
import { PlayButton } from './ui.PlayButton';
import { usePlayer } from './usePlayer.mjs';

export const View: React.FC<t.ConceptPlayerProps> = (props) => {
  const { vimeo, slug, onComplete, download } = props;
  const player = usePlayer(vimeo, { onComplete });
  const status = player.status;

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
      columnGap: 15,
    }),
    left: css({ display: 'grid' }),
    middle: css({ display: 'grid', alignContent: 'center' }),
    right: css({ display: 'grid' }),
  };

  const elDownload = download && <DownloadButton data={download} />;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <PlayButton isPlaying={player.playing} onClick={handleToggle} />
      </div>
      <div {...styles.middle}>
        <SeekBar progress={status?.percent} onClick={handleSeekClick} />
      </div>
      <div {...styles.right}>{elDownload}</div>
    </div>
  );
};
