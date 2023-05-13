import { Row } from './DEV.Remotes.Row';
import { css, t } from './common';

export type DevRemotesProps = {
  self: t.WebRtcController;
  remotes?: t.TDevRemote[];
  style?: t.CssValue;
};

export const DevRemotes: React.FC<DevRemotesProps> = (props) => {
  const { remotes = [], self } = props;
  if (remotes.length === 0) return null;

  const styles = {
    base: css({
      position: 'relative',
      userSelect: 'none',
      fontSize: 14,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {remotes.map((remote) => {
        const key = remote.peer.id;
        return <Row key={key} controller={self} remote={remote} />;
      })}
    </div>
  );
};
