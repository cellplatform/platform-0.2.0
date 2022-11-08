import { useEffect, useState } from 'react';
import { t, Text } from '../common';

import { renderer as defaultRenderer } from './Renderer';

const Processor = Text.Processor.markdown();

/**
 * Hook that isolates the markdown to display rendering.
 */
export function useBlockRenderer(props: {
  markdown?: string;
  renderer?: t.MarkdownDocBlockRenderer;
}) {
  const [safeBlocks, setSafeBlocks] = useState<(string | JSX.Element)[]>([]);
  const reset = () => setSafeBlocks([]);

  useEffect(() => {
    (async () => {
      const text = (props.markdown || '').trim();
      const md = await Processor.toMarkdown(text);

      reset();
      const blocks: (string | JSX.Element)[] = [];

      let index = -1;
      for (const node of md.mdast.children) {
        index++;
        const args: t.MarkdownDocBlockRendererArgs = { index, node, md };

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
