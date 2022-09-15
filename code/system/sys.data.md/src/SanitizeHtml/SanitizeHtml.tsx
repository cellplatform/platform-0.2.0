import React from 'react';
import sanitize from 'sanitize-html';

import { css, t } from '../common/index.mjs';

export const DEFAULT = {
  allowedTags: [...sanitize.defaults.allowedTags, 'img'],
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
export const SanitizeHtml: React.FC<SanitizeHtmlProps> = (props) => {
  const { html, className } = props;
  const __html = sanitize(html ?? '', { allowedTags: DEFAULT.allowedTags });
  return <div {...css(props.style)} dangerouslySetInnerHTML={{ __html }} className={className} />;
};
