import { useEffect, useState } from 'react';
import { css, Processor, t } from '../common';

export type DocTableProps = {
  ctx: t.DocBlockCtx<t.MdastTable>;
  style?: t.CssValue;
};

export const DocTable: React.FC<DocTableProps> = (props) => {
  const { ctx } = props;
  const markdown = ctx.md.toString(ctx.node.position);

  const [safeHtml, setSafeHtml] = useState('');

  /**
   * Lifecycle
   */
  useEffect(() => {
    Processor.toHtml(markdown).then(({ html }) => setSafeHtml(html));
  }, [markdown]);

  /**
   * [Render]
   */
  const styles = {
    base: css({
      position: 'relative',
      Flex: 'y-stretch-stretch',
    }),
  };

  if (!safeHtml) return null;

  return (
    <div {...css(styles.base, props.style)}>
      {safeHtml && <div dangerouslySetInnerHTML={{ __html: safeHtml }} />}
    </div>
  );
};
