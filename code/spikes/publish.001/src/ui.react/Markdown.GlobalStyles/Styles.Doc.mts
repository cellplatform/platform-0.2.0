import { Color, COLORS } from '../common';

const DEFAULT = {
  FONT_SIZE: 18,
  COLOR: Color.lighten(COLORS.DARK, 10),
  HEADING_COLOR: Color.lighten(COLORS.DARK, 15),
  CSS: {
    EM_HIGHLIGHT: {
      fontStyle: 'normal',
      // color: '#E21B22', // RED
      color: COLORS.MAGENTA,
    },
  },
};

export const DocStyles = {
  /**
   * Headings and Sections
   */
  h1: {
    fontSize: 50,
    letterSpacing: `-0.01em`,
  },
  // 'h1:first-of-type': { marginBottom: 60 },
  // 'h1, h2': { color: DEFAULT.HEADING_COLOR },

  'h1 em': DEFAULT.CSS.EM_HIGHLIGHT,
  'h2 em': DEFAULT.CSS.EM_HIGHLIGHT,

  /**
   * Paragraphs
   * See: /component/<Doc.Paragraph>
   */
  p: {
    fontSize: DEFAULT.FONT_SIZE,
    lineHeight: '1.8em',
    marginBlockStart: '2em',
    marginBlockEnd: '2em',
    color: DEFAULT.COLOR,
  },
  'p del': { opacity: 0.3 },
  'p em': {
    opacity: 1,
    fontStyle: 'normal',
    color: COLORS.DARK,
    backgroundColor: Color.alpha(COLORS.YELLOW, 0.1),
  },

  /**
   * Links (anchor)
   */
  a: {
    color: COLORS.BLUE,
    textDecoration: 'none',
    ':hover': { textDecoration: 'underline' },
  },

  /**
   * Lists
   */
  'ul,ol p': {
    marginBlock: 0,
    marginBottom: '1.1em',
  },
  'ul,ol': {
    fontSize: DEFAULT.FONT_SIZE,
    margin: 0,
  },
  li: { marginBottom: '0.6em' },

  /**
   * Code (Monospaced)
   */
  pre: {
    paddingLeft: 30,
    opacity: 0.6,
    fontSize: 14,
    fontWeight: '600',
  },

  'p code': {
    fontFamily: 'monospace',
    fontWeight: 600,
    fontSize: DEFAULT.FONT_SIZE - 2,
    paddingLeft: 5,
    paddingRight: 5,
    color: Color.darken(COLORS.MAGENTA, 8),
    backgroundColor: Color.alpha(COLORS.DARK, 0.06),
    border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    borderRadius: 3,
  },

  /**
   * Quotes
   * See: /component/<Doc.Quote>
   */
  'blockquote p': { fontSize: 26 },
  'blockquote em': {
    fontStyle: 'normal',
    color: '#E21B22', // RED
    backgroundColor: 'transparent',
  },

  /**
   * Table
   * See: /component/<Doc.Table>
   */
  table: {
    width: '100%',
    marginTop: '2em',
    marginBottom: '2em',
  },
  'table thead tr': { backgroundColor: Color.alpha(COLORS.DARK, 0.06) },
  'table th': { padding: 10 },
  'table td': { padding: 10 },
};
