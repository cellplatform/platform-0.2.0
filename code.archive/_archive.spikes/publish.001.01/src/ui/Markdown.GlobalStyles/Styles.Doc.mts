import { Color, COLORS } from '../common';

const DEFAULT_FONT_SIZE = 18;

const DEFAULT = {
  FONT_SIZE: DEFAULT_FONT_SIZE,
  COLOR: Color.lighten(COLORS.DARK, 10),
  HEADING_COLOR: Color.lighten(COLORS.DARK, 15),
  CSS: {
    EM_HIGHLIGHT: {
      fontStyle: 'normal',
      color: COLORS.MAGENTA,
    },
    CODE: {
      fontFamily: 'monospace',
      fontWeight: 600,
      fontSize: DEFAULT_FONT_SIZE - 2,
      paddingLeft: 5,
      paddingRight: 5,
      color: Color.darken(COLORS.MAGENTA, 8),
      backgroundColor: Color.alpha(COLORS.DARK, 0.06),
      border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
      borderRadius: 3,
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

  h2: {
    fontSize: 32,
    letterSpacing: `-0.01em`,
  },

  h3: {
    fontSize: 20,
    letterSpacing: `0em`,
    color: COLORS.MAGENTA,
    textTransform: 'uppercase',
    marginTop: '3em',
  },

  h4: {
    fontSize: 20,
    letterSpacing: `0em`,
    color: DEFAULT.COLOR,
    textTransform: 'uppercase',
    marginTop: '3em',
  },

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
    backgroundColor: Color.alpha(COLORS.CYAN, 0.3),
    paddingLeft: 4,
    paddingRight: 4,
  },

  /**
   * Links (anchor)
   */
  a: {
    color: COLORS.BLUE,
    textDecoration: 'none',
    ':hover': {
      textDecoration: 'underline',
    },
  },

  /**
   * Lists
   */
  'ul,ol p': {
    marginBlock: 0,
    marginBottom: '2em',
  },
  'ul,ol': {
    fontSize: DEFAULT.FONT_SIZE,
    margin: 0,
  },
  li: {
    marginBottom: '0.6em',
    lineHeight: '1.3em',
  },

  /**
   * Code (Monospaced)
   */
  pre: {
    paddingLeft: 30,
    opacity: 0.6,
    fontSize: 14,
    fontWeight: '600',
  },

  'table code': DEFAULT.CSS.CODE,
  'p code': DEFAULT.CSS.CODE,
  'li code': DEFAULT.CSS.CODE,

  /**
   * Quotes
   * See: /component/<Doc.Quote>
   */
  blockquote: {
    margin: 0,
    padding: 0,
  },
  'blockquote p': {
    fontSize: 26,
    lineHeight: '1.4em',
  },
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
    lineHeight: '1.1em',
  },
  'table thead tr': { backgroundColor: Color.alpha(COLORS.DARK, 0.06) },
  'table th': { padding: 10 },
  'table td': { padding: 10 },
};
