import { useEffect, useState } from 'react';
import { t, Processor } from '../common';

import { defaultRenderer as defaultRenderer } from './Renderer';

export type MarkdownParsedHandler = (e: MarkdownParsedHandlerArgs) => void;
export type MarkdownParsedHandlerArgs = { md: t.ProcessedMdast };

/**
 * Hook that isolates the markdown to display rendering.
 */
export function useBlockRenderer(props: {
  instance: t.Instance;
  markdown?: string;
  renderer?: t.MarkdownDocBlockRenderer;
  onParsed?: MarkdownParsedHandler;
}) {
  const { instance } = props;

  const [safeBlocks, setSafeBlocks] = useState<(string | JSX.Element)[]>([]);
  const reset = () => setSafeBlocks([]);

  useEffect(() => {
    (async () => {
      const text = (props.markdown || '').trim();
      const md = await Processor.toMarkdown(text);
      props.onParsed?.({ md });

      reset();
      const blocks: (string | JSX.Element)[] = [];

      let index = -1;
      for (const node of md.mdast.children) {
        index++;
        const args: t.MarkdownDocBlockRendererArgs = { index, node, md, instance };

        /**
         * Supplied renderer.
         */
        if (props.renderer) {
          const res = await props.renderer(args);
          if (res !== null) {
            blocks.push(res);
            continue;
          }
        }

        /**
         * Default renderer.
         */
        const res = await defaultRenderer(args);
        if (res !== null) blocks.push(res);
      }

      setSafeBlocks(blocks);
    })();

    return () => undefined;
  }, [props.markdown]);

  /**
   * API
   */
  const isEmpty = safeBlocks.length === 0;
  return { safeBlocks, isEmpty, reset };
}
