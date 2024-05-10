import { t, COLORS } from '../common';

const style: Required<t.DevTodoStyle> = {
  color: COLORS.DARK,
  margin: [6, 0, 6, 0],
};

export const DEFAULT = { style } as const;
