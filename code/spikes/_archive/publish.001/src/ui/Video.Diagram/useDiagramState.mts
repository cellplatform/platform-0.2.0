import { useEffect, useState } from 'react';

import { rx, State, t, Text } from '../common';
import { TimeMap } from './TimeMap.mjs';
import { Wrangle } from './Wrangle.mjs';

type O = { context: t.StateOverlayContext[]; index: number };

export function useDiagramState(args: { instance: t.Instance; vimeo?: t.VimeoEvents }) {
  const { instance } = args;

  const state = State.useState(instance);
  const muted = state.current?.env.media.muted ?? false;
  const md = state.current?.overlay?.content?.md;

  const [video, setVideo] = useState<t.VimeoId | undefined>();
  const [timemap, setTimeMap] = useState<t.DocTimeWindow[]>([]);
  const [vimeo, setVimeo] = useState<t.VimeoStatus | undefined>();
  const [overlay, setOverlay] = useState<O>({ context: [], index: -1 });

  const [media, setMedia] = useState<t.DocDiagramMediaType | undefined>();

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const def = md?.info.code.typed.find((e) => e.type.toLowerCase().startsWith('doc.diagram'));
    const yaml = !def ? undefined : (Text.Yaml.parse(def?.text) as t.DocDiagram);

    const timemap = TimeMap.sortedMedia(yaml?.media);
    setTimeMap(timemap);

    const resetContent = () => {
      setMedia(undefined);
    };

    const updateState = (status?: t.VimeoStatus) => {
      setVimeo(status);
      if (!def || !yaml) return;

      const path = state.current?.overlay?.content?.path;
      const context = state.current?.overlay?.context ?? [];
      const index = context.findIndex((item) => item.path === path);
      setOverlay({ context, index });

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
        setVideo(yaml.video);
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
          const image = media as t.DocDiagramImage;
          setMedia({ ...image, kind: 'media.image' });
        }

        /**
         * Markdown.
         */
        if (Wrangle.isMarkdown(media)) {
          const md = media as t.DocDiagramMarkdown;
          setMedia({ ...md, kind: 'media.markdown' });
        }
      }
    };

    if (args.vimeo) {
      const status$ = args.vimeo?.status.$.pipe(rx.takeUntil(dispose$));
      status$.subscribe((status) => updateState(status));
    }

    updateState();
    return () => dispose();
  }, [md?.markdown, Boolean(args.vimeo)]);

  /**
   * API
   */
  return {
    state: state.current,

    video,
    media,
    timemap,
    muted,
    vimeo,
    overlay,

    get isFirst() {
      return overlay.index === 0;
    },
    get isLast() {
      const { index, context } = overlay;
      return index < 0 ? false : index >= context.length - 1;
    },
  };
}
