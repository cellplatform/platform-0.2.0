import { expect, describe, it } from '../test';
import { Value } from '.';

describe('plural', () => {
  it('singular', async () => {
    expect(Value.plural(1, 'item')).to.eql('item');
    expect(Value.plural(-1, 'item')).to.eql('item');
    expect(Value.plural(1, 'item', 'items')).to.eql('item');
    expect(Value.plural(-1, 'item', 'items')).to.eql('item');
  });

  it('plural', async () => {
    expect(Value.plural(0, 'item', 'items')).to.eql('items');
    expect(Value.plural(2, 'item', 'items')).to.eql('items');
    expect(Value.plural(-2, 'item', 'items')).to.eql('items');
    expect(Value.plural(999, 'item', 'items')).to.eql('items');
  });

  it('inferred "s"', async () => {
    expect(Value.plural(0, 'item')).to.eql('items');
    expect(Value.plural(2, 'item')).to.eql('items');
    expect(Value.plural(-2, 'item')).to.eql('items');
    expect(Value.plural(999, 'item')).to.eql('items');
  });
});
