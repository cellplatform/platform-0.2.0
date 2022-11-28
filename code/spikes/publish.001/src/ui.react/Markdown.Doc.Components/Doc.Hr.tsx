import { Color, COLORS, css, t } from '../common';

export type DocHrProps = {
  ctx: t.DocBlockCtx<t.MdastThematicBreak>;
  style?: t.CssValue;
};

export const DocHr: React.FC<DocHrProps> = (props) => {
  const { ctx } = props;
  const md = Wrangle.markdown(ctx.md.toString(ctx.node.position));
  const borderBottom = `${Wrangle.style(md)} ${Wrangle.width(md)}px ${Wrangle.color(md)}`;

  /**
   * [Render]
   */
  const styles = {
    base: css({ position: 'relative' }),
    hr: css({
      border: 'none',
      borderBottom,
      ...Wrangle.margin(md),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <hr {...styles.hr} />
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  markdown(markdown?: string) {
    return (markdown || '').trim();
  },

  width(markdown: string) {
    const length = markdown.length;
    if (length === 3) return 1;
    if (length === 4) return 1;
    if (length < 8) return 6;
    return 20;
  },

  color(markdown: string) {
    const length = markdown.length;

    let opacity = 0.1;
    if (length === 3) opacity = 0.4;
    if (length === 4) opacity = 0.3;
    if (length >= 5) opacity = 0.1;

    return Color.alpha(COLORS.DARK, opacity);
  },

  style(markdown: string) {
    const length = markdown.length;
    if (length === 3) return 'dashed';
    return 'solid';
  },

  margin(markdown: string) {
    const length = markdown.length;

    let em = 2;
    if (length > 5) em = length - 2;
    if (length > 10) em = 8;

    return {
      marginTop: `${em}em`,
      marginBottom: `${em}em`,
    };
  },
};
