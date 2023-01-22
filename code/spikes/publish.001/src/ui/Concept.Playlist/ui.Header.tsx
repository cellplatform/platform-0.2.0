import { Color, COLORS, css, t } from '../common';

export type HeaderProps = {
  title: string;
  subtitle?: string;
  preview?: t.PlaylistPreview;
  style?: t.CssValue;
};

export const Header: React.FC<HeaderProps> = (props) => {
  const { preview = {} } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      boxSizing: 'border-box',
      PaddingX: 25,
      paddingBottom: 25,
    }),
    top: css({
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
    subtitle: css({
      marginTop: 20,
      fontSize: 28,
      color: Color.alpha(COLORS.DARK, 0.3),
      userSelect: 'text',
    }),

    preview: {
      image: css({
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: Boolean(preview.image)
          ? Color.alpha(COLORS.DARK, 0.3)
          : Color.alpha(COLORS.CYAN, 0.8),
        borderStyle: `${preview.image ? 'solid' : 'dashed'}`,
        borderRadius: 8,
        height: 90,
        backgroundImage: preview.image ? `url(${preview.image})` : undefined,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom center',
      }),
      title: css({
        textTransform: 'uppercase',
        Absolute: [-23, 0, 0, 0],
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.CYAN,
      }),
    },
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.top}>
        <div {...styles.left}>
          <div {...styles.title}>{props.title}</div>
        </div>
        <div {...styles.right}>
          <div {...styles.preview.image}></div>
          {preview.title && <div {...styles.preview.title}>{preview.title}</div>}
        </div>
      </div>
      {props.subtitle && <div {...styles.subtitle}>{props.subtitle}</div>}
    </div>
  );
};
