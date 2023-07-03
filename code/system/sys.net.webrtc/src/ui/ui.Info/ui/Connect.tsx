import { ConnectInput } from '../../ui.ConnectInput';
import { COLORS, Color, css, type t } from '../common';

type Edge = 'Top' | 'Bottom';

export type ConnectProps = {
  edge: Edge;
  data: t.WebRtcInfoData;
  style?: t.CssValue;
};

export const Connect: React.FC<ConnectProps> = (props) => {
  const data = props.data.connect;
  const self = data?.self;

  if (!self) return null;

  /**
   * [Render]
   */
  const borderValue = `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`;
  const border = (edge: Edge) => (props.edge === edge ? borderValue : undefined);
  const styles = {
    base: css({
      borderTop: border('Bottom'),
      borderBottom: border('Top'),
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <ConnectInput fields={['Peer:Self', 'Peer:Remote']} self={self} />
    </div>
  );
};
