import { useEffect } from 'react';
import { Is, Vimeo, css, rx, t, YouTube } from './common';

export type DevVimeoProps = {
  bus: t.EventBus<any>;
  shared: t.TDevSharedPropsLens;
  style?: t.CssValue;
};

export const DevVimeo: React.FC<DevVimeoProps> = (props) => {
  const { bus } = props;
  const current = props.shared.current;
  const id = Wrangle.vimeoId(current);
  const isPlaying = Boolean(current.vimeoPlaying);
  const isMuted = Boolean(current.vimeoMuted);
  const instance = { bus, id: 'foo' };

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const client = Vimeo.Events({ instance, dispose$ });
    if (isPlaying) client.play.fire();
    if (!isPlaying) client.pause.fire();
    return dispose;
  }, [isPlaying]);

  if (!id || !current.vimeoVisible) return null;

  /**
   * [Render]
   */
  const width = 300;
  const styles = {
    base: css({ width }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Vimeo muted={isMuted} instance={instance} video={id} width={width} borderRadius={6} />
    </div>
  );
};

/**
 * Helpers
 */
const Wrangle = {
  vimeoId(props: t.TDevSharedProps) {
    const id = props.vimeoId;
    if (!id || !Is.numeric(id)) return undefined;
    return parseInt(id);
  },
};
