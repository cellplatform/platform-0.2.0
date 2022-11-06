import React, { useEffect, useState } from 'react';

import { Color, css, FC, t } from '../common.mjs';
import { MarkdownUtil } from '../Markdown/Markdown.Util.mjs';
import { Text } from 'sys.text';

const Markdown = Text.Markdown;
// const Is = Text.Markdown.Is;

export type MarkdownDocProps = {
  markdown?: string;
  scroll?: boolean;
  maxWidth?: number;
  style?: t.CssValue;
};

export const MarkdownDoc: React.FC<MarkdownDocProps> = (props) => {
  const { maxWidth = 960 } = props;

  const [safeBlocks, setSafeBlocks] = useState<(string | JSX.Element)[]>([]);
  const isEmpty = !Boolean(safeBlocks);

  const reset = () => setSafeBlocks([]);

  /**
   * Lifecycle
   */
  useEffect(() => {
    (async () => {
      const Processor = await MarkdownUtil.markdownProcessor();
      const text = (props.markdown || '').trim();
      const md = await Processor.toMarkdown(text);

      reset();
      const blocks: (string | JSX.Element)[] = [];
      const children = md.info.mdast.children;

      let i = -1;
      for (const child of children) {
        i++;
        /**
         * TODO 🐷 - REFACTOR
         */

        /**
         * Process <Image> with Component.
         */
        const image = Markdown.Find.image(child);
        if (image) {
          const def = md.info.code.typed.find((c) => {
            return c.type.startsWith('doc.image') && c.type.includes(' id:');
          });

          const style: React.CSSProperties = {};

          if (def && def.lang === 'yaml') {
            const o = Text.Yaml.parse(def.text);
            style.maxWidth = o.maxWidth;
          }

          const el = <img {...styles.img} style={style} src={image.url} alt={image.alt ?? ''} />;
          blocks.push(el);
          continue;
        }

        /**
         * Process raw HTML.
         */
        const text = md.toString(child.position);
        const h = await Processor.toHtml(text);
        blocks.push(h.html);
      }

      setSafeBlocks(blocks);
    })();
  }, [props.markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Scroll: props.scroll,
      maxWidth,
    }),
    empty: css({
      marginTop: 30,
      fontSize: 14,
      fontStyle: 'italic',
      textAlign: 'center',
      opacity: 0.3,
    }),
    html: css({}),
    jsxElementBlock: css({}),

    img: css({
      border: `solid 5px ${Color.format(-0.1)}`,
      // maxWidth: 550,
    }),
  };

  const elEmpty = isEmpty && <div {...styles.empty}>Nothing to display</div>;
  const elHtml = (
    <div>
      {safeBlocks.map((safeHtmlOrElement, i) => {
        if (typeof safeHtmlOrElement === 'string') {
          return (
            <div key={i} {...styles.html} dangerouslySetInnerHTML={{ __html: safeHtmlOrElement }} />
          );
        }

        if (typeof safeHtmlOrElement === 'object')
          return (
            <div key={i} {...styles.jsxElementBlock}>
              {safeHtmlOrElement}
            </div>
          );

        return null;
      })}
    </div>
  );

  return (
    <div {...css(styles.base, props.style)}>
      {elEmpty}
      {elHtml}
    </div>
  );
};
