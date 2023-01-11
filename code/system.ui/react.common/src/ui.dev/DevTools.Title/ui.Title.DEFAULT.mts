import { t, COLORS } from '../common';

const style: Required<t.DevTitleStyle> = {
  color: COLORS.DARK,
  margin: [0, 0, 6, 0],
  bold: true,
  ellipsis: true,
};

export const DEFAULT = {
  title: 'Untitled',
  style,
};
