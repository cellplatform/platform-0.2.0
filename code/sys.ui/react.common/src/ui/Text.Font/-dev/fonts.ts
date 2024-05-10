import type { t } from '../common';

const isLocal = location.hostname === 'localhost';
// const root = isLocal ? 'http://localhost:5052' : 'https://doc.db.team';
const path = (name: string) => `/fonts/${name}`;

/**
 * Merriweather
 * https://google-webfonts-helper.herokuapp.com/fonts/merriweather?subsets=latin
 */
const MERRIWEATHER_REGULAR_NORMAL: t.FontDefinition = {
  family: 'Merriweather',
  source: path('merriweather-v30-latin-regular.woff'),
  descriptors: { style: 'normal', weight: '400' },
};
const MERRIWEATHER_REGULAR_ITALIC: t.FontDefinition = {
  family: 'Merriweather',
  source: path('merriweather-v30-latin-italic.woff'),
  descriptors: { style: 'italic', weight: '400' },
};
const MERRIWEATHER_BOLD_NORMAL: t.FontDefinition = {
  family: 'Merriweather',
  source: path('merriweather-v30-latin-900.woff'),
  descriptors: { style: 'normal', weight: '900' },
};
const MERRIWEATHER_BOLD_ITALIC: t.FontDefinition = {
  family: 'Merriweather',
  source: path('merriweather-v30-latin-900italic.woff'),
  descriptors: { style: 'italic', weight: '900' },
};

const MERRIWEATHER = {
  regular: { normal: MERRIWEATHER_REGULAR_NORMAL, italic: MERRIWEATHER_REGULAR_ITALIC },
  bold: { normal: MERRIWEATHER_BOLD_NORMAL, italic: MERRIWEATHER_BOLD_ITALIC },
};

/**
 * Typefaces.
 */
export const FONT = {
  MERRIWEATHER,
};
