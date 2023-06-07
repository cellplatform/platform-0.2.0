import { useEffect, useRef } from 'react';
import { visit } from 'unist-util-visit';

import { State, t } from '../common';

export function useMarkdownLinkClick(args: {
  instance: t.Instance;
  def: t.OverlayDef;
  md?: t.ProcessedMdast;
}) {
  const { instance, def, md } = args;
  const markdown = md?.markdown;
  const ref = useRef<HTMLDivElement>(null);

  /**
   * Markdown.
   */
  useEffect(() => {
    const events = State.Bus.Events({ instance });

    /**
     * Intercept node click events looking for
     * activation links to open the popup with.
     */
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLAnchorElement;
      if (!ref.current || el === null || !md) return;
      if (!ref.current.contains(el)) return;
      if (el.tagName.toUpperCase() !== 'A') return;
      e.preventDefault();

      const base = location.pathname;
      const path = el.pathname.substring(base.length);
      const context = getLinks(md?.mdast);

      events.overlay.def(def, path, { context });
    };

    /**
     * Init/Dispose.
     */
    if (markdown) document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
      events.dispose();
    };
  }, [markdown]);

  /**
   * API
   */
  return { ref };
}

/**
 * Helpers
 */

export function getLinks(mdast?: t.MdastRoot): t.StateOverlayContext[] {
  if (!mdast) return [];
  const res: t.StateOverlayContext[] = [];

  visit(mdast, 'link', (node) => {
    const path = node.url.replace(/^\.\//, '');
    let title = 'Untitled';
    if (node.children[0].type === 'text') title = node.children[0].value;
    res.push({ title, path });
  });

  return res;
}
