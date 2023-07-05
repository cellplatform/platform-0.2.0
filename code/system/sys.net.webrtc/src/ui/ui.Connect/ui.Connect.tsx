import { Style, DEFAULTS, css, type t } from './common';

import { WebRtcInfo } from '../ui.Info';
import { ConnectInput } from './ui.Connect.Input';
import { Loading } from './ui.Connect.Loading';

export const Connect: React.FC<t.ConnectProps> = (props) => {
  if (props.loading) return <Loading />;

  const { fields = DEFAULTS.fields.default } = props;
  const isCard = props.card ?? DEFAULTS.card;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      boxSizing: 'border-box',
      ...Style.toMargins(props.margin),
    }),
    info: css({
      marginLeft: 32,
      marginRight: isCard ? 32 : 15,
    }),
  };

  const elTop = <ConnectInput {...props} targetEdge={'Top'} />;
  const elBottom = <ConnectInput {...props} targetEdge={'Bottom'} />;

  const elInfo = (
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
