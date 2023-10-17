import { LabelItem } from '../LabelItem/Root';
import { DEFAULTS, type t } from './common';
import { useItemController } from './use';
import { Wrangle } from './Wrangle';

/**
 * Sample of using the behavior controller hooks.
 */
export const View: React.FC<t.LabelItemStatefulProps> = (props) => {
  const { index, total, list, item, useBehaviors = DEFAULTS.useBehaviors.defaults } = props;
  const handlers = Wrangle.pluckHandlers(props);

  const isSelected = item && list && list.current.selected === item.instance;
  const isEditing = item && list && list.current.editing === item.instance;
  const isFocused = isSelected && list?.current.focused;

  /**
   * Roll-up controller.
   */
  const controller = useItemController({ index, total, list, item, useBehaviors, handlers });

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
      focused={isFocused}
      selected={isSelected}
      editing={isEditing}
      focusOnEdit={true}
      renderCount={props.renderCount}
      debug={props.debug}
      style={props.style}
    />
  );
};
