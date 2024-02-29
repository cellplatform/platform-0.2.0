import { css, type t } from '../common';
import { HostLayer } from './Host.Layer';

export type HostLayersProps = {
  instance: t.DevInstance;
  layers: t.DevRenderPropsLayer[];
  style?: t.CssValue;
};

export const HostLayers: React.FC<HostLayersProps> = (props) => {
  const { instance, layers } = props;
  if (layers.length === 0) return null;

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      pointerEvents: 'none',
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      {layers.map((layer) => {
        return <HostLayer key={layer.index} instance={instance} layer={layer} />;
      })}
    </div>
  );
};
