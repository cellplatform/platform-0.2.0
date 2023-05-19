import { useEffect } from 'react';
import { Is, Vimeo, css, rx, t } from './common';

/**
 * https://vimeo.com/manage/videos/727951677/transcript?ts=200
 * https://user-images.githubusercontent.com/185555/208217954-0427e91d-fcb3-4e9a-b5f1-1f86ed3500bf.png
 * 727951677
 */

export type DevPlayerProps = {
  bus: t.EventBus<any>;
  shared: t.TDevSharedPropsLens;
  style?: t.CssValue;
};

export const DevPlayer: React.FC<DevPlayerProps> = (props) => {
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
