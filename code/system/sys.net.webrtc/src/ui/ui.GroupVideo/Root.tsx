import { COLORS, DEFAULTS, FC, MediaStream, css, type t } from './common';
import { useController } from './useController.mjs';

export const View: React.FC<t.GroupVideoProps> = (props) => {
  const { client, selected } = props;

  const controller = useController({ client, selected });
  const stream = controller.media;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative', backgroundColor: COLORS.WHITE }),
    main: css({ Absolute: 0 }),
    empty: css({
      Absolute: 0,
      display: 'grid',
      placeItems: 'center',
      opacity: 0.3,
      userSelect: 'none',
    }),
  };

  const elMain = stream && <MediaStream.Video stream={stream} muted={true} style={styles.main} />;
  const elEmpty = !stream && <div {...styles.empty}>No media to display.</div>;

  return (
    <div {...css(styles.base, props.style)}>
      {elMain}
      {elEmpty}
    </div>
  );
};

/**
 * Export
 */
type Fields = {
  DEFAULTS: typeof DEFAULTS;
};
export const GroupVideo = FC.decorate<t.GroupVideoProps, Fields>(
  View,
  { DEFAULTS },
  { displayName: 'GroupVideo' },
);
