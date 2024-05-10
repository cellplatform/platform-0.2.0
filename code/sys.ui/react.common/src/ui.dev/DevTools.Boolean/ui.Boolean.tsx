import { FC, Switch, type t } from '../common';
import { Button } from '../DevTools.Button';

const DEFAULT = { ...Button.DEFAULT, value: false };

export type BooleanProps = {
  isEnabled?: boolean;
  label?: string | JSX.Element;
  value?: boolean;

  style?: t.CssValue;
  labelOpacity?: number;
  onClick?: React.MouseEventHandler;
};

const View: React.FC<BooleanProps> = (props) => {
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
      enabled={isActive}
      height={16}
      theme={Switch.Theme.light.blue}
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
  isActive(props: BooleanProps): boolean {
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
export const Boolean = FC.decorate<BooleanProps, Fields>(
  View,
  { DEFAULT, isActive: Wrangle.isActive },
  { displayName: 'Button.Boolean' },
);
