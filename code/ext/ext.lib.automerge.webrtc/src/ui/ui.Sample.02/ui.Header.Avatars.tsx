import { PeerUI, css, type t } from './common';

export type HeaderAvatarsProps = {
  peer?: t.PeerModel;
  style?: t.CssValue;
};

export const HeaderAvatars: React.FC<HeaderAvatarsProps> = (props) => {
  const { peer } = props;
  const styles = { base: css({ padding: 8 }) };
  return (
    <div {...css(styles.base, props.style)}>
      <PeerUI.AvatarTray peer={peer} muted={true} />
    </div>
  );
};
