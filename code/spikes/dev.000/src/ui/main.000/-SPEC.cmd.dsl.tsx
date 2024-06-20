import { Dev, type t } from '../../test.ui';

/**
 * TODO 🐷
 * Polish into principled DSL.
 */

export const Dsl = {
  find(specs: t.SpecImports, includes: string) {
    return Dev.find(specs, (k) => k.includes(includes));
  },

  findAndRender(specs: t.SpecImports, includes: string) {
    const { spec } = Dsl.find(specs, includes);
    const el = spec ? <Dev.Harness spec={spec} style={{ Absolute: 0 }} /> : undefined;
    return el;
  },

  async load(name: string) {
    const lname = name.toLowerCase();
    const render = Dsl.findAndRender;

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

    if (lname === 'auth') {
      const { Specs } = await import('ext.lib.privy');
      return render(Specs, '.ui.Info');
    }

    if (lname === 'hash') {
      const { Specs } = await import('sys.ui.react.common');
      return render(Specs, '.ui.sample.Hash');
    }

    return undefined;
  },
} as const;
