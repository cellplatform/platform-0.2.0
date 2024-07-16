import { describe, it, expect, type t } from '../test';
import { Markdown } from '.';

const processor = Markdown.processor();

async function getFirstChild<T extends t.MdastNode = t.MdastNode>(
  markdown: string,
): Promise<T | undefined> {
  return (await processor.toMarkdown(markdown)).mdast?.children?.[0] as T;
}

describe('Markdown.Is', () => {
  it('Is.node (AST)', async () => {
    const md = await processor.toMarkdown('# Heading');
    const ast = md.info.mdast;

    const test = (input: any, expected: boolean) => {
      expect(Markdown.Is.node(input)).to.eql(expected);
    };

    test(ast, true);

    test({}, false);
    test('', false);
    test(undefined, false);
    test(null, false);

    expect(Markdown.Is.node({})).to.eql(false);
    expect(Markdown.Is.node({})).to.eql(false);
  });

  it('Is.image', async () => {
    const md1 = await getFirstChild('# Heading');
    const md2 = await getFirstChild('![my-image](https://foo.com/image.png)');

    expect(Markdown.Is.image(md1)).to.eql(false);
    expect(Markdown.Is.image(md2)).to.eql(true);
    expect(Markdown.Is.image(undefined)).to.eql(false);
  });
});

describe('Markdown.Find', () => {
  describe('Find.image', () => {
    it('deep (descendent)', async () => {
      const node = await getFirstChild('![my-image](https://foo.com/image.png "My Title")');
      expect(node?.type).to.eql('paragraph'); // NB: The root element is not the image. The function walks down the tree to find the image.

      const res = Markdown.Find.image(node);
      expect(res?.alt).to.eql('my-image');
      expect(res?.title).to.eql('My Title');
      expect(res?.url).to.eql('https://foo.com/image.png');
    });

    it('direct', async () => {
      const node = await getFirstChild<t.MdastParagraph>('![my-image](https://foo.com/image.png)');

      const image = node?.children[0];
      expect(image?.type).to.eql('image');

      const res = Markdown.Find.image(image);
      expect(res?.alt).to.eql('my-image');
      expect(res?.url).to.eql('https://foo.com/image.png');
    });

    it('not found', async () => {
      const test = async (markdown: string) => {
        const node = await getFirstChild(markdown);
        const res = Markdown.Find.image(node);
        expect(res).to.eql(undefined);
      };
      await test('# Heading');
      await test('');
    });
  });
});
