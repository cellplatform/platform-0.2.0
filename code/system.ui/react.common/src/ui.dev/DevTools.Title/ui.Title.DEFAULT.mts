import { t, COLORS } from '../common';

const style: Required<t.DevTitleStyle> = {
  color: COLORS.DARK,
  margin: [0, 0, 6, 0],
  size: 14,
  bold: true,
  italic: false,
  ellipsis: true,
  opacity: 1,
};

export const DEFAULT = {
  title: 'Untitled',
  style,
} as const;
