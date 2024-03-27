import { Color, Spinner, css, type t } from './common';
import { Wrangle } from './u';
import { useLoader } from './use.Loader';

export const View: React.FC<t.DiagramProps> = (props) => {
  const { theme } = props;
  const { loading, Components } = useLoader();

  /**
   * Render
   */
  const styles = {
    base: css({
      position: 'relative',
      color: Color.fromTheme(theme),
      display: 'grid',
      placeItems: loading ? 'center' : undefined,
    }),
  };

  const elSpinner = loading && <Spinner.Bar theme={theme} />;
  const elExcalidraw = Components?.Excalidraw && (
    <Components.Excalidraw theme={Wrangle.lowercaseTheme(theme)} />
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elSpinner}
      {elExcalidraw}
    </div>
  );
};
