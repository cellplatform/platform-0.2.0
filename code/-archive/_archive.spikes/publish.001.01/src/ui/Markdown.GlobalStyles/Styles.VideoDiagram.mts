import { Color, COLORS } from '../common';

export const VideoDiagramStyles = {
  h1: {
    fontSize: 120,
    letterSpacing: '-0.04em',
    lineHeight: '1em',
  },
  h2: {
    fontSize: 80,
    letterSpacing: '-0.04em',
    lineHeight: '1.15em',
  },

  'blockquote p': {
    fontSize: 40,
    lineHeight: '1.4em',
  },

  'ul,ol': {
    fontSize: 40,
  },

  p: {
    fontSize: 50,
  },
};

export const VideoDiagramRefsStyles = {
  ul: { paddingLeft: 25 },
  h1: { color: COLORS.DARK },
  h2: { color: COLORS.DARK },
  h3: { color: COLORS.DARK },

  'h3:first-child': { marginTop: 0 },
  'h4:first-child': { marginTop: 0 },
};
