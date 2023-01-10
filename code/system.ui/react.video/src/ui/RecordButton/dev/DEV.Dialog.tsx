import { COLORS, Color, css, t } from './common';

export type DevDialogProps = {
  children?: React.ReactNode;
  style?: t.CssValue;
};

export const DevDialog: React.FC<DevDialogProps> = (props) => {
  const border = `solid 1px ${Color.format(-0.15)}`;

  const styles = {
    base: css({ flex: 1, Flex: 'vertical-stretch-stretch' }),
    body: css({ flex: 1, display: 'flex' }),
    footer: {
      base: css({
        borderTop: border,
        Flex: 'horizontal-stretch-stretch',
        color: COLORS.DARK,
        fontSize: 13,
      }),
      button: {
        base: css({
          flex: 1,
          Flex: 'center-center',
          paddingTop: 8,
          paddingBottom: 9,
        }),
        left: css({}),
        right: css({
          backgroundColor: COLORS.BLUE,
          color: COLORS.WHITE,
        }),
      },
    },
  };
  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.body}>{props.children}</div>
      <div {...styles.footer.base}>
        <div {...css(styles.footer.button.base, styles.footer.button.left)}>Cancel</div>
        <div {...css(styles.footer.button.base, styles.footer.button.right)}>OK</div>
      </div>
    </div>
  );
};
