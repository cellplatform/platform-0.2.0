import { t } from '../common';

export const Wrangle = {
  componentSize(value?: t.SpecRenderSize) {
    let width: number | undefined;
    let height: number | undefined;

    if (!value) return { width, height };
    if (value.mode === 'fill') return { width, height };

    width = value.width;
    height = value.height;
    return { width, height };
  },

  fillMargin(value?: t.SpecRenderSize) {
    const DEFAULT = 40;
    if (!value) return Wrangle.asMargin(DEFAULT);
    if (value.mode !== 'fill') return Wrangle.asMargin(DEFAULT);
    return value.margin;
  },

  asMargin(value: number): [number, number, number, number] {
    return [value, value, value, value];
  },
};
