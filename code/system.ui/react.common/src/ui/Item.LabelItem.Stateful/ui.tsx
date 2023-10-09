import { LabelItem } from '../Item.LabelItem/Root';
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

  const { data, handlers } = controller;

  /**
   * Render
   */
  return (
    <LabelItem
      {...handlers}
      style={props.style}
      index={props.index}
      total={props.total}
      item={data}
      selected={isSelected}
      focused={isFocused}
      focusOnEdit={true}
      renderCount={props.renderCount}
      debug={props.debug}
    />
  );
};
