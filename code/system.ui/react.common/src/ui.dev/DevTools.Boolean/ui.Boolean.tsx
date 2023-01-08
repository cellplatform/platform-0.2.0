import { Color, COLORS, css, t, rx, Switch, FC } from '../common';
import { Button } from '../DevTools.Button';

const DEFAULT = { ...Button.DEFAULT, value: false };

export type BooleanClickHandler = (e: BooleanClickHandlerArgs) => void;
export type BooleanClickHandlerArgs = { prev: boolean; next: boolean };

export type BooleanProps = {
  isEnabled?: boolean;
  label?: string | JSX.Element;
  value?: boolean;

  style?: t.CssValue;
  labelOpacity?: number;
  onClick?: BooleanClickHandler;
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
      const prev = value;
      const next = !value;
      props.onClick?.({ prev, next });
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
      isEnabled={isActive}
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
    const { isEnabled = DEFAULT.isEnabled } = props;
    if (!isEnabled) return false;
    if (!props.onClick) return false;
    return true;
  },
};

/**
 * Export
 */
type Fields = {
  isActive: typeof Wrangle.isActive;
};
export const Boolean = FC.decorate<BooleanProps, Fields>(
  View,
  { isActive: Wrangle.isActive },
  { displayName: 'Button' },
);
