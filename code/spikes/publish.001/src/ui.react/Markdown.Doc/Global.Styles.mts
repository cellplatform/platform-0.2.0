import { Color, COLORS } from '../common';

export const DEFAULT = {
  FONT_SIZE: 18,
  COLOR: Color.lighten(COLORS.DARK, 10),
  HEADING_COLOR: Color.lighten(COLORS.DARK, 15),
};

export const DocStyles = {
  /**
   * Headings and Sections
   */
  h1: {
    fontSize: 46,
    letterSpacing: `-0.01em`,
  },
  'h1:first-of-type': { marginBottom: 60 },
  'h1, h2': { color: DEFAULT.HEADING_COLOR },

  /**
   * Paragraphs
   * See: /component/<Doc.Paragraph>
   */
  p: {
    fontSize: DEFAULT.FONT_SIZE,
    lineHeight: '1.5em',
    marginBlockStart: '2em',
    marginBlockEnd: '2em',
    color: DEFAULT.COLOR,
  },
  'p del': { opacity: 0.3 },

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
    backgroundColor: Color.alpha(COLORS.DARK, 0.06),
    border: `solid 1px ${Color.alpha(COLORS.DARK, 0.1)}`,
    borderRadius: 3,
    color: COLORS.MAGENTA,
  },

  /**
   * Quotes
   * See: /component/<Doc.Quote>
   */
  'blockquote p': { fontSize: 26 },
  'blockquote p em': {
    color: '#E21B22', // RED
    fontStyle: 'normal',
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
