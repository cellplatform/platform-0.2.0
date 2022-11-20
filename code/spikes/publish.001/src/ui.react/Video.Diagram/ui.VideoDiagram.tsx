import { useEffect, useState } from 'react';
import { takeUntil } from 'rxjs';

import { Color, css, rx, State, t, Text, useSizeObserver } from '../common';
import { TooSmall } from '../TooSmall';
import { ProgressBar } from '../Video.ProgressBar';
import { TimeMap } from './TimeMap.mjs';
import { VideoDiagramImage } from './ui.Image';
import { VideoDiagramMarkdown } from './ui.Markdown';
import { VideoDiagramVimeo } from './ui.Vimeo';
import { Wrangle } from './Wrangle.mjs';

export type VideoDiagramProps = {
  instance: t.Instance;
  md?: t.ProcessedMdast;
  dimmed?: boolean;
  minHeight?: number;
  minWidth?: number;
  style?: t.CssValue;
};

export const VideoDiagram: React.FC<VideoDiagramProps> = (props) => {
  const { instance, dimmed = false, minWidth = 550, minHeight = 550, md } = props;

  const state = State.useState(props.instance);
  const muted = state.current?.env.media.muted ?? false;

  const [vimeo, setVimeo] = useState<t.VimeoEvents>();
  const [vimeoStatus, setVimeoStatus] = useState<t.VimeoStatus | undefined>();

  const [timemap, setTimeMap] = useState<t.DocTimeWindow[]>([]);

  const [videoId, setVideoId] = useState<t.VimeoId | undefined>();
  const [diagramSrc, setDiagramSrc] = useState('');
  const [markdown, setMarkdown] = useState('');

  const size = useSizeObserver();
  const isTooSmall = !size.ready
    ? false
    : size.rect.width < minHeight || size.rect.height < minWidth;

  /**
   * [Lifecycle]
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    vimeo?.status.$.pipe(takeUntil(dispose$)).subscribe((e) => setVimeoStatus(e));
    return () => dispose();
  }, [vimeo?.instance.id]);

  /**
   * Update media-state on each video progression.
   */
  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const def = md?.info.code.typed.find((e) => e.type.toLowerCase().startsWith('doc.diagram'));
    const yaml = !def ? undefined : (Text.Yaml.parse(def?.text) as t.DocDiagram);

    const timemap = TimeMap.sortedMedia(yaml?.media);
    setTimeMap(timemap);

    const resetContent = () => {
      setMarkdown('');
      setDiagramSrc('');
    };

    const updateState = (status?: t.VimeoStatus) => {
      if (!def || !yaml) return;

      /**
       * TODO 🐷
       * - Handle multiple videos.
       *   Sequence:
       *
       *       |START:0| → [video-1] → [video-2] → ... → |END:n|
       *
       *   Concept of [index-CurrentVideo].
       *
       */

      if (typeof yaml.video === 'number') {
        setVideoId(yaml.video);
      }

      /**
       * Diagram.
       */
      if (Array.isArray(yaml.media)) {
        const now = status?.seconds ?? 0;
        const current = TimeMap.current(yaml.media, now);
        const index = current?.indexRef ?? -1;
        const media = index < 0 ? undefined : (yaml.media ?? [])[index];

        resetContent();

        /**
         * Image.
         */
        if (Wrangle.isImage(media)) {
          const imageMedia = media as t.DocDiagramImage;
          setDiagramSrc(imageMedia.image);
        }

        /**
         * Markdown.
         */
        if (Wrangle.isMarkdown(media)) {
          const md = media as t.DocDiagramMarkdown;
          setMarkdown(md.markdown ?? '');
        }
      }
    };

    if (vimeo) {
      const vimeoStatus$ = vimeo?.status.$.pipe(takeUntil(dispose$));
      vimeoStatus$.subscribe((e) => updateState(e));
    }

    updateState();
    return () => dispose();
  }, [md?.markdown, Boolean(vimeo)]);

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

  const elVimeo = videoId !== undefined && (
    <VideoDiagramVimeo
      style={styles.video}
      dimmed={dimmed}
      muted={muted}
      video={videoId}
      autoStart={true}
      onReady={(vimeo) => setVimeo(vimeo)}
    />
  );

  const elContent = (
    <div {...styles.content}>
      {diagramSrc && <VideoDiagramImage instance={instance} src={diagramSrc} dimmed={dimmed} />}
      {markdown && (
        <VideoDiagramMarkdown
          instance={instance}
          markdown={markdown}
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
      status={vimeoStatus}
      timemap={timemap}
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
