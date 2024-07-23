import { PeerUI, css, type t, Color } from './common';

export type SampleLayoutProps = {
  stream?: MediaStream;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};

export const SampleLayout: React.FC<SampleLayoutProps> = (props) => {
  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      position: 'relative',
      color: theme.fg,
      display: 'grid',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <PeerUI.Video stream={props.stream} muted={true} empty={''} theme={theme.name} />
    </div>
  );
};
