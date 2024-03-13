export * from '../common';
import { Filesize, R, Value, type t } from '../common';

const formatter: t.ObjectViewFormatter = (data) => {
  data = R.clone(data);

  // NB: Ensure large binary objects don't (💥) the component on render.
  Value.Object.walk(data, (e) => {
    if (e.value instanceof Uint8Array) {
      const bytes = Filesize(e.value.byteLength);
      const text = `<Uint8Array>[${bytes}]`;
      (e.parent as any)[e.key] = text;
    }
  });

  return data;
};

/**
 * Constants
 */
const theme: t.CommonTheme = 'Light';

export const DEFAULTS = {
  theme,
  formatter,
  font: { size: 12 },
  showRootSummary: true,
  showNonenumerable: false,
} as const;
