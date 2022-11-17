import { css, t } from '../common';

type UrlString = string;

export type VideoDiagramContentProps = {
  src?: UrlString;
  dimmed?: boolean;
  style?: t.CssValue;
};

export const VideoDiagramContent: React.FC<VideoDiagramContentProps> = (props) => {
  const { dimmed = false, src } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      opacity: dimmed ? 0.4 : 1,
      transition: `opacity 300ms`,
      userSelect: 'none',
      pointerEvents: 'none',
    }),
    image: css({
      Absolute: 0,
      backgroundSize: 'contain',
      backgroundImage: `url(${src})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.image} />
    </div>
  );
};
