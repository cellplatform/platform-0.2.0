import { Switch } from '../../Button.Switch';
import { css, type t } from './common';

export type SwitchValueProps = {
  value: t.PropListValue;
  onClick: () => void;
};

export const SwitchValue: React.FC<SwitchValueProps> = (props) => {
  const item = props.value as t.PropListValueSwitch;
  if (item.kind !== 'Switch') return null;

  const styles = {
    base: css({ marginTop: 1 }),
  };

  const value = item.data;
  const isEnabled = typeof item.enabled === 'boolean' ? item.enabled : value !== undefined;
  return (
    <Switch
      height={12}
      value={value}
      isEnabled={isEnabled}
      onMouseDown={props.onClick}
      style={styles.base}
    />
  );
};
