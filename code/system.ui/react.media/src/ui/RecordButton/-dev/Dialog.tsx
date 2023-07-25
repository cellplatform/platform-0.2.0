import { PropList } from '../../../test.ui';
import { COLORS, Color, css, type t } from '../common';

export const DialogKinds = ['hello', 'dev/dialog'] as const;
export type DialogKind = (typeof DialogKinds)[number];

export type DevDialogProps = {
  children?: JSX.Element;
  style?: t.CssValue;
};

export const HelloDialog = () => {
  const style: t.CssValue = { flex: 1, padding: 15 };
  return <div style={style}>Hello! 👋</div>;
};

export const DevDialog: React.FC<DevDialogProps> = (props) => {
  const border = `solid 1px ${Color.format(-0.15)}`;

  const styles = {
    base: css({ flex: 1, display: 'grid', gridTemplateRows: '1fr auto' }),
    body: css({ display: 'grid' }),
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

export const dialogFactory = (kind: DialogKind) => {
  const style: t.CssValue = { flex: 1, padding: 15 };
  const elHello = <div style={style}>Hello! 👋</div>;

  if (kind === 'hello') {
    return elHello;
  }

  if (kind === 'dev/dialog') {
    return (
      <DevDialog>
        <PropList
          margin={[10, 12]}
          title={'PropList'}
          items={[
            { label: 'foo', value: 123 },
            { label: 'bar', value: 456 },
            { label: 'baz', value: 'Hello! 👋' },
          ]}
        />
      </DevDialog>
    );
  }

  return undefined;
};
