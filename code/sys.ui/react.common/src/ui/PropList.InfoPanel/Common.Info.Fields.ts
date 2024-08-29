import { type t } from './common';

export const CommonInfoFields = {
  visible(data?: t.InfoVisible, theme?: t.CommonTheme) {
    const enabled = data?.enabled ?? true;
    const selected = data?.value ?? false;
    return {
      label: data?.label ?? 'Visible',
      value: {
        kind: 'Switch',
        enabled,
        data: selected,
        onClick() {
          const args = { prev: selected, next: !selected };
          data?.onToggle?.(args);
        },
      },
    };
  },
} as const;
