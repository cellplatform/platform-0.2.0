import { describe, it, expect } from '../TEST/index.mjs';
import { PathResolverFactory } from './index.mjs';
import { Path } from '../Path/index.mjs';

describe('PathResolver', () => {
  it('throw: root directory not specified', () => {
    const test = (dir: string) => {
      const fn = () => PathResolverFactory({ dir });
      expect(fn).to.throw(/Path resolver must have root directory/);
    };
    test('');
    test('  ');
  });

  it('resolve: throw if not "path:.." URI', async () => {
    const resolve = PathResolverFactory({ dir: '/foo' });

    const test = (input: string) => {
      const fn = () => resolve(input);
      expect(fn).to.throw(/Invalid URI/);
    };

    test('');
    test('.');
    test('./foo');
    test('foo:bar');
  });

  it('resolve: to path', async () => {
    const resolve = PathResolverFactory({ dir: 'root' });

    const test = (uri: string, expected: string) => {
      const path = resolve(uri);
      expect(path).to.eql(Path.join('/root', expected));
    };

    test('path:foo', 'foo');
    test('path:/foo', 'foo');
    test('path:///foo', 'foo');
    test('path:', '/');
    test('path:/', '/');
    test('path:.', '/');
    test('path:///', '/');
    test('path:./foo', 'foo');
    test('path:../foo', '/');

    // Security.
    test('path:foo/../../bar', '/'); // NB: Does not step above root directory.
    test('path:./foo/../..', '/'); //   NB: Does not step above root directory.
    test('path:./foo/../../../../../../../', '/'); //   NB: Does not step above root directory.
  });
});
