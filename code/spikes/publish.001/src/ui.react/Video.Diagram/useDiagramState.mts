import { useEffect, useState } from 'react';
import { takeUntil } from 'rxjs';

import { rx, State, t, Text } from '../common';
import { TimeMap } from './TimeMap.mjs';
import { Wrangle } from './Wrangle.mjs';

export function useDiagramState(args: { instance: t.Instance; vimeo?: t.VimeoEvents }) {
  const { instance } = args;

  const state = State.useState(instance);
  const muted = state.current?.env.media.muted ?? false;
  const md = state.current?.overlay?.content?.md;

  const [video, setVideo] = useState<t.VimeoId | undefined>();
  const [image, setImage] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [timemap, setTimeMap] = useState<t.DocTimeWindow[]>([]);
  const [vimeo, setVimeo] = useState<t.VimeoStatus | undefined>();
  const [context, setContext] = useState<t.StateOverlayContext[]>([]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const { dispose, dispose$ } = rx.disposable();
    const def = md?.info.code.typed.find((e) => e.type.toLowerCase().startsWith('doc.diagram'));
    const yaml = !def ? undefined : (Text.Yaml.parse(def?.text) as t.DocDiagram);

    const timemap = TimeMap.sortedMedia(yaml?.media);
    setTimeMap(timemap);

    const resetContent = () => {
      setMarkdown('');
      setImage('');
    };

    const updateState = (status?: t.VimeoStatus) => {
      setVimeo(status);
      if (!def || !yaml) return;

      const context = state.current?.overlay?.context ?? [];
      const path = state.current?.overlay?.content?.path;
      const index = context.findIndex((item) => item.path === path);
      setIndex(index);
      setContext(context);

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
          const imageMedia = media as t.DocDiagramImage;
          setImage(imageMedia.image);
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

    if (args.vimeo) {
      const status$ = args.vimeo?.status.$.pipe(takeUntil(dispose$));
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
    image,
    markdown,
    timemap,
    muted,
    vimeo,
    context,
    index,
    get isLast() {
      return index < 0 ? false : index < context.length - 1;
    },
  };
}
