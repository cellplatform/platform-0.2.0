import { FC, Switch, t } from '../common';
import { Button } from '../DevTools.Button';

const DEFAULT = { ...Button.DEFAULT, value: false };

export type TextboxProps = {
  isEnabled?: boolean;
  label?: string | JSX.Element;
  value?: boolean;

  style?: t.CssValue;
  labelOpacity?: number;
  onClick?: React.MouseEventHandler;
};

const View: React.FC<TextboxProps> = (props) => {
  const { value = DEFAULT.value } = props;
  const isActive = Wrangle.isActive(props);

  /**
   * Handlers
   */
  const handleClick: React.MouseEventHandler = (e) => {
    if (isActive) {
      e.preventDefault();
      props.onClick?.(e);
    }
  };

  /**
   * [Render]
   */
  const elRight = (
    <Switch
      value={value}
      isEnabled={isActive}
      height={16}
      onMouseDown={(e) => e.preventDefault()}
    />
  );

  return (
    <Button
      {...props}
      style={props.style}
      enabled={isActive}
      rightElement={elRight}
      onClick={handleClick}
    />
  );
};

/**
 * [Helpers]
 */

const Wrangle = {
  isActive(props: TextboxProps): boolean {
    const { isEnabled = DEFAULT.enabled } = props;
    if (!isEnabled) return false;
    if (!props.onClick) return false;
    return true;
  },
};

/**
 * Export
 */
type Fields = {
  DEFAULT: typeof DEFAULT;
  isActive: typeof Wrangle.isActive;
};
export const Textbox = FC.decorate<TextboxProps, Fields>(
  View,
  { DEFAULT, isActive: Wrangle.isActive },
  { displayName: 'Textbox' },
);
