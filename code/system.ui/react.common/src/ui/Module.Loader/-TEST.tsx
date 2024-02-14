import { isValidElement } from 'react';
import { ModuleLoader } from '.';
import { Test, expect, type t } from '../../test.ui';

export default Test.describe('Module.Loader', (e) => {
  e.describe('ModuleLoader.factory ← builder', (e) => {
    type TName = 'foo' | 'bar' | '404';

    const testFactory = () => {
      const invoked: t.ModuleLoaderFactoryArgs<TName>[] = [];
      const fn: t.ModuleLoaderFactory<TName> = async (e) => {
        invoked.push(e);
        if (e.name === 'foo') return <div />;
        if (e.name === 'bar') return null;
        return undefined;
      };

      const assertModuleLoader = (el: JSX.Element, name: string) => {
        expect(el.props.name).to.eql(name);
        expect(el.props.factory).to.equal(fn);
      };

      return { fn, invoked, assertModuleLoader } as const;
    };

    e.it('factory', async (e) => {
      const { fn, invoked } = testFactory();
      const loader = ModuleLoader.factory(fn);
      expect(loader.factory).to.equal(fn);
      expect(invoked.length).to.eql(0);

      type A = t.ModuleLoaderFactoryArgs<TName>;
      const args1: A = {
        name: 'foo',
        theme: 'Light',
        face: 'Front',
        is: { front: false, back: true, light: true, dark: false },
      };
      const args2: A = {
        name: 'bar',
        theme: 'Dark',
        face: 'Back',
        is: { front: false, back: true, light: true, dark: false },
      };

      const res1 = await loader.factory(args1);
      const res2 = await loader.factory(args2);
      expect(isValidElement(res1)).to.eql(true);
      expect(res2).to.eql(null);

      expect(invoked.length).to.eql(2);
      expect(invoked[0]).to.eql(args1);
      expect(invoked[1]).to.eql(args2);
    });

    e.it('factory.render( "typename" )', (e) => {
      const { fn, assertModuleLoader } = testFactory();
      const loader = ModuleLoader.factory(fn);
      const res1 = loader.render('foo');
      const res2 = loader.render('bar');
      const res3 = loader.render('404');

      assertModuleLoader(res1, 'foo');
      assertModuleLoader(res2, 'bar');
      assertModuleLoader(res3, '404');
    });
  });
});
