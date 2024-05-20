import { DEFAULTS, PropList, type t } from './common';

export type BehaviorSelectorHandler = (e: BehaviorSelectorHandlerArgs) => void;
export type BehaviorSelectorHandlerArgs = {
  prev?: t.LabelItemBehaviorKind[];
  next?: t.LabelItemBehaviorKind[];
};

export type BehaviorSelectorProps = {
  title?: string;
  selected?: t.LabelItemBehaviorKind[];
  style?: t.CssValue;
  onClick?: t.PropListFieldSelectorClickHandler;
  onChange?: BehaviorSelectorHandler;
};

export const BehaviorSelector: React.FC<BehaviorSelectorProps> = (props) => {
  const { title = 'Behavior Controllers' } = props;
  return (
    <PropList.FieldSelector
      style={props.style}
      title={title}
      all={DEFAULTS.behaviors.all}
      defaults={DEFAULTS.behaviors.defaults}
      selected={props.selected}
      indent={20}
      indexes={false}
      resettable={true}
      onClick={(e) => {
        const { value } = e.as<t.LabelItemBehaviorKind>();
        props.onChange?.(value);
        props.onClick?.(e);
      }}
    />
  );
};
