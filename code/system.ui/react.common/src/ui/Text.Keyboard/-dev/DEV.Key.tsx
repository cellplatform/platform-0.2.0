import { t, Card, Color, COLORS, css, TextSyntax } from './DEV.common';

export const DevKeyDefaults = { SPACING: 4 };

export type DevKeyProps = {
  label?: string | JSX.Element;
  isPressed?: boolean;
  isEdge?: boolean;
  spacing?: number;
  paddingX?: number;
  style?: t.CssValue;
};

export const DevKey: React.FC<DevKeyProps> = (props) => {
  const {
    label = '?',
    isPressed = false,
    isEdge = false,
    paddingX = 12,
    spacing = DevKeyDefaults.SPACING,
  } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      boxSizing: 'border-box',
      overflow: 'hidden',
      transform: `translate(0, ${isPressed ? 2 : 0}px)`,
      marginRight: spacing,
      ':last-child': { marginRight: 0 },
    }),
    bg: css({
      Absolute: 0,
      backgroundColor: isPressed && isEdge ? Color.alpha(COLORS.MAGENTA, 0.04) : undefined,
    }),
    body: css({
      position: 'relative',
      Padding: [5, paddingX, 7, paddingX],
    }),
    label: css({
      fontFamily: 'monospace',
      fontWeight: 'bold',
      fontSize: 13,
    }),
  };

  const elLabel =
    typeof label !== 'string' ? label : <TextSyntax text={`<${label}>`} style={styles.label} />;

  return (
    <Card style={css(styles.base, props.style)}>
      <div {...styles.bg} />
      <div {...styles.body}>{elLabel}</div>
    </Card>
  );
};
