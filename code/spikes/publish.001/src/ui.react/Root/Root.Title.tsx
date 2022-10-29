import { State, Color, COLORS, css, t } from '../common.mjs';

export type RootTitleProps = {
  text?: string;
  style?: t.CssValue;
  onClick?: (e?: {}) => void;
  onTitleClick?: (e?: {}) => void;
};

export const RootTitle: React.FC<RootTitleProps> = (props) => {
  const { text = 'Untitled' } = props;

  /**
   * Handlers
   */

  /**
   * [Render]
   */
  const styles = {
    base: css({
      height: 90,
      borderBottom: `solid 15px ${Color.alpha(COLORS.DARK, 0.06)}`,
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      userSelect: 'none',
    }),
    text: css({
      fontSize: 30,
      paddingLeft: 40,
    }),
  };

  return (
    <div {...css(styles.base, props.style)} onClick={props.onClick}>
      <div {...styles.text} onClick={props.onTitleClick}>
        {text}
      </div>
    </div>
  );
};
