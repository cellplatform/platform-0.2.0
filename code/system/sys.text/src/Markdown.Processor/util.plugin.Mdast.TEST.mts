import { expect, describe, it } from '../test';
import { MarkdownProcessor } from '.';

describe('MARKDOWN mutation (MD-AST)', () => {
  const processor = MarkdownProcessor();

  it('.tree', async () => {
    let fired = false;

    const INPUT = '![image](file.png)';
    await processor.toMarkdown(INPUT, {
      mdast(e) {
        e.tree((tree) => {
          fired = true;
          expect(tree?.type).to.eql('root');
          expect(tree?.children[0].type).to.eql('paragraph');
        });
      },
    });

    expect(fired).to.eql(true);
  });

  it('.visit: e.hProperties() - properties added {data}', async () => {
    type T = { className?: string; srcset?: string };
    let fired = false;

    const INPUT = '![hello](foo.png)';
    await processor.toMarkdown(INPUT, {
      mdast(e) {
        e.visit((e) => {
          fired = true;
          if (e.node.type === 'image') {
            const node = e.node;
            expect(node.type).to.eql('image');
            expect(node.url).to.eql('foo.png');
            expect(node.alt).to.eql('hello');

            e.hProperties<T>().className = 'foo';
            e.hProperties<T>().srcset = 'foo.png 1x, foo@2x.png 2x'; // NB: second call is additive, does not destroy prior setting.

            const hProperties = e.hProperties<T>();
            expect(hProperties).to.eql({ className: 'foo', srcset: 'foo.png 1x, foo@2x.png 2x' });
            expect(node.data?.hProperties).to.equal(hProperties);
          }
        });

        expect(fired).to.eql(true);
      },
    });
  });

  describe('option: { externalLinksInNewTab }', () => {
    it('transforms external links open new tab (default: true)', async () => {
      const INTERNAL = '[link](./foo.png)';
      const EXTERNAL = '[link](https://domain.com/)';

      const res1 = await processor.toHtml(INTERNAL);
      const res2 = await processor.toHtml(EXTERNAL);

      expect(res1.html).to.not.include('target="_blank"');
      expect(res1.html).to.not.include('rel="noopener"');

      expect(res2.html).to.include('target="_blank"');
      expect(res2.html).to.include('rel="noopener"');
    });

    it('does not transform external links (option: false)', async () => {
      const EXTERNAL = '[link](https://domain.com/)';
      const res = await processor.toHtml(EXTERNAL, { externalLinksInNewTab: false });
      expect(res.html).to.not.include('target="_blank"');
      expect(res.html).to.not.include('rel="noopener"');
    });
  });
});
