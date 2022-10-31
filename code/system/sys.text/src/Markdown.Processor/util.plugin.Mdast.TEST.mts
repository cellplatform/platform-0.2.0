import { expect, describe, it } from '../test/index.mjs';
import { MarkdownProcessor } from './index.mjs';
import { t } from './common.mjs';

describe('MARKDOWN mutation (MD-AST)', () => {
  const processor = MarkdownProcessor();

  it('.tree', async () => {
    const INPUT = '![image](file.png)';
    let _tree: t.MdastRoot | undefined;
    await processor.toMarkdown(INPUT, {
      mdast(e) {
        e.tree((tree) => (_tree = tree));
      },
    });

    expect(_tree?.type).to.eql('root');
    expect(_tree?.children[0].type).to.eql('paragraph');
  });
});
