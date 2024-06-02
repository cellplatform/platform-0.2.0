import { Dev, type t } from '../../test.ui';

/**
 * TODO 🐷
 * Polish into principled DSL.
 */

export const Loader = {
  find(specs: t.SpecImports, includes: string) {
    const ns = Object.keys(specs).find((key) => key.includes(includes));
    const spec = ns ? specs[ns] : undefined;
    return { ns, spec } as const;
  },

  findAndRender(specs: t.SpecImports, includes: string) {
    const { spec } = Loader.find(specs, includes);
    const el = spec ? <Dev.Harness spec={spec} /> : undefined;
    return el;
  },

  async load(name: string) {
    const lname = name.toLowerCase();
    const render = Loader.findAndRender;

    if (lname === 'diagram') {
      const { Specs } = await import('ext.lib.reactflow');
      await import('reactflow/dist/style.css');
      return render(Specs, 'Sample.01');
    }

    if (lname === 'code') {
      const { Specs } = await import('ext.lib.monaco');
      return render(Specs, '.ui.MonacoEditor');
    }

    if (lname === 'cmdbar') {
      const { Specs } = await import('ext.lib.automerge');
      return render(Specs, '.ui.Cmd.Bar');
    }

    return undefined;
  },
} as const;
