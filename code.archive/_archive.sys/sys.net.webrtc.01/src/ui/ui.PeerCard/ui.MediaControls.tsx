import { Button, Color, css, Icons, type t } from '../common';

export type MediaControlsProps = {
  self: t.Peer;
  muted?: boolean;
  style?: t.CssValue;
  onMuteClick?(e: React.MouseEvent): void;
};

export const MediaControls: React.FC<MediaControlsProps> = (props) => {
  const { muted = false } = props;

  /**
   * [Handlers]
   */
  const handleMuteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.onMuteClick?.(e);
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    btn: css({
      backgroundColor: Color.format(0.6),
      backdropFilter: 'blur(10px)',
      Padding: [5, 15],
      borderRadius: 5,

      display: 'grid',
      placeItems: 'center',
    }),
  };

  const Icon = muted ? Icons.Mic.Off : Icons.Mic.On;

  return (
    <div {...css(styles.base, props.style)}>
      <Button onClick={handleMuteClick}>
        <div {...styles.btn}>
          <Icon />
        </div>
      </Button>
    </div>
  );
};
