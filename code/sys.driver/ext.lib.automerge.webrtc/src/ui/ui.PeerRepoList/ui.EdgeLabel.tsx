import { COLORS, Color, css, useMouse, type t } from './common';

export type EdgeLabelProps = t.PeerRepoListPropsDebugLabel & { style?: t.CssValue };

export const EdgeLabel: React.FC<EdgeLabelProps> = (props) => {
  const { align = 'Left', text = 'Unnamed' } = props;
  const mouse = useMouse();

  if (!text) return null;

  /**
   * Render
   */
  const styles = {
    base: css({
      Absolute: props.absolute ?? [-18, 0, null, 0],
      userSelect: 'none',
      fontFamily: 'monospace',
      fontSize: 9,
      color: Color.alpha(COLORS.DARK, mouse.is.over ? 1 : 0.15),
      transition: `color 0.2s`,
      display: 'grid',
      justifyContent: align === 'Left' ? 'start' : 'end',
      PaddingX: 7,
    }),
  };

  return (
    <div {...css(styles.base, props.style)} {...mouse.handlers}>
      <div>{text}</div>
    </div>
  );
};
