import { Util } from '../Util.mjs';
import { COLORS, Color, css, type t } from '../common';

export type DropMessageProps = {
  settings?: t.ImageDropSettings;
  style?: t.CssValue;
};

export const DropMessage: React.FC<DropMessageProps> = (props) => {
  const { settings } = props;
  const content = Util.dropOverContent(settings);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      backgroundColor: Color.alpha(COLORS.WHITE, 0.5),
      backdropFilter: 'blur(10px)',
      borderRadius: 8,
      Padding: [20, 50],
      userSelect: 'none',
    }),
    label: css({
      fontSize: 16,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.label}>{content}</div>
    </div>
  );
};
