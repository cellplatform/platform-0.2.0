import { Value } from '.';
import { describe, expect, it } from '../test';

describe('plural', () => {
  it('singular', () => {
    expect(Value.plural(1, 'item')).to.eql('item');
    expect(Value.plural(-1, 'item')).to.eql('item');
    expect(Value.plural(1, 'item', 'items')).to.eql('item');
    expect(Value.plural(-1, 'item', 'items')).to.eql('item');
  });

  it('plural', () => {
    expect(Value.plural(0, 'item', 'items')).to.eql('items');
    expect(Value.plural(2, 'item', 'items')).to.eql('items');
    expect(Value.plural(-2, 'item', 'items')).to.eql('items');
    expect(Value.plural(999, 'item', 'items')).to.eql('items');
  });

  it('inferred "s"', () => {
    expect(Value.plural(0, 'item')).to.eql('items');
    expect(Value.plural(2, 'item')).to.eql('items');
    expect(Value.plural(-2, 'item')).to.eql('items');
    expect(Value.plural(999, 'item')).to.eql('items');
  });
});

describe('toggle', () => {
  it('invalid input', () => {
    [null, 123, '', true].forEach((value: any) => {
      const res = Value.toggle(value, 'foo');
      expect(res).to.eql(false, `value: ${value}`);
    });
  });

  it('toggle: {object}', () => {
    const obj = { foo: true, bar: '👋' };

    const res1 = Value.toggle(obj, 'foo');
    const res2 = Value.toggle(obj, 'bar');
    expect(obj.foo).to.eql(false);
    expect(obj.bar).to.eql('👋');
    expect(res1).to.eql(false);
    expect(res2).to.eql(false);

    const res3 = Value.toggle(obj, 'foo');
    expect(obj.foo).to.eql(true);
    expect(res3).to.eql(true);
  });

  it('toggle: [array]', () => {
    const list = [true, '👋'];

    const res1 = Value.toggle(list, 0);
    const res2 = Value.toggle(list, 1);
    const res3 = Value.toggle(list, 999);
    const res4 = Value.toggle(list, 999);

    expect(res1).to.eql(false);
    expect(res2).to.eql(false);
    expect(res3).to.eql(true);
    expect(res4).to.eql(false);

    expect(list[0]).to.eql(false);
    expect(list[1]).to.eql('👋');
    expect(list[999]).to.eql(false);
  });
});
