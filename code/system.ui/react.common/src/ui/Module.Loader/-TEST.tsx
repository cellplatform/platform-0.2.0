import { isValidElement } from 'react';
import { ModuleLoader } from '.';
import { Test, expect, type t } from '../../test.ui';

export default Test.describe('Module.Loader', (e) => {
  e.describe('ModuleLoader.factory ← builder', (e) => {
    type TName = 'foo' | 'bar' | '404';
    type TCtx = { count?: number };

    const testFactory = () => {
      const invoked: t.ModuleLoaderFactoryArgs<TName, TCtx>[] = [];
      const fn: t.ModuleLoaderFactory<TName, TCtx> = async (e) => {
        invoked.push(e);
        if (e.name === 'foo') return <div />;
        if (e.name === 'bar') return null;
        return undefined;
      };

      const assertModuleLoader = (el: JSX.Element, name: string, ctx: {} = {}) => {
        expect(el.props.name).to.eql(name);
        expect(el.props.ctx).to.eql(ctx);
        expect(el.props.factory).to.equal(fn);
      };

      return { fn, invoked, assertModuleLoader } as const;
    };

    e.it('factory', async (e) => {
      const { fn, invoked } = testFactory();
      const loader = ModuleLoader.factory(fn);
      expect(loader.factory).to.equal(fn);
      expect(invoked.length).to.eql(0);

      const args1: t.ModuleLoaderFactoryArgs<TName> = {
        name: 'foo',
        ctx: {},
        theme: 'Light',
        face: 'Front',
        is: { front: false, back: true, light: true, dark: false },
      };
      const args2: t.ModuleLoaderFactoryArgs<TName, TCtx> = {
        name: 'bar',
        ctx: { count: 123 },
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
      const res1 = loader.render('foo', { count: 123 });
      const res2 = loader.render('bar', { count: 456 });
      const res3 = loader.render('404', {});

      assertModuleLoader(res1, 'foo', { count: 123 });
      assertModuleLoader(res2, 'bar', { count: 456 });
      assertModuleLoader(res3, '404', {});
    });

    e.it('factory.render( "typename", {props} ) ← optional display properties', (e) => {
      const { fn, assertModuleLoader } = testFactory();
      const loader = ModuleLoader.factory(fn);
      const ctx = { count: 123 };
      const res = loader.render('foo', ctx, { flipped: true });
      assertModuleLoader(res, 'foo', ctx);
      expect(res.props.flipped).to.eql(true);
    });

    e.it('factory.ctx( ) ← curry the context', (e) => {
      const { fn, assertModuleLoader } = testFactory();
      const ctx = { count: 123 };
      const loader = ModuleLoader.factory(fn).ctx(ctx);
      expect(loader.ctx).to.equal(ctx);

      const res = loader.render('foo', { flipped: true });
      assertModuleLoader(res, 'foo', ctx);
      expect(res.props.flipped).to.eql(true);
    });
  });
});
