import { Switch } from '../../Button.Switch';
import { Color, css, type t } from './common';

export type SwitchValueProps = {
  value: t.PropListValue;
  theme?: t.CommonTheme;
  isMouseOverItem?: boolean;
  isMouseOverValue?: boolean;
  isItemClickable?: boolean;
  isValueClickable?: boolean;
  onClick?: React.MouseEventHandler;
};

export const SwitchValue: React.FC<SwitchValueProps> = (props) => {
  const item = props.value as t.PropListValueSwitch;
  if (item.kind !== 'Switch') return null;

  const value = item.body;
  const enabled = typeof item.enabled === 'boolean' ? item.enabled : value !== undefined;
  const isDark = props.theme === 'Dark';
  const theme = isDark ? Switch.Theme.dark.blue : Switch.Theme.light.blue;
  const styles = { base: css({}) };

  return (
    <Switch
      height={12}
      value={value}
      enabled={enabled}
      track={Wrangle.track(item)}
      style={styles.base}
      theme={theme}
      onMouseDown={props.onClick}
    />
  );
};

/**
 * Helpers
 */
export const Wrangle = {
  track(item: t.PropListValueSwitch): Partial<t.SwitchTrack> | undefined {
    if (!item.color) return undefined;
    const color = {
      ...Switch.Theme.light.blue.trackColor,
      on: Color.format(item.color)!,
    };
    return { color };
  },
} as const;
