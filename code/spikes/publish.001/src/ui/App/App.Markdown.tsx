import React, { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, t, rx, FC } from '../common/index.mjs';
import { Text } from 'sys.text';
import { FetchUtil } from './Fetch.Util.mjs';
import { MarkdownDocOutline } from './Markdown.DocOutline';

type DataCtx = {
  html: string;
  md: string;
  ast: t.MdastRoot;
};

export type AppMarkdownProps = { data: DataCtx; style?: t.CssValue };

export const AppMarkdown: React.FC<AppMarkdownProps> = (props) => {
  const [html, setHtml] = useState('');
  const [md, setMd] = useState('');
  const [mdAst, setMdAst] = useState<t.MdastRoot>();

  useEffect(() => {
    (async () => {
      const url = '/data.md/main.md';
      const md = await FetchUtil.markdown(url);

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
      padding: 10,
      Flex: 'x-stretch-stretch',
      fontSize: 16,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    left: css({
      flex: 1,
      padding: 15,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    middle: css({
      flex: 1,
      padding: 15,
      Margin: [null, 10],
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
    }),
    right: css({
      flex: 1,
      padding: 15,
      backgroundColor: 'rgba(255, 0, 0, 0.1)' /* RED */,
      opacity: 0.3,
    }),
  };

  const elHtml = html && <div dangerouslySetInnerHTML={{ __html: html }} />;
  const elOutline = mdAst && <MarkdownDocOutline ast={mdAst} />;

  return (
    <div {...css(styles.base, props.style)}>
      <div {...styles.left}>
        <pre>{md}</pre>
      </div>
      <div {...styles.middle}>{elOutline}</div>
      <div {...styles.right}>{elHtml}</div>
    </div>
  );
};
