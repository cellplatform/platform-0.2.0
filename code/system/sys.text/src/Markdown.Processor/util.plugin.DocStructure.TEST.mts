import { describe, it, expect } from '../test/index.mjs';
import { MarkdownProcessor } from './index.mjs';

describe('Markdown: DocStructure', () => {
  describe('plugin', () => {
    it('has root tree', async () => {
      const { info } = await MarkdownProcessor().toMarkdown(`# Hello`);

      expect(info.root.type).to.eql('root');
      expect(info.root.children.length).to.eql(1);
      expect(info.root.children[0].type).to.eql('heading');
    });
  });
});
