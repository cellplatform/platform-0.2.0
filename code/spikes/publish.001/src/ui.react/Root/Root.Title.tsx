import { State, Color, COLORS, css, t } from '../common';

export type RootTitleProps = {
  text?: string;
  style?: t.CssValue;
  onClick?: (e?: {}) => void;
  onTitleClick?: (e?: {}) => void;
};

export const RootTitle: React.FC<RootTitleProps> = (props) => {
  const { text = 'Untitled' } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      height: 90,
      userSelect: 'none',
      borderBottom: `solid 1px ${Color.alpha(COLORS.DARK, 0.2)}`,
      Flex: 'x-spaceBetween-stretch',
    }),
    text: css({
      fontSize: 30,
      paddingLeft: 40,
    }),
    edge: css({
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }),
    left: css({}),
    right: css({}),
    title: css({}),
  };

  const elLeft = (
    <div {...css(styles.edge, styles.left)}>
      <div {...styles.text} onClick={props.onTitleClick}>
        {text}
      </div>
    </div>
  );

  const elRight = (
    <div {...css(styles.edge, styles.right)}>
      <div></div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)} onClick={props.onClick} data-tauri-drag-region>
      {elLeft}
      {elRight}
    </div>
  );
};
