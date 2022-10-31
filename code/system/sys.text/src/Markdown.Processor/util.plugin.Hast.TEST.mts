import { expect, describe, it } from '../test/index.mjs';
import { MarkdownProcessor } from './index.mjs';
import { t } from './common.mjs';

describe('HTML mutation (H-AST)', () => {
  const processor = MarkdownProcessor();

  it('option parameter: { hast:ƒ }', async () => {
    let _tree: t.HastRoot | undefined;
    const _visit: t.MutateHastVisitorArgs[] = [];

    const input = '![image](file.png)';
    await processor.toHtml(input, {
      hast(e) {
        e.tree((tree) => (_tree = tree));
        e.visit((e) => _visit.push(e));
      },
    });

    expect(_tree?.type).to.eql('root');
    expect(_tree?.children[1].type).to.eql('element');
    expect(_visit.length).to.eql(7);
  });

  it('helper: data (added to node)', async () => {
    type T = { count?: number; msg?: string };
    let _node: t.HastElement | undefined;
    let _data: T | undefined;

    const INPUT = '![image](file.png)';
    await processor.toHtml(INPUT, {
      hast(e) {
        e.visit((e) => {
          if (e.node.type === 'element' && e.node.tagName === 'img') {
            _node = e.node;
            _data = e.data<T>();
            e.data<T>().count = 1234;
            e.data<T>().msg = 'hello'; // NB: second call is additive, does not destroy prior setting.
          }
        });
      },
    });
    expect(_node?.type).to.eql('element');
    expect(_node?.tagName).to.eql('img');

    expect(_data).to.eql({ count: 1234, msg: 'hello' });
    expect(_node?.data).to.equal(_data);
  });

  it('helper: hProperties (added to node.data)', async () => {
    type T = { className?: string; srcset?: string };
    let _node: t.HastElement | undefined;
    let _hProperties: T | undefined;

    const INPUT = '![image](file.png)';
    await processor.toHtml(INPUT, {
      hast(e) {
        e.visit((e) => {
          if (e.node.type === 'element' && e.node.tagName === 'img') {
            _node = e.node;
            _hProperties = e.hProperties<T>();
            e.hProperties<T>().className = 'foo';
            e.hProperties<T>().srcset = 'foo.png 1x, foo@2x.png 2x'; // NB: second call is additive, does not destroy prior setting.
          }
        });
      },
    });
    expect(_node?.type).to.eql('element');
    expect(_node?.tagName).to.eql('img');
    expect(_hProperties).to.eql({ className: 'foo', srcset: 'foo.png 1x, foo@2x.png 2x' });
    expect(_node?.data?.hProperties).to.equal(_hProperties);
  });

  it.skip('sample: adjust image size (resolved into HTML string)', async () => {
    type T = { className?: string; srcset?: string };

    const INPUT = '![image](file.png)';
    const res = await processor.toHtml(INPUT, {
      hast(e) {
        e.visit((e) => {
          if (e.node.type === 'element' && e.node.tagName === 'img') {
            const props = e.hProperties<T>();

            // TODO 🐷 hProperties should be within MD processor.

            props.className = 'foo';
            props.srcset = 'foo.png 1x, foo@2x.png 2x';

            console.log('e.node', e.node);

            const p = e.node.properties || (e.node.properties = {});
            p.srcset = 'foo.png x1';
          }
        });
      },
    });

    /**
     * TODO 🐷
     * ENSURE properties make it into the final HTML
     */

    console.log('-------------------------------');
    console.log('res', res);
    console.log('res', res.html);
    // expect(_tree?.type).to.eql('root');
    // expect(_tree?.children[1].type).to.eql('element');
    // expect(_visit.length).to.eql(7);
  });
});
