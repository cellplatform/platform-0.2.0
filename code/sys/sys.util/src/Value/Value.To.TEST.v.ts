import { expect, describe, it } from '../test';
import { Value } from './Value';

describe('Value.toNumber', () => {
  it('returns the non-number value', () => {
    const NOW = new Date();
    const OBJECT = { foo: 123 };
    expect(Value.toNumber('hello')).to.equal('hello');
    expect(Value.toNumber(OBJECT)).to.equal(OBJECT);
    expect(Value.toNumber(NOW)).to.equal(NOW);
    expect(Value.toNumber(null)).to.equal(null);
    expect(Value.toNumber(undefined)).to.equal(undefined);
  });

  it('converts a string to a number', () => {
    expect(Value.toNumber('0')).to.equal(0);
    expect(Value.toNumber('-1')).to.equal(-1);
    expect(Value.toNumber('1')).to.equal(1);
    expect(Value.toNumber('12.34')).to.equal(12.34);
  });

  it('does not convert a number/unit string toa number', () => {
    expect(Value.toNumber('10px')).to.equal('10px');
  });
});

describe('Value.toBool', () => {
  describe('existing Boolean value', () => {
    it('true (no change)', () => {
      expect(Value.toBool(true)).to.equal(true);
    });

    it('false (no change)', () => {
      expect(Value.toBool(false)).to.equal(false);
    });
  });

  describe('string to Boolean', () => {
    it('converts `true` (string) to true', () => {
      expect(Value.toBool('true')).to.equal(true);
      expect(Value.toBool('True')).to.equal(true);
      expect(Value.toBool('   truE   ')).to.equal(true);
    });

    it('converts `false` (string) to false', () => {
      expect(Value.toBool('false')).to.equal(false);
      expect(Value.toBool('False')).to.equal(false);
      expect(Value.toBool('   falSe   ')).to.equal(false);
    });
  });

  it('does not convert other value types', () => {
    expect(Value.toBool(undefined)).to.equal(undefined);
    expect(Value.toBool(null)).to.equal(undefined);
    expect(Value.toBool('Foo')).to.equal(undefined);
    expect(Value.toBool('')).to.equal(undefined);
    expect(Value.toBool(' ')).to.equal(undefined);
    expect(Value.toBool(123)).to.equal(undefined);
    expect(Value.toBool({ foo: 123 })).to.eql(undefined);
  });

  it('returns the given default value', () => {
    expect(Value.toBool(undefined, true)).to.equal(true);
    expect(Value.toBool(undefined, false)).to.equal(false);
    expect(Value.toBool(undefined)).to.equal(undefined);

    expect(Value.toBool(null, true)).to.equal(true);
    expect(Value.toBool(null, false)).to.equal(false);
    expect(Value.toBool(null)).to.equal(undefined);
  });
});

describe('toType', () => {
  it('converts to bool (true)', () => {
    expect(Value.toType('true')).to.equal(true);
    expect(Value.toType(' true  ')).to.equal(true);
    expect(Value.toType('True')).to.equal(true);
    expect(Value.toType('TRUE')).to.equal(true);
  });

  it('converts to bool (false)', () => {
    expect(Value.toType('false')).to.equal(false);
    expect(Value.toType(' false  ')).to.equal(false);
    expect(Value.toType('False')).to.equal(false);
    expect(Value.toType('FALSE')).to.equal(false);
  });

  it('converts to number', () => {
    expect(Value.toType('123')).to.equal(123);
    expect(Value.toType(' -123  ')).to.equal(-123);
    expect(Value.toType('0')).to.equal(0);
    expect(Value.toType('0.0001')).to.equal(0.0001);
  });

  it('converts to null', () => {
    expect(Value.toType('null')).to.equal(null);
    expect(Value.toType('NULL')).to.equal(null);
    expect(Value.toType('Null')).to.equal(null);
    expect(Value.toType('  null  ')).to.equal(null);
  });

  it('converts to undefined', () => {
    expect(Value.toType('undefined')).to.equal(undefined);
    expect(Value.toType('UNDEFINED')).to.equal(undefined);
    expect(Value.toType('Undefined')).to.equal(undefined);
    expect(Value.toType('  undefined  ')).to.equal(undefined);
  });

  it('does not convert', () => {
    const now = new Date();
    expect(Value.toType('foo')).to.eql('foo');
    expect(Value.toType(undefined)).to.eql(undefined);
    expect(Value.toType(null)).to.eql(null);
    expect(Value.toType({})).to.eql({});
    expect(Value.toType(now)).to.eql(now);
    expect(Value.toType(123)).to.eql(123);
  });
});
