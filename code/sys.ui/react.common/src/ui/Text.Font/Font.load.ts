import { type t } from './common';
import { Util } from './u';

export async function load(font: t.FontDefinition | t.FontDefinition[]) {
  // Create fonts.
  const defs = Array.isArray(font) ? font : [font];

  const fonts = defs.map((font) => {
    const { family, descriptors } = font;
    const source = Util.formatSource(font.source);
    return new FontFace(family, source, descriptors);
  });

  // Load fonts.
  await Promise.all(fonts.map(async (font) => font.load()));
  fonts.forEach((font) => document.fonts.add(font));

  // Finish up.
  return fonts;
}
