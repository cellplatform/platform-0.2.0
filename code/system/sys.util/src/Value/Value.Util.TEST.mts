import { expect } from 'chai';
import { Value } from './index.mjs';

describe('deleteUndefined', () => {
  it('retains existing values, removes undefined', () => {
    const res = Value.deleteUndefined({
      nothing: undefined,
      yes: true,
      no: false,
      zero: 0,
      value: null,
      text: '',
    });

    expect(res).to.eql({
      yes: true,
      no: false,
      zero: 0,
      value: null,
      text: '',
    });
  });
});

describe('deleteEmpty', () => {
  it('deletes empty/undefined values', () => {
    const res = Value.deleteEmpty({
      nothing: undefined,
      yes: true,
      no: false,
      zero: 0,
      value: null,
      text: '',
    });
    expect(res).to.eql({
      yes: true,
      no: false,
      zero: 0,
      value: null,
    });
  });
});

describe('isStatusOk', () => {
  it('is ok', async () => {
    expect(Value.isStatusOk(200)).to.eql(true);
    expect(Value.isStatusOk(201)).to.eql(true);
  });

  it('is not ok', async () => {
    expect(Value.isStatusOk(404)).to.eql(false);
    expect(Value.isStatusOk(500)).to.eql(false);
    expect(Value.isStatusOk(0)).to.eql(false);
    expect(Value.isStatusOk(undefined as any)).to.eql(false);
  });
});

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
