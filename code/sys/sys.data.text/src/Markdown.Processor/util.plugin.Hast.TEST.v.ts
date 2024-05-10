import { expect, describe, it } from '../test';
import { MarkdownProcessor } from '.';

describe('HTML mutation (H-AST)', () => {
  const processor = MarkdownProcessor();

  it('.tree', async () => {
    let fired = false;

    const INPUT = '![image](file.png)';
    await processor.toHtml(INPUT, {
      hast(e) {
        e.tree((tree) => {
          fired = true;
          expect(tree?.type).to.eql('root');
          expect(tree?.children[1].type).to.eql('element');
        });
      },
    });

    expect(fired).to.eql(true);
  });

  it('.visit', async () => {
    let count = 0;

    const INPUT = '![image](file.png)';
    await processor.toHtml(INPUT, {
      hast(e) {
        e.visit((e) => {
          count++;
        });
      },
    });

    expect(count).to.eql(7);
  });

  it('.visit: e.data() - node added to tree', async () => {
    type T = { count?: number; msg?: string };
    let fired = false;

    const INPUT = '![image](file.png)';
    await processor.toHtml(INPUT, {
      hast(e) {
        e.visit((e) => {
          fired = true;
          if (e.node.type === 'element' && e.node.tagName === 'img') {
            expect(e.node?.type).to.eql('element');
            expect(e.node?.tagName).to.eql('img');

            e.data<T>().count = 1234;
            e.data<T>().msg = 'hello'; // NB: second call is additive, does not destroy prior setting.

            const data = e.data<T>();
            expect(data).to.eql({ count: 1234, msg: 'hello' });
            expect(e.node.data).to.equal(data);
          }
        });
      },
    });

    expect(fired).to.eql(true);
  });

  it('sample: adjust image size (resolved into HTML string)', async () => {
    type T = { className?: string; srcset?: string; width?: number; height?: number };

    const INPUT = '![my-image](file.png)';
    const res = await processor.toHtml(INPUT, {
      mdast(e) {
        e.visit((e) => {
          if (e.node.type === 'image') {
            const props = e.hProperties<T>();
            props.className = 'foobar';
            props.srcset = 'foo.png 1x, foo@2x.png 2x';
            props.width = 600;
            props.height = 300;
          }
        });
      },
    });

    expect(res.html.startsWith('<p>')).to.eql(true);
    expect(res.html.endsWith('</p>')).to.eql(true);
    expect(res.html).to.include('<img');
    expect(res.html).to.include('src="file.png"');
    expect(res.html).to.include('alt="my-image"');
    expect(res.html).to.include('class="foobar"');
    expect(res.html).to.include('srcset="foo.png 1x, foo@2x.png 2x"');
    expect(res.html).to.include('width="600"');
    expect(res.html).to.include('height="300"');
  });
});
