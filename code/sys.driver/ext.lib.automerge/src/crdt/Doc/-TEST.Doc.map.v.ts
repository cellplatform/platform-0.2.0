  it('toObject', async () => {
    const doc = await factory();
    const map = Immutable.map<F>({ foo: [doc, 'count'], text: [doc, 'msg'] });

    map.change((d) => {
      d.foo = 123;
      d.text = 'hello';
    });

    const obj1 = Doc.toObject(map);
    const obj2 = Doc.toObject(map.current);

    expect(obj1).to.eql({ foo: 123, text: 'hello' });
    expect(obj2).to.eql({ foo: 123, text: 'hello' });
  });
