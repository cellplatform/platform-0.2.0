import { WebRtcInfo } from '../ui.Info';
import { DEFAULTS, css, type t } from './common';
import { ConnectInput } from './ui.Connect.Input';

export const Connect: React.FC<t.ConnectProps> = (props) => {
  const { fields = DEFAULTS.fields } = props;
  const isCard = props.card ?? DEFAULTS.card;

  /**
   * [Render]
   */
  const styles = {
    base: css({ boxSizing: 'border-box' }),
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
