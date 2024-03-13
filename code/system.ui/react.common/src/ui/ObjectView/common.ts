export * from '../common';
import { Value, type t } from '../common';

/**
 * Constants
 */

const theme: t.CommonTheme = 'Light';

const formatter: t.ObjectViewFormatter = (data) => {
  Value.Object.walk(data, (e) => {
    // NB: Ensure large binary objects don't (💥) the component on render.
    if (!(e.value instanceof Uint8Array)) return;
    const bytes = e.value.byteLength.toLocaleString();
    const text = `<Uint8Array>[${bytes}]`;
    (e.parent as any)[e.key] = text;
  });
  return data;
};

export const DEFAULTS = {
  theme,
  formatter,
  font: { size: 12 },
  showRootSummary: true,
  showNonenumerable: false,
} as const;
