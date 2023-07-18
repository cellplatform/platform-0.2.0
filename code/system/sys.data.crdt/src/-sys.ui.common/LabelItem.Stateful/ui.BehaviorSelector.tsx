import { DEFAULTS, PropList, type t } from './common';

export type BehaviorSelectorHandler = (e: BehaviorSelectorHandlerArgs) => void;
export type BehaviorSelectorHandlerArgs = {
  previous: t.LabelItemBehaviorKind[];
  next: t.LabelItemBehaviorKind[];
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
      all={DEFAULTS.useBehaviors.all}
      selected={props.selected}
      indexes={true}
      resettable={true}
      indent={20}
      onClick={(e) => {
        type K = t.LabelItemBehaviorKind;
        const previous = (e.previous ?? []) as K[];
        let next = (e.next ?? []) as K[];
        if (e.action === 'Reset') next = DEFAULTS.useBehaviors.default;
        props.onClick?.(e);
        props.onChange?.({ previous, next });
      }}
    />
  );
};
