import { Color, COLORS } from '../common';

const BASE = {
  FONT_SIZE: 18,
};

export const DocStyles = {
  h1: {
    fontSize: 40,
  },

  p: {
    fontSize: BASE.FONT_SIZE,
    lineHeight: '1.5em',
    marginBlockStart: '2em',
    marginBlockEnd: '2em',
  },

  'ul,ol p': {
    marginBlock: 0,
    marginBottom: '1.1em',
  },

  'ul,ol': {
    fontSize: BASE.FONT_SIZE,
    margin: 0,
  },

  li: {
    marginBottom: '0.6em',
  },

  hr: {
    border: 'none',
    borderBottom: `solid 6px ${Color.alpha(COLORS.DARK, 0.1)}`,
    marginTop: '2em',
    marginBottom: '2em',
  },

  pre: {
    paddingLeft: 30,
    opacity: 0.6,
    fontWeight: '600',
    fontSize: 14,
  },

  'p code': {
    fontFamily: 'monospace',
    fontWeight: 600,
    fontSize: BASE.FONT_SIZE - 2,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: Color.alpha(COLORS.DARK, 0.06),
    border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    borderRadius: 3,
    color: COLORS.MAGENTA,
  },
};
