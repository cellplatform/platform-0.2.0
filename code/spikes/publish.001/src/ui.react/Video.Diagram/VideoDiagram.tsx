import { useEffect, useState } from 'react';

import { Color, css, State, t, useSizeObserver } from '../common';
import { TooSmall } from '../TooSmall';
import { ProgressBar } from '../Video.ProgressBar';
import { VideoDiagramVimeo } from './VideoDiagram.Vimeo';

/**
 * TODO 🐷 TEMP
 */
const SAMPLE = {
  video: 727951677,
  diagram:
    'https://user-images.githubusercontent.com/185555/201820392-e66aa287-3df9-4d8f-a480-d15382f62c17.png',
};

export type VideoDiagramProps = {
  instance: t.StateInstance;
  dimmed?: boolean;
  minHeight?: number;
  minWidth?: number;
  style?: t.CssValue;
};

export const VideoDiagram: React.FC<VideoDiagramProps> = (props) => {
  const { dimmed = false, minWidth = 550, minHeight = 550 } = props;

  const state = State.useState(props.instance);
  const muted = state.current?.env.media.muted ?? false;

  const [vimeo, setVimeo] = useState<t.VimeoEvents>();
  const [percent, setPercent] = useState(0);

  const size = useSizeObserver();
  const isTooSmall = !size.ready
    ? undefined
    : size.rect.width < minHeight || size.rect.height < minWidth;

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (vimeo) {
      vimeo.status.$.subscribe((e) => setPercent(e.percent));
    }
  }, [vimeo?.instance.id]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.format(dimmed ? 0.1 : 1),
      transition: `background-color 300ms`,
      overflow: 'hidden',
    }),
    body: css({
      Absolute: 0,
      opacity: size.ready ? 1 : 0,
      transition: 'opacity 150ms',
    }),
    video: css({
      Absolute: [null, null, 30, 30],
    }),
    image: {
      base: css({
        Absolute: [100, 100, 150, 100],
        opacity: dimmed ? 0.4 : 1,
        transition: `opacity 300ms`,
        userSelect: 'none',
        pointerEvents: 'none',
      }),
      inner: css({
        Absolute: 0,
        backgroundSize: 'contain',
        backgroundImage: `url(${SAMPLE.diagram})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }),
    },
    progressBar: css({
      Absolute: [null, 50, 0, 50],
      opacity: dimmed ? 0 : 1,
      transition: `opacity 300ms`,
    }),
  };

  const elVimeo = (
    <VideoDiagramVimeo
      dimmed={dimmed}
      muted={muted}
      video={SAMPLE.video}
      style={styles.video}
      autoStart={true}
      onReady={(vimeo) => setVimeo(vimeo)}
    />
  );

  const elImage = (
    <div {...styles.image.base}>
      <div {...styles.image.inner} />
    </div>
  );

  const elProgressBar = vimeo && <ProgressBar percent={percent} style={styles.progressBar} />;
  const elTooSmall = isTooSmall && <TooSmall backgroundColor={0.3} backdropBlur={22} />;

  return (
    <div {...css(styles.base, props.style)} ref={size.ref}>
      <div {...styles.body}>
        {elImage}
        {elVimeo}
        {elProgressBar}
        {elTooSmall}
      </div>
    </div>
  );
};
