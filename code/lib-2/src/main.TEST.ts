import { expect } from 'chai';
import { Foo, MyType, t } from 'lib-1';
import { Bar } from 'lib-1/bar';

describe('Main (lib-2)', () => {
  it('foo', () => {
    expect(123).to.eql(123);
    console.log('Foo', Foo);

    expect(Foo.msg).to.eql('Hello!');
    console.log('Bar', Bar);

    const obj1: MyType = { name: 'one' };
    const obj2: t.MyType = { name: 'one' };

    console.log('-------------------------------------------');
    console.log('obj1', obj1);
    console.log('obj2', obj2);

    console.log('-------------------------------------------');
    expect(123).to.eql(123);
  });
});
