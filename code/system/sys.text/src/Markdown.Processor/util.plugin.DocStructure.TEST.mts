import { describe, it, expect } from '../test/index.mjs';
import { MarkdownProcessor } from './index.mjs';

describe('Markdown: DocStructure', () => {
  describe('plugin', () => {
    const SAMPLE = `# Hello`;

    it('parse outline', async () => {
      const res = await MarkdownProcessor().toMarkdown(SAMPLE);

      console.log('----------------------------------------');
      console.log('res', res);

      /**
       * TODO 🐷
       */
      //
    });
  });
});
