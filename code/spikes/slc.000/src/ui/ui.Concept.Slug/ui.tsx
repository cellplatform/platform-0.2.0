import { css, type t } from './common';
import { VideoLayout } from './ui.Video.Layout';

export const View: React.FC<t.ConceptSlugProps> = (props) => {
  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <VideoLayout vimeo={props.vimeo} slug={props.video} style={{ Absolute: 0 }} />
    </div>
  );
};
