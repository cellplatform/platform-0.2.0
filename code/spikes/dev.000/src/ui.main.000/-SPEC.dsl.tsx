import { Dev } from '../test.ui';
import { LoadList } from './-SPEC.ui.CmdBar.List';
import { CmdBar, Doc, type t } from './common';

/**
 * TODO 🐷
 * Polish into principled DSL.
 */

export const DSL = {
  find(specs: t.SpecImports, includes: string) {
    return Dev.find(specs, (k) => k.toLowerCase().includes(includes.toLowerCase()));
  },

  findAndRender(specs: t.SpecImports, includes: string, options: { silent?: boolean } = {}) {
    const { silent = true } = options;
    const { spec } = DSL.find(specs, includes);
    const el = spec ? <Dev.Harness spec={spec} style={{ Absolute: 0 }} /> : undefined;
    if (!silent) {
      console.info('specs', specs);
      console.info(`render: "${includes}":el:`, el);
    }
    return el;
  },

  /**
   * Match a given command.
   */
  async matchView(command: string, doc: t.Lens) {
    const text = (command || '').trim();
    const parts = text.split(' ').map((part) => part.trim());
    const lname = (parts[0] || '').toLowerCase();

    if (lname === 'load') {
      const { Specs } = await import('../test.ui/entry.Specs');
      const filter = parts.slice(1).join(' ');
      return (
        <LoadList
          modules={Specs}
          filter={filter}
          onSelect={(e) => {
            doc.change((d) => {
              const path = CmdBar.Path.default.text;
              Doc.Text.replace(d, path, `load ${e.uri}`);
            });
          }}
        />
      );
    }

    return;
  },
} as const;
