import { COLORS, DEFAULTS, FC, MediaStream, css, type t } from './common';
import { Empty } from './ui.Empty';
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
  };

  const elMain = stream && <MediaStream.Video stream={stream} muted={true} style={styles.main} />;
  const elEmpty = !stream && <Empty message={props.message} />;

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
