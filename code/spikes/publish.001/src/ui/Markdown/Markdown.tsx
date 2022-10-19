import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common.mjs';
import { Text } from 'sys.text';
import { Fetch } from '../Fetch.Util.mjs';
import { MarkdownOutline } from './Markdown.Outline';
import { MarkdownEditor } from './Markdown.Editor';

type DataCtx = {
  html: string;
  md: string;
  ast: t.MdastRoot;
};

export type MarkdownProps = { data: DataCtx; style?: t.CssValue };

export const Markdown: React.FC<MarkdownProps> = (props) => {
  const [html, setHtml] = useState('');
  const [md, setMd] = useState('');
  const [mdAst, setMdAst] = useState<t.MdastRoot>();

  useEffect(() => {
    (async () => {
      const url = '/data.md/main.md';
      const md = await Fetch.markdown(url);

      /**
       * TODO 🐷
       * refactor into proper state manager
       */
      console.log('-------------------------------------------');
      console.log('md', md);
      console.log('md.info', md.info);
      console.log('md.info.ast', md.info.ast);

      const { html, markdown } = md;
      const { ast } = md.info;

      const ctx: DataCtx = { html, md: markdown, ast };
      console.log('ctx', ctx);

      setHtml(md.html);
      setMd(md.markdown);
      setMdAst(md.info.ast);

      const typedCodeBlocks = md.info.code.typed;
      const yamlBlocks = typedCodeBlocks
        .filter((item) => item.lang.toLowerCase() === 'yaml')
        .map((item, index) => {
          // const yaml = item.text
          const props = Text.Yaml.parse(item.text);
          return { index, props };
        });
      // .map((item) => Text.Yaml.parse(item.text));

      const version =
        yamlBlocks.find((item) => item.props.version)?.props.version ?? '0.0.0-genesis';

      console.log('typedCodeBlocks', typedCodeBlocks);
      console.log('yamlBlocks', yamlBlocks);
      console.log('version', version);

      // const propSet = yamlBlocks.map((item) => Text.Yaml.parse(item.text));

      // const version

      // console.log('md.info', md.info.ast);
    })();
  }, []);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      Absolute: 0,
      Flex: 'x-stretch-stretch',
      fontSize: 16,
    }),
    left: css({
      flex: 1,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    right: css({
      flex: 1,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
  };

  const elHtml = html && <div dangerouslySetInnerHTML={{ __html: html }} />;
  const elEditor = <MarkdownEditor md={md} />;
  const elOutline = mdAst && <MarkdownOutline ast={mdAst} />;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>{elEditor}</div>
      <div style={{ width: 20 }} />
      <div {...styles.right}>{elOutline}</div>
    </div>
  );
};
