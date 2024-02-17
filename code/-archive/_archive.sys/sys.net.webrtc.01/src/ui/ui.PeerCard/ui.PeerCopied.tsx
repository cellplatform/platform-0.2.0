import { Color, COLORS, css, Icons, type t } from '../common';

export type PeerCopiedProps = {
  message?: string;
  style?: t.CssValue;
};

export const PeerCopied: React.FC<PeerCopiedProps> = (props) => {
  const { message = 'Copied your local peer-id' } = props;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      backgroundColor: Color.alpha(COLORS.WHITE, 0.6),
      backdropFilter: 'blur(5px)',
      display: 'grid',
      placeItems: 'center',
    }),
    message: {
      base: css({
        backgroundColor: Color.alpha(COLORS.WHITE, 0.7),
        border: `solid 1px ${Color.format(1)}`,
        borderRadius: 10,
        Padding: [15, 30],
        Flex: 'x-center-center',
      }),
      text: css({
        display: 'grid',
        placeItems: 'center',
        boxSizing: 'border-box',
        fontSize: 20,
      }),
      icon: css({ marginLeft: 20 }),
    },
  };

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.message.base}>
        <div {...styles.message.text}>{message}</div>
        <div {...styles.message.icon}>
          <Icons.Done.Outline color={COLORS.GREEN} />
        </div>
      </div>
    </div>
  );
};
