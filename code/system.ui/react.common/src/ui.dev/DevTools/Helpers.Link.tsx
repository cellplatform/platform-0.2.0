import { DevIcons, type t } from '../common';

type O = Record<string, unknown>;

/**
 * Link dev-harness helpers.
 */
export const Link = {
  button<T extends O>(pkg: t.ModuleDef, dev: t.DevTools<T>, label: string, target: string) {
    const elRight = <DevIcons.NewTab size={16} />;
    dev.button((btn) => {
      btn
        .label(label)
        .right((e) => elRight)
        .onClick((e) => {
          const targetIsUrl = target.startsWith('https://') || target.startsWith('http://');
          const open = (href: string) => window.open(href, '_blank', 'noopener,noreferrer');
          if (targetIsUrl) open(target);
          else {
            const url = new URL(location.href);
            url.searchParams.set('dev', `${pkg.name}.${target}`);
            open(url.href);
          }
        });
    });
  },

  /**
   * Curried helper.
   */
  pkg<T extends O>(pkg: t.ModuleDef, dev: t.DevTools<T>) {
    const api = {
      button(label: string, target: string) {
        Link.button(pkg, dev, label, target);
        return api;
      },
      hr(line: number | [number, number] = -1, margin?: t.DevHrMargin) {
        dev.hr(line, margin);
        return api;
      },
      title(text: string | [string, string]) {
        dev.title(text);
        return api;
      },
    } as const;
    return api;
  },
} as const;
