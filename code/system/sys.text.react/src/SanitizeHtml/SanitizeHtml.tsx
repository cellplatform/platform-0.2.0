import React from 'react';
import sanitizeHtml from 'sanitize-html';

import { css, t, FC } from '../common/index.mjs';

export const DEFAULT = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
};

export type SanitizeHtmlProps = {
  html?: string;
  className?: string;
  style?: t.CssValue;
};

/**
 * See:
 *    https://www.npmjs.com/package/sanitize-html
 *    https://stackoverflow.com/a/38663813
 */
const View: React.FC<SanitizeHtmlProps> = (props) => {
  const { html, className } = props;
  const __html = sanitize(html ?? '');
  return <div {...css(props.style)} dangerouslySetInnerHTML={{ __html }} className={className} />;
};

/**
 * Sanitize HTML
 */
function sanitize(html?: string) {
  return sanitizeHtml(html ?? '', {
    allowedTags: DEFAULT.allowedTags,
  });
}

/**
 * Export
 */
type Fields = {
  DEFAULT: typeof DEFAULT;
  sanitize: typeof sanitize;
};
export const SanitizeHtml = FC.decorate<SanitizeHtmlProps, Fields>(
  View,
  { DEFAULT, sanitize },
  { displayName: 'SanitizeHtml' },
);
