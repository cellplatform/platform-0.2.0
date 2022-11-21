import { useState } from 'react';

import { Color, css, t, useSizeObserver, State } from '../common';
import { TooSmall } from '../TooSmall';
import { ProgressBar } from '../Video.ProgressBar';
import { VideoDiagramImage } from './ui.Image';
import { VideoDiagramMarkdown } from './ui.Markdown';
import { VideoDiagramVimeo } from './ui.Vimeo';
import { useDiagramState } from './useDiagramState.mjs';
import { StatusPanel } from './ui.StatusPanel';

export type VideoDiagramProps = {
  instance: t.Instance;
  dimmed?: boolean;
  minHeight?: number;
  minWidth?: number;
  style?: t.CssValue;
};

export const VideoDiagram: React.FC<VideoDiagramProps> = (props) => {
  const { instance, dimmed = false, minWidth = 550, minHeight = 550, status } = props;

  const [vimeo, setVimeo] = useState<t.VimeoEvents>();
  const diagram = useDiagramState({ instance, vimeo });

  const size = useSizeObserver();
  const isTooSmall = !size.ready
    ? undefined
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

  const loadNext = async () => {
    const { state, context, index } = diagram;
    const def = state?.overlay?.def;
    const next = context[index + 1];
    if (!def || !next) return;
    State.withEvents(instance, (events) => {
      events.overlay.def(def, next.path, { context });
    });
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
    statusBar: css({
      marginLeft: 5,
      flex: 1,
    }),
    videoBar: css({
      Absolute: [null, 30, 30, 30],
      Flex: 'x-spaceBetween-stretch',
    }),
    progressBar: css({
      Absolute: [null, 150, 0, 150],
      opacity: dimmed ? 0 : 1,
      transition: `opacity 300ms`,
    }),
  };

  const elTooSmall = isTooSmall && <TooSmall backgroundColor={0.3} backdropBlur={22} />;

  const elContent = (
    <div {...styles.content}>
      {diagram.image && (
        <VideoDiagramImage
          instance={instance}
          src={diagram.image}
          status={diagram.vimeo}
          dimmed={dimmed}
        />
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

  const elVimeo = diagram.video !== undefined && (
    <VideoDiagramVimeo
      dimmed={dimmed}
      muted={diagram.muted}
      video={diagram.video}
      autoStart={true}
      onReady={(vimeo) => setVimeo(vimeo)}
    />
  );

  const elVideoBar = (
    <div {...styles.videoBar}>
      {elVimeo}
      <StatusPanel
        style={styles.statusBar}
        dimmed={dimmed}
        isLast={diagram.isLast}
        status={diagram.vimeo}
        onRightClick={loadNext}
      />
    </div>
  );

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
        {elVideoBar}
        {elProgressBar}
        {elTooSmall}
      </div>
    </div>
  );
};
