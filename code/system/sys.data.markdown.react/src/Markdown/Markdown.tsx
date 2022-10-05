import React from 'react';

import { Style, t } from '../common/index.mjs';
import { SanitizeHtml } from '../SanitizeHtml/index.mjs';
import { Markdown as MD } from 'sys.data.markdown';

const globalStyles: { [className: string]: boolean } = {};

type HtmlString = string;
type MarkdownString = string;

export const Markdown = {
  ...MD,

  /**
   * Transform markdown into a sanitized (safe) DOM element.
   */
  toElement(
    markdown?: MarkdownString | HtmlString,
    options: { style?: t.CssValue; className?: string } = {},
  ) {
    const text = (markdown ?? '').trim();
    const isHtml = text.startsWith('<') && text.endsWith('>');
    const html = isHtml ? text : MD.toHtmlSync(markdown ?? '');
    return <SanitizeHtml html={html} style={options.style} className={options.className} />;
  },

  /**
   * Register markdown CSS styles
   */
  ensureStyles(className: string, styles: t.CssPropsMap, options: { force?: boolean } = {}) {
    const exists = Boolean(globalStyles[className]);
    if (!exists || options.force) {
      Style.global(styles, { prefix: `.${className}` });
    }
    globalStyles[className] = true;
    return { exists, className };
  },
};
