import { YouTube, css, t } from './common';

export type DevYoutubeProps = {
  bus: t.EventBus<any>;
  shared: t.TDevSharedPropsLens;
  style?: t.CssValue;
};

export const DevYoutube: React.FC<DevYoutubeProps> = (props) => {
  const { bus } = props;
  const current = props.shared.current;
  const isVisible = current.youtubeVisible;

  const url = current.youtubeId;
  const id = YouTube.Wrangle.id(url);
  if (!url || !id) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      opacity: isVisible ? 1 : 0,
      transition: `opacity 0.3s ease-in-out`,
    }),
    fill: css({ Absolute: 0 }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <YouTube id={id} style={styles.fill} />
    </div>
  );
};
