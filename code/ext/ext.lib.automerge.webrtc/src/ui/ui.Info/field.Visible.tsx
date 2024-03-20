import { type t } from './common';

export function visible(data: t.InfoData, theme?: t.CommonTheme): t.PropListItem {
  const enabled = data.visible ? data.visible.enabled ?? true : false;
  const selected = data.visible?.value ?? false;
  return {
    label: data.visible?.label ?? 'Visible',
    value: {
      kind: 'Switch',
      enabled,
      data: selected,
      onClick: () => data.visible?.onToggle?.(selected),
    },
  };
}
