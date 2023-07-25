import { DEFAULTS, css, type t } from './common';
import { View as ConceptSlug } from './ui';

export type DummyProps = {
  vimeo?: t.VimeoInstance;
  style?: t.CssValue;
};

/**
 * A preloaded video slug to use to get setup with (layout positioning)
 * before dealing with passing in configuration props.
 */
export const Dummy: React.FC<DummyProps> = (props) => {
  const { vimeo } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      display: 'grid',
    }),
    rubyOverlay: css({
      Absolute: 0,
      backgroundColor: 'rgba(255, 0, 0, 0.05)' /* RED */,
      pointerEvents: 'none',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <ConceptSlug style={props.style} vimeo={vimeo} slug={DEFAULTS.sample} />
      <div {...styles.rubyOverlay} />
    </div>
  );
};
