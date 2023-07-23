import { css, type t } from './common';
import { PlayButton } from './ui.PlayButton';
import { usePlayer } from './usePlayer.mjs';

export const View: React.FC<t.ConceptPlayerProps> = (props) => {
  const { vimeo, slug } = props;
  const player = usePlayer(vimeo);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      alignContent: 'center',
      columnGap: 5,
      rowGap: 5,
    }),
    left: css({}),
    right: css({
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  const elPlayButton = <PlayButton playing={player.playing} onClick={() => player.toggle()} />;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>{elPlayButton}</div>
      <div {...styles.right}>{'Progress'}</div>
    </div>
  );
};
