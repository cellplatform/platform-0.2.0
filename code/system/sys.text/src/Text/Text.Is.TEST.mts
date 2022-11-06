import { describe, it, expect } from '../test';
import { Text, Is } from '.';

describe('Text.Is (flags)', () => {
  it('exposed from root index', async () => {
    expect(Text.Is).to.equal(Is);
  });

  it('Is.node (AST)', async () => {
    const md = await Text.Processor.markdown().toHtml('# Heading');
    const ast = md.info.mdast;

    const test = (input: any, expected: boolean) => {
      expect(Is.node(input)).to.eql(expected);
    };

    test(ast, true);

    test({}, false);
    test('', false);
    test(undefined, false);
    test(null, false);

    expect(Is.node({})).to.eql(false);
    expect(Is.node({})).to.eql(false);
  });
});
