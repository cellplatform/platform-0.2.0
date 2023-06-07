import { useEffect, useState } from 'react';

import { TooSmall } from '../TooSmall';
import { ProgressBar } from '../Video.ProgressBar';
import { Color, css, State, t, Time, useSizeObserver } from './common';
import { VideoDiagramImage } from './ui.Image';
import { VideoDiagramMarkdown } from './ui.Markdown';
import { StatusPanel } from './ui.StatusPanel';
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

  const [ready, setReady] = useState(false);

  const size = useSizeObserver();
  const isTooSmall = !size.ready
    ? undefined
    : size.rect.width < minHeight || size.rect.height < minWidth;

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    if (size.ready) {
      Time.delay(10, () => setReady(true));
    }
  }, [size.ready]);

  /**
   * [Handlers]
   */
  const jumpToPercent = async (percent: number) => {
    if (!vimeo) return;
    const duration = (await vimeo.status.get()).status?.duration ?? 0;
    const secs = duration * percent;
    vimeo.seek.fire(secs);
  };

  const handleNextClick = async () => {
    const { state, overlay } = diagram;
    const { context, index } = overlay;
    const def = state?.overlay?.def;
    const next = context[index + 1];
    if (!def) return;
    State.withEvents(instance, (events) => {
      if (!next) {
        // End of video sequence.
        events.overlay.close();
      } else {
        // Move to the next.
        events.overlay.def(def, next.path, { context });
      }
    });
  };

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      backgroundColor: Color.format(dimmed ? 0.6 : 1),
      transition: `background-color 300ms`,
      overflow: 'hidden',
    }),
    body: css({
      Absolute: 0,
      opacity: size.ready ? 1 : 0,
      transition: 'opacity 150ms',
    }),
    content: css({
      Absolute: 0,
      display: 'flex',
      filter: `blur(${dimmed ? 4 : 0}px)`,
      opacity: dimmed ? 0.6 : 1,
      transition: `opacity 300ms`,
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
    close: {
      base: css({
        Absolute: 0,
        display: 'grid',
        placeItems: 'center',
        userSelect: 'none',
      }),
      label: css({
        fontSize: 80,
        opacity: 0.8,
        letterSpacing: '-0.018em',
      }),
      icon: css({
        Absolute: [-30, 5, null, null],
        backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      }),
    },
  };

  const elTooSmall = ready && isTooSmall && <TooSmall backgroundColor={0.3} backdropBlur={22} />;

  const elContent = (
    <div {...styles.content}>
      {diagram.media?.kind === 'media.image' && (
        <VideoDiagramImage
          instance={instance}
          def={diagram.media}
          status={diagram.vimeo}
          dimmed={dimmed}
        />
      )}
      {diagram.media?.kind === 'media.markdown' && (
        <VideoDiagramMarkdown
          instance={instance}
          def={diagram.media}
          status={diagram.vimeo}
          dimmed={dimmed}
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
        onRightClick={handleNextClick}
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

  const elCloseLabel = dimmed && (
    <div {...styles.close.base}>
      <div {...styles.close.label}>{/* {`(close)`} */}</div>
    </div>
  );

  return (
    <div {...css(styles.base, props.style)} ref={size.ref}>
      <div {...styles.body}>
        {elContent}
        {elVideoBar}
        {elProgressBar}
        {elTooSmall}
        {elCloseLabel}
      </div>
    </div>
  );
};
