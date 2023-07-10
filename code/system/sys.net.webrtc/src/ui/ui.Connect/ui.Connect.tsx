import { Style, DEFAULTS, css, type t } from './common';

import { WebRtcInfo } from '../ui.Info';
import { ConnectInputEdge } from './ui.Connect.Input.Edge';
import { Loading } from './ui.Connect.Loading';

export const Connect: React.FC<t.ConnectProps> = (props) => {
  if (props.loading) return <Loading />;

  const { fields = DEFAULTS.fields.default, showInfo = DEFAULTS.showInfo } = props;
  const isCard = props.showInfoAsCard ?? DEFAULTS.showInfoAsCard;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      boxSizing: 'border-box',
      ...Style.toMargins(props.margin),
    }),
    info: css({
      MarginX: 15,
    }),
  };

  const elTop = <ConnectInputEdge {...props} targetEdge={'Top'} />;
  const elBottom = <ConnectInputEdge {...props} targetEdge={'Bottom'} />;

  const elInfo = showInfo && (
    <WebRtcInfo
      fields={fields}
      client={props.client}
      data={props.info}
      style={styles.info}
      card={isCard}
    />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elTop}
      {elInfo}
      {elBottom}
    </div>
  );
};
