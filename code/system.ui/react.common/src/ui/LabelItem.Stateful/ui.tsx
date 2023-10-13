import { LabelItem } from '../LabelItem/Root';
import { DEFAULTS, type t } from './common';
import { useItemController } from './use';

/**
 * Sample of using the behavior controller hooks.
 */
export const View: React.FC<t.LabelItemStatefulProps> = (props) => {
  const {
    index,
    total,
    list,
    item,
    onChange,
    useBehaviors = DEFAULTS.useBehaviors.defaults,
  } = props;
  const isSelected = item && list && item.instance === list.current.selected;
  const isFocused = isSelected && list?.current.focused;

  /**
   * Roll-up controller.
   */
  const controller = useItemController({
    index,
    total,
    item,
    list,
    onChange,
    useBehaviors,
  });

  /**
   * Render
   */
  return (
    <LabelItem
      {...controller.handlers}
      id={item?.instance}
      index={props.index}
      total={props.total}
      renderers={props.renderers}
      item={controller.current}
      selected={isSelected}
      focused={isFocused}
      focusOnEdit={true}
      renderCount={props.renderCount}
      debug={props.debug}
      style={props.style}
    />
  );
};
