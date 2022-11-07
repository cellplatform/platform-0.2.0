import { Test } from '.';
import { expect, t, Time, describe, it } from '../test';
import { Is } from './common';
import { Tree } from './helpers/Tree';
import { TestModel } from './TestModel';

describe('TestSuiteModel', () => {
  describe('model', () => {
    it('id: "TestSuite.<slug>"', () => {
      const model1 = Test.describe('foo');
      const model2 = Test.describe('foo');

      expect(model1.id.startsWith('TestSuite.')).to.eql(true);
      expect(model2.id.startsWith('TestSuite.')).to.eql(true);

      expect(model1.kind).to.eql('TestSuite');
      expect(model2.kind).to.eql('TestSuite');

      expect(model1).to.not.equal(model2); // NB: Different instance.
    });

    it('Is.suite', () => {
      const test = (input: any, expected: boolean) => {
        expect(Is.suite(input)).to.eql(expected);
      };

      test(undefined, false);
      test(null, false);
      test('', false);
      test(true, false);
      test(123, false);
      test([123], false);
      test({}, false);
      test(TestModel({ parent: Test.describe('foo'), description: 'name' }), false);

      test('TestSuite.1234', true);
      test(Test.describe('foo'), true);
    });

    it('empty (no handler)', () => {
      const root = Test.describe('root');
      expect(root.state.description).to.eql('root');
      expect(root.state.children).to.eql([]);
      expect(root.state.tests).to.eql([]);
      expect(root.state.ready).to.eql(false);
      expect(root.state.modifier).to.eql(undefined);
    });

    it('handler (not initialized)', () => {
      const handler: t.TestSuiteHandler = (e) => null;
      const root = Test.describe('root', handler);
      expect(root.state.ready).to.eql(false);
    });

    it('timeout', async () => {
      const children: t.TestSuiteModel[] = [];

      const root1 = Test.describe('root-1', (e) => {
        const root2 = e.describe('root-2', (e) => {
          e.timeout(-99);
          const root3 = e.describe('root-3', (e) => {
            e.timeout(0).timeout(5000);
          });
          children.push(root3);
        });
        children.push(root2);
      });

      // Default (not initialized yet).
      expect(root1.state.timeout).to.eql(undefined);
      await root1.init();
      const root2 = children[0];
      const root3 = children[1];

      expect(root1.state.timeout).to.eql(undefined);
      expect(root2.state.timeout).to.eql(0); // NB: clamped.
      expect(root3.state.timeout).to.eql(5000);
    });

    it('init (single test)', async () => {
      let test: t.TestModel | undefined = undefined;
      let count = 0;
      const handler: t.TestHandler = () => null;

      const root = Test.describe('root', (e) => {
        count++;
        test = e.it('foo', handler);
      });

      expect(root.state.description).to.eql('root');
      expect(root.state.ready).to.eql(false);
      expect(count).to.eql(0);

      const res1 = await root.init();
      expect(res1).to.equal(root);
      expect(root.state.ready).to.eql(true);
      expect(count).to.eql(1);

      // NB: multiple calls only initialize once.
      const res2 = await res1.init();
      expect(count).to.eql(1);
      expect(res2).to.equal(root);
      expect(root.state.ready).to.eql(true);
      expect(root.state.tests).to.eql([test]);
      expect(root.state.children).to.eql([]);
    });

    it('parent refs', async () => {
      const root = Test.describe('root', (e) => {
        e.describe('child-1', (e) => {
          e.describe('child-2');
        });
      });

      await root.init();
      const child1 = root.state.children[0];
      const child2 = child1.state.children[0];

      expect(root.state.parent).to.equal(undefined);
      expect(child1.state.parent).to.equal(root);
      expect(child2.state.parent).to.equal(child1);
    });

    it('init (async suite setup)', async () => {
      let count = 0;
      const root = Test.describe('root', async (e) => {
        await Time.wait(10);
        e.describe('child', async () => {
          await Time.wait(10);
          count++;
        });
        count++;
      });

      expect(count).to.eql(0);
      await root.init();
      expect(count).to.eql(2);
    });

    it('child suite (deep)', async () => {
      const children: t.TestSuiteModel[] = [];

      const root = Test.describe('root', (e) => {
        const child1 = e.describe('child-1', (e) => {
          const child2 = e.describe('child-2');
          children.push(child2);
        });
        children.push(child1);
      });

      expect(root.state.children).to.eql([]);
      expect(children).to.eql([]);

      await root.init();

      const child1 = children[0];
      const child2 = children[1];

      expect(root.state.ready).to.eql(true);
      expect(root.state.children).to.eql([child1]);

      expect(child1.state.ready).to.eql(true);
      expect(child2.state.ready).to.eql(true);
    });

    it('define: it.skip | it.only', async () => {
      const root = Test.describe('root', (e) => {
        e.it('foo-1');
        e.it.skip('foo-2');
        e.describe('child', (e) => {
          e.it.only('bar');
        });
      });

      await root.init();
      const state = root.state;

      expect(state.tests[0].description).to.eql('foo-1');
      expect(state.tests[1].description).to.eql('foo-2');

      expect(state.tests[0].modifier).to.eql(undefined);
      expect(state.tests[1].modifier).to.eql('skip');

      const child = state.children[0].state;
      expect(child.tests[0].description).to.eql('bar');
      expect(child.tests[0].modifier).to.eql('only');
    });

    it('define: describe.skip | describe.only', async () => {
      const root = Test.describe('root', (e) => {
        e.describe.skip('child-1');
        e.describe.only('child-2');
      });

      await root.init();

      expect(root.state.modifier).to.eql(undefined);
      expect(root.state.children[0].state.modifier).to.eql('skip');
      expect(root.state.children[1].state.modifier).to.eql('only');
    });

    it('define (root): Test.describe.skip | Test.describe.only', async () => {
      const root1 = Test.describe('root');
      const root2 = Test.describe.skip('root');
      const root3 = Test.describe.only('root');

      await root1.init();
      await root2.init();
      await root3.init();

      expect(root1.state.modifier).to.eql(undefined);
      expect(root2.state.modifier).to.eql('skip');
      expect(root3.state.modifier).to.eql('only');
    });

    it('clone', async () => {
      const root1 = Test.describe('root', (e) => {
        e.describe('child-1', (e) => {
          e.it('hello', () => null);
        });
      });

      const root2 = await root1.clone();
      await root1.init();

      const child1 = root1.state.children[0];
      const child2 = root2.state.children[0];

      const test1 = child1.state.tests[0];
      const test2 = child2.state.tests[0];

      // Different instances.
      expect(root1).to.not.equal(root2);
      expect(root1.state).to.not.equal(root2.state);
      expect(root1.state.children[0]).to.not.equal(root2.state.children[0]);
      expect(test1).to.not.equal(test2);

      // Equivalent objects.
      expect(root1.state.description).to.eql(root2.state.description);
      expect(child1.state.description).to.eql(child2.state.description);
      expect(test1.description).to.eql(test2.description);

      // Different ID's.
      expect(root1.id).to.not.eql(root2.id);
      expect(root1.state.children[0].id).to.not.eql(root2.state.children[0].id);

      // Parent hierarchy correctly re-referenced to the clone.
      expect(Tree.root(test1)).to.equal(root1);
      expect(Tree.root(test2)).to.equal(root2);
    });
  });

  describe('run', () => {
    it('sync', async () => {
      let count = 0;
      const root = Test.describe('root', (e) => {
        e.it('foo', () => count++);
      });
      const res = await root.run();

      expect(res.id).to.eql(root.id);
      expect(res.ok).to.eql(true);
      expect(count).to.eql(1);
    });

    it('async', async () => {
      let count = 0;
      const root = Test.describe('root', (e) => {
        e.it('foo', async () => {
          await Time.wait(20);
          count++;
        });
      });
      const res = await root.run();

      expect(res.id).to.eql(root.id);
      expect(count).to.eql(1);
      expect(res.ok).to.eql(true);
      expect(res.elapsed).to.greaterThan(18);
    });

    it('with context {ctx}', async () => {
      const args: t.TestHandlerArgs[] = [];
      const root = Test.describe('root', (e) => {
        e.it('foo', (e) => args.push(e));
      });

      const ctx = { foo: 123 };
      await root.run(); // NB: no context.
      await root.run({ ctx });

      expect(args[0].ctx).to.eql(undefined);
      expect(args[1].ctx).to.eql(ctx);
    });

    it('no tests', async () => {
      const root = Test.describe('root', (e) => null);
      const res = await root.run();
      expect(res.ok).to.eql(true);
    });

    it('deep', async () => {
      let count = 0;

      const root = Test.describe('root', (e) => {
        e.describe('child-1', (e) => {
          e.describe('child-2', (e) => {
            e.it('foo', () => count++);
          });
        });
      });

      const res = await root.run();
      expect(count).to.eql(1);
      expect(res.ok).to.eql(true);
      expect(res.tests).to.eql([]);
      expect(res.children[0].children[0].tests[0].ok).to.eql(true);
    });

    it('not deep (suppressed by param)', async () => {
      let count = 0;
      const root = Test.describe('root', (e) => {
        e.describe('child-1', (e) => {
          e.describe('child-2', (e) => {
            e.it('foo', () => count++);
          });
        });
      });

      const res = await root.run({ deep: false });
      expect(count).to.eql(0);
      expect(res.ok).to.eql(true);
    });

    describe('excluded', () => {
      it('excluded: it.skip', async () => {
        let count = 0;
        const root = Test.describe('root', (e) => {
          e.it('one', () => count++);
          e.it.skip('two', () => count++);
        });

        const res = await root.run();

        expect(count).to.eql(1);
        expect(res.tests[0].excluded).to.eql(undefined);
        expect(res.tests[1].excluded).to.eql(['skip']);
      });

      it('excluded: it.only', async () => {
        const list: string[] = [];
        const root = Test.describe('root', (e) => {
          e.it('1', (e) => list.push('1'));
          e.describe('2', (e) => {
            e.it('2.1', (e) => list.push('2.1'));
            e.it.only('2.2', (e) => list.push('2.2'));
            e.it.skip('2.3', (e) => list.push('2.3'));
          });
        });

        const res = await root.run();

        expect(list).to.eql(['2.2']);
        expect(res.tests[0].excluded).to.eql(['only']);
        expect(res.children[0].tests[0].excluded).to.eql(['only']);
        expect(res.children[0].tests[1].excluded).to.eql(undefined);
        expect(res.children[0].tests[2].excluded).to.eql(['skip', 'only']);
      });

      it('excluded: describe.only', async () => {
        const list: string[] = [];
        const root = Test.describe('root', (e) => {
          e.it('1', (e) => list.push('1'));
          e.describe.only('2', (e) => {
            e.it('2.1', () => list.push('2.1'));
            e.it.skip('2.2', () => list.push('2.2'));
            e.it('2.3', () => list.push('2.3'));
          });
        });

        const res = await root.run();

        expect(list).to.eql(['2.1', '2.3']);
        expect(res.tests[0].excluded).to.eql(['only']);
        expect(res.children[0].tests[0].excluded).to.eql(undefined);
        expect(res.children[0].tests[1].excluded).to.eql(['skip', 'only']);
        expect(res.children[0].tests[2].excluded).to.eql(undefined);
      });

      it('excluded: describe.only => it.only', async () => {
        const list: string[] = [];
        const root = Test.describe('root', (e) => {
          e.it('1', () => list.push('1'));
          e.describe.only('2', (e) => {
            e.it('2.1', () => list.push('2.1'));
            e.it('2.2', () => list.push('2.2'));
            e.it.only('2.3', () => list.push('2.3'));
          });
          e.it.only('3', () => list.push('3'));
        });

        await root.run();
        expect(list).to.eql(['3', '2.3']);
      });

      it('excluded: .only within one suite of a bundled set', async () => {
        const list: string[] = [];
        const root1 = Test.describe('1', (e) => {
          e.it('1.1', (e) => list.push('1.1'));
        });
        const root2 = Test.describe('2', (e) => {
          e.it.only('2.1', (e) => list.push('2.1'));
        });

        const bundle = await Test.bundle([root1, root2]);

        const children = bundle.state.children;
        const test1 = children[0].state.tests[0];
        const test2 = children[1].state.tests[0];

        expect(Tree.root(test1)).to.equal(bundle);
        expect(Tree.root(test2)).to.equal(bundle);

        expect(test1).to.not.equal(root1.state.tests[0]);
        expect(test2).to.not.equal(root2.state.tests[0]);

        await bundle.run();

        expect(list).to.eql(['2.1']);
      });
    });

    describe('error', () => {
      it('error: test throws error', async () => {
        const root = Test.describe('root', (e) => {
          e.it('foo', async () => {
            throw new Error('Fail');
          });
        });
        const res = await root.run();
        expect(res.ok).to.eql(false);
        expect(res.tests[0].error?.message).to.include('Fail');
      });

      it('error: test throws error (timeout, deep)', async () => {
        let count = 0;
        const root = Test.describe('root', (e) => {
          e.it('test-1', () => count++);
          e.describe('child-1', (e) => {
            e.it('test-2', () => count++);
            e.describe('child-2', (e) => {
              e.it('test-3', async () => {
                await Time.wait(30);
                count++;
              });
            });
          });
        });

        const res = await root.run({ timeout: 10 });

        expect(res.elapsed).to.greaterThan(9);
        expect(res.elapsed).to.lessThan(20);

        expect(count).to.eql(2); // NB: failing test never increments counter.
        expect(res.ok).to.eql(false);

        expect(res.tests[0].ok).to.eql(true);
        expect(res.children[0].ok).to.eql(false);
        expect(res.children[0].tests[0].ok).to.eql(true);
        expect(res.children[0].children[0].tests[0].ok).to.eql(false);
        expect(res.children[0].children[0].tests[0].error?.message).to.include('timed out');
      });
    });
  });

  describe('merge', () => {
    it('merges', async () => {
      const root = Test.describe('root');
      const child1 = Test.describe('child-1');
      const child2 = Test.describe('child-2');
      const child3 = Test.describe('child-3');

      expect(root.state.children).to.eql([]);

      await root.merge(child1);
      expect(root.state.children.length).to.eql(1);
      expect(root.state.children[0].state.description).to.eql(child1.state.description);

      await root.merge(child2, child3);
      expect(root.state.children.length).to.eql(3);

      expect(root.state.children[0].state.description).to.eql(child1.state.description);
      expect(root.state.children[1].state.description).to.eql(child2.state.description);
      expect(root.state.children[2].state.description).to.eql(child3.state.description);

      expect(root.state.children[0].state.parent?.id).to.eql(root.id);
      expect(root.state.children[1].state.parent?.id).to.eql(root.id);
      expect(root.state.children[2].state.parent?.id).to.eql(root.id);

      // Not the same instance (cloned).
      expect(root.state.children[0]).to.not.equal(child1);
      expect(root.state.children[1]).to.not.equal(child2);
      expect(root.state.children[2]).to.not.equal(child3);

      expect(Tree.root(root.state.children[0])).to.equal(root);
      expect(Tree.root(root.state.children[1])).to.equal(root);
      expect(Tree.root(root.state.children[2])).to.equal(root);
    });
  });

  describe('Test.bundle', () => {
    it('nothing [<empty>]', async () => {
      const bundle = await Test.bundle([]);
      expect(bundle.state.children).to.eql([]);
      expect(bundle.state.description).to.eql('Tests');
    });

    it('TestSuite {objects}', async () => {
      const root1 = Test.describe('1', (e) => e.it('1.1'));
      const root2 = Test.describe('2', (e) => e.it('2.1'));

      const bundle = await Test.bundle([root1, root2]);

      const children = bundle.state.children;
      const test1 = children[0].state.tests[0];
      const test2 = children[1].state.tests[0];

      expect(children.length).to.eql(2);
      expect(children[0].state.description).to.eql(root1.state.description);
      expect(children[1].state.description).to.eql(root2.state.description);

      expect(children[0].state.parent?.id).to.eql(bundle.id);
      expect(children[1].state.parent?.id).to.eql(bundle.id);

      expect(Tree.root(test1)).to.equal(bundle);
      expect(Tree.root(test2)).to.equal(bundle);
    });

    it('dynamic imports("...")', async () => {
      const root1 = import('./test.samples/One.TEST');
      const root2 = import('./test.samples/Two.TEST');

      const bundle = await Test.bundle([root1, root2]);

      const children = bundle.state.children;
      const test1 = children[0].state.tests[0];
      const test2 = children[1].state.tests[0];

      expect(children.length).to.eql(2);
      expect(children[0].state.description).to.eql('One');
      expect(children[1].state.description).to.eql('Two');

      expect(children[0].state.parent?.id).to.eql(bundle.id);
      expect(children[0].state.parent?.id).to.eql(bundle.id);

      expect(Tree.root(test1)).to.equal(bundle);
      expect(Tree.root(test2)).to.equal(bundle);
    });

    it('dynamic: with no export (ignore)', async () => {
      const bundle1 = await Test.bundle([import('./test.samples/NoExport.TEST')]);
      expect(bundle1.state.children).to.eql([]);

      const bundle2 = await Test.bundle([
        import('./test.samples/NoExport.TEST'), // NB: Will not merge anything (no default export)
        import('./test.samples/One.TEST'),
        import('./test.samples/Two.TEST'),
      ]);
      const children = bundle2.state.children;
      expect(children.length).to.eql(2);
      expect(children[0].state.description).to.eql('One');
      expect(children[1].state.description).to.eql('Two');
    });

    it('dynamic: default export not a test-suite (ignore)', async () => {
      const bundle = await Test.bundle([import('./test.samples/ExportNonSuite.TEST')]);
      expect(bundle.state.children).to.eql([]);
    });

    it('mixed import (dynamic/static) with explicit root "description"', async () => {
      const root1 = Test.describe('One');
      const root2 = import('./test.samples/Two.TEST');

      const bundle = await Test.bundle('MySuite', [root1, root2]);
      const children = bundle.state.children;

      expect(bundle.state.description).to.eql('MySuite');
      expect(children.length).to.eql(2);
      expect(children[0].state.description).to.eql('One');
      expect(children[1].state.description).to.eql('Two');
    });

    it('single item bundle (no array)', async () => {
      const root1 = Test.describe('One');
      const root2 = import('./test.samples/Two.TEST');

      const bundle1 = await Test.bundle(root1);
      const bundle2 = await Test.bundle(root2);
      const bundle3 = await Test.bundle('MySuite-1', root1);
      const bundle4 = await Test.bundle('MySuite-2', root2);

      expect(bundle1.state.description).to.eql(root1.state.description); // NB: Root name taken from single bundle.
      expect(bundle2.state.description).to.eql((await root2).default.state.description); // NB: Root name taken from single bundle.
      expect(bundle3.state.description).to.eql('MySuite-1'); // NB: Custom name.
      expect(bundle4.state.description).to.eql('MySuite-2');
    });
  });

  describe('Test.run', () => {
    it('nothing [<empty>]', async () => {
      const res = await Test.run([]);
      expect(res.ok).to.eql(true);
      expect(res.description).to.eql('Tests');
      expect(res.tests).to.eql([]);
      expect(res.children).to.eql([]);
    });

    it('TestSuite {objects}', async () => {
      const root1 = Test.describe('1', (e) => e.it('1.1'));
      const root2 = Test.describe('2', (e) => e.it('2.1'));

      const test = async (res: t.TestSuiteRunResponse) => {
        expect(res.ok).to.eql(true);
        expect(res.description).to.eql('Tests');
        expect(res.tests).to.eql([]);
        expect(res.children.length).to.eql(2);
        expect(res.children[0].tests[0].description).to.eql('1.1');
        expect(res.children[1].tests[0].description).to.eql('2.1');
      };

      await test(await Test.run([root1, root2]));
      await test(await Test.run(await Test.bundle([root1, root2])));
    });

    it('dynamic imports("...")', async () => {
      const root1 = import('./test.samples/One.TEST');
      const root2 = import('./test.samples/Two.TEST');

      const res = await Test.run([root1, root2]);
      expect(res.ok).to.eql(true);
      expect(res.description).to.eql('Tests');

      expect(res.children[0].tests[0].description).to.eql('one.foo');
      expect(res.children[1].tests[0].description).to.eql('two.foo');
    });

    it('mixed import (dynamic/static) with explicit root "description"', async () => {
      const root1 = Test.describe('One');
      const root2 = import('./test.samples/Two.TEST');

      const res = await Test.run('MySuite', [root1, root2]);
      expect(res.ok).to.eql(true);
      expect(res.description).to.eql('MySuite');

      expect(res.children[0].description).to.eql('One');
      expect(res.children[1].description).to.eql('Two');

      expect(res.children[0].tests).to.eql([]);
      expect(res.children[1].tests[0].description).to.eql('two.foo');
    });
  });
});
