import { useState } from 'react';

import { Color, css, t, useSizeObserver } from '../common';
import { TooSmall } from '../TooSmall';
import { ProgressBar } from '../Video.ProgressBar';
import { VideoDiagramImage } from './ui.Image';
import { VideoDiagramMarkdown } from './ui.Markdown';
import { VideoDiagramVimeo } from './ui.Vimeo';
import { useDiagramState } from './useDiagramState.mjs';

export type VideoDiagramProps = {
  instance: t.Instance;
  dimmed?: boolean;
  minHeight?: number;
  minWidth?: number;
  style?: t.CssValue;
};

export const VideoDiagram: React.FC<VideoDiagramProps> = (props) => {
  const { instance, dimmed = false, minWidth = 550, minHeight = 550 } = props;

  const [vimeo, setVimeo] = useState<t.VimeoEvents>();
  const diagram = useDiagramState({ instance, vimeo });

  const size = useSizeObserver();
  const isTooSmall = !size.ready
    ? false
    : size.rect.width < minHeight || size.rect.height < minWidth;

  /**
   * [Handlers]
   */
  const jumpToPercent = async (percent: number) => {
    if (!vimeo) return;
    const duration = (await vimeo.status.get()).status?.duration ?? 0;
    const secs = duration * percent;
    vimeo.seek.fire(secs);
  };

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
    content: css({
      Absolute: [100, 100, 150, 100],
      display: 'flex',
    }),
    video: css({ Absolute: [null, null, 30, 30] }),
    progressBar: css({
      Absolute: [null, 150, 0, 150],
      opacity: dimmed ? 0 : 1,
      transition: `opacity 300ms`,
    }),
  };

  const elVimeo = diagram.video !== undefined && (
    <VideoDiagramVimeo
      style={styles.video}
      dimmed={dimmed}
      muted={diagram.muted}
      video={diagram.video}
      autoStart={true}
      onReady={(vimeo) => setVimeo(vimeo)}
    />
  );

  const elContent = (
    <div {...styles.content}>
      {diagram.image && (
        <VideoDiagramImage instance={instance} src={diagram.image} dimmed={dimmed} />
      )}
      {diagram.markdown && (
        <VideoDiagramMarkdown
          instance={instance}
          markdown={diagram.markdown}
          dimmed={dimmed}
          style={{ MarginX: 80, marginBottom: '3%' }}
        />
      )}
    </div>
  );

  const elTooSmall = isTooSmall && <TooSmall backgroundColor={0.3} backdropBlur={22} />;
  const elProgressBar = vimeo && (
    <ProgressBar
      style={styles.progressBar}
      status={diagram.vimeo}
      timemap={diagram.timemap}
      onClick={(e) => jumpToPercent(e.progress)}
    />
  );

  return (
    <div {...css(styles.base, props.style)} ref={size.ref}>
      <div {...styles.body}>
        {elContent}
        {elVimeo}
        {elProgressBar}
        {elTooSmall}
      </div>
    </div>
  );
};
