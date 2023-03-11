import { expect, describe, it } from '../test';
import { Subject } from 'rxjs';

import { Is } from '.';

describe('Is', () => {
  it('Is.env.(node|browser)', () => {
    // NB: Tests are running within on [node] via Vitest, which is why [Is.node === true]
    //     Also, the target environment is set to "web", and so [jsdom] has been turned on for testing.
    expect(Is.env.browser).to.eql(true);
    expect(Is.env.nodejs).to.eql(true);
  });

  it('Is.observable', () => {
    const test = (input: any, expected: boolean) => {
      expect(Is.observable(input)).to.eql(expected);
    };

    test(undefined, false);
    test(null, false);
    test('hello', false);
    test(1223, false);
    test({}, false);

    test({ subscribe: () => null }, true);
    test(new Subject<void>(), true);
    test(new Subject<void>().asObservable(), true);

    const $ = new Subject() as unknown;
    if (Is.observable<number>($)) {
      $.subscribe(); // Type inferred after boolean check.
    }
  });

  it('Is.subject', () => {
    const test = (input: any, expected: boolean) => {
      expect(Is.subject(input)).to.eql(expected);
    };

    test(undefined, false);
    test(null, false);
    test('hello', false);
    test(1223, false);
    test({}, false);

    test({ subscribe: () => null }, false);
    test({ subscribe: () => null, next: () => null }, true);

    test(new Subject<void>(), true);
    test(new Subject<void>().asObservable(), false);

    const $ = new Subject() as unknown;
    if (Is.subject<number>($)) {
      $.next(1234); // Type inferred after boolean check.
    }
  });

  it('Is.stream', () => {
    const test = (input: any, expected: boolean) => {
      expect(Is.stream(input)).to.eql(expected);
    };

    test(undefined, false);
    test(null, false);
    test('hello', false);
    test(1223, false);
    test({}, false);
    test(new Subject<void>(), false);

    const stream = { on: () => null };
    test(stream, true);
  });

  it('Is.promise', () => {
    const test = (input: any, expected: boolean) => {
      expect(Is.promise(input)).to.eql(expected);
    };

    const myPromise = () => new Promise<void>((resolve) => resolve());
    const wait = async () => null;

    test(undefined, false);
    test(123, false);
    test('hello', false);
    test(['hello', 123], false);
    test(true, false);
    test(null, false);
    test({}, false);

    test({ then: () => null }, true);
    test(wait(), true);
    test(myPromise(), true);

    const p = myPromise as unknown;
    if (Is.promise<string>(p)) {
      p.then(); // Type inferred after boolean check.
    }
  });

  describe('Is.plainObject', () => {
    it('is a plain object', () => {
      expect(Is.plainObject(Object.create({}))).to.eql(true);
      expect(Is.plainObject(Object.create(Object.prototype))).to.eql(true);
      expect(Is.plainObject({ foo: 123 })).to.eql(true);
      expect(Is.plainObject({})).to.eql(true);
    });

    it('is not a plain object', () => {
      class Foo {}
      expect(Is.plainObject(1)).to.eql(false);
      expect(Is.plainObject(['foo', 'bar'])).to.eql(false);
      expect(Is.plainObject([])).to.eql(false);
      expect(Is.plainObject(new Foo())).to.eql(false);
      expect(Is.plainObject(null)).to.eql(false);
      expect(Is.plainObject(Object.create(null))).to.eql(false);
    });
  });

  describe('Is.blank', () => {
    describe('blank', () => {
      it('is blank (nothing)', () => {
        expect(Is.blank(undefined)).to.eql(true);
        expect(Is.blank(null)).to.eql(true);
      });

      it('is blank (string)', () => {
        expect(Is.blank('')).to.eql(true);
        expect(Is.blank(' ')).to.eql(true);
        expect(Is.blank('   ')).to.eql(true);
      });

      it('is blank (array)', () => {
        expect(Is.blank([])).to.eql(true);
        expect(Is.blank([null])).to.eql(true);
        expect(Is.blank([undefined])).to.eql(true);
        expect(Is.blank([undefined, null])).to.eql(true);
        expect(Is.blank([undefined, null, ''])).to.eql(true);
      });
    });

    describe('NOT blank', () => {
      it('is not blank (string)', () => {
        expect(Is.blank('a')).to.eql(false);
        expect(Is.blank('   .')).to.eql(false);
      });

      it('is not blank (array)', () => {
        expect(Is.blank([1])).to.eql(false);
        expect(Is.blank([null, 'value'])).to.eql(false);
        expect(Is.blank([null, '   .'])).to.eql(false);
      });

      it('is not blank (other values)', () => {
        expect(Is.blank(1)).to.eql(false);
        expect(Is.blank({})).to.eql(false);
        expect(Is.blank(() => 0)).to.eql(false);
      });
    });
  });

  describe('Is.numeric', () => {
    it('from (number)', () => {
      expect(Is.numeric(0)).to.equal(true);
      expect(Is.numeric(1)).to.equal(true);
      expect(Is.numeric(-1)).to.equal(true);
      expect(Is.numeric(0.5)).to.equal(true);
      expect(Is.numeric(123456.123456)).to.equal(true);
    });

    it('from (string)', () => {
      expect(Is.numeric('0')).to.equal(true);
      expect(Is.numeric('1')).to.equal(true);
      expect(Is.numeric('-1')).to.equal(true);
      expect(Is.numeric('0.5')).to.equal(true);
      expect(Is.numeric('123456.123456')).to.equal(true);
    });

    it('is not numeric', () => {
      expect(Is.numeric(null)).to.equal(false);
      expect(Is.numeric(undefined)).to.equal(false);
      expect(Is.numeric('string')).to.equal(false);
      expect(Is.numeric('123px')).to.equal(false);
      expect(Is.numeric({})).to.equal(false);
      expect(Is.numeric(new Date())).to.equal(false);
    });
  });

  describe('Is.json', () => {
    it('is not JSON', () => {
      expect(Is.json()).to.eql(false);
      expect(Is.json(null)).to.eql(false);
      expect(Is.json(123)).to.eql(false);
      expect(Is.json(new Date())).to.eql(false);
      expect(Is.json({})).to.eql(false);
    });

    it('is a string but not JSON', () => {
      expect(Is.json('')).to.eql(false);
      expect(Is.json('  ')).to.eql(false);
      expect(Is.json('hello')).to.eql(false);
    });

    it('is JSON', () => {
      expect(Is.json('{}')).to.eql(true);
      expect(Is.json('[]')).to.eql(true);
      expect(Is.json('{ "foo": 123 }')).to.eql(true);
      expect(Is.json('[1,2,3]')).to.eql(true);
    });

    it('is JSON (trimmed string)', () => {
      expect(Is.json('  {} ')).to.eql(true);
      expect(Is.json(' []  ')).to.eql(true);
    });
  });

  describe('Is.email', () => {
    it('is an email', () => {
      const test = (input: any) => expect(Is.email(input)).to.eql(true);
      test('name@domain.com');
      test('123@456.com');
    });

    it('is not email', () => {
      const test = (input: any) => expect(Is.email(input)).to.eql(false);

      [undefined, null, 123, true, false, [], {}].forEach((value) => test(value));
      test('');
      test('  ');

      test('foo');
      test('foo@');
      test('@domain.com');
      test('domain.com');
      test('foo@domain');

      test('  name@domain.com  '); // NB: Whitespace
      test('name@domain.com ');
      test(' name@domain.com');

      test('mailto:name@domain.com');
    });
  });

  describe('Is.url', () => {
    it('is a URL', () => {
      const test = (input: any) => expect(Is.url(input)).to.eql(true, input);
      test('http://foo.com');
      test('https://foo.com/path?s=123');
      test('   https://foo.com  ');
    });

    it('is not a URL', () => {
      const test = (input: any) => expect(Is.url(input)).to.eql(false);
      [undefined, null, 123, true, false, [], {}].forEach((value) => test(value));
      test('');
      test('  ');
      test('foo.com');
    });
  });
});
