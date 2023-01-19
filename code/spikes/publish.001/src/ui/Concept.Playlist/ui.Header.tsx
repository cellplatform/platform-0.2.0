import { Color, COLORS, css, t, rx } from '../common';

type Url = string;

export type HeaderProps = {
  title: string;
  previewImage?: Url;
  previewTitle?: string;
  style?: t.CssValue;
};

export const Header: React.FC<HeaderProps> = (props) => {
  const { previewTitle, previewImage } = props;

  console.log('previewImage', previewImage);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      boxSizing: 'border-box',
      PaddingX: 25,
      paddingBottom: 25,
      display: 'grid',
      userSelect: 'none',
      gridTemplateColumns: '1fr auto',
      columnGap: 25,
    }),
    left: css({
      position: 'relative',
      display: 'grid',
      alignContent: 'end',
    }),
    right: css({
      position: 'relative',
      width: 150,
    }),
    title: css({
      fontSize: 28,
      userSelect: 'text',
    }),
    preview: css({
      backgroundColor: COLORS.WHITE,
      border: `1px ${Color.alpha(COLORS.DARK, Boolean(previewImage) ? 0.25 : 0.12)}`,
      borderStyle: `${previewImage ? 'solid' : 'dashed'}`,
      borderRadius: 8,
      height: 90,
      backgroundImage: previewImage ? `url(${previewImage})` : undefined,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'bottom center',
      // backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    categoryTitle: css({
      textTransform: 'uppercase',
      Absolute: [-23, 0, 0, 0],
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 'bold',
      color: COLORS.CYAN,
    }),
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <div {...styles.title}>{props.title}</div>
      </div>
      <div {...styles.right}>
        <div {...styles.preview}></div>
        {previewTitle && <div {...styles.categoryTitle}>{previewTitle}</div>}
      </div>
    </div>
  );
};
