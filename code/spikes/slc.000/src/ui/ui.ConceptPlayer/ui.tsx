import { css, type t } from './common';
import { Video } from './ui.Video';

export const View: React.FC<t.ConceptPlayerProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Video vimeo={props.vimeo} video={props.video} style={{ Absolute: 0 }} />
    </div>
  );
};
