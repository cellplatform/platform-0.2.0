import { DEFAULTS, PropList, type t } from './common';

export type RepoListConfigHandler = (e: RepoListConfigHandlerArgs) => void;
export type RepoListConfigHandlerArgs = {
  previous?: t.RepoListBehaviorKind[];
  next?: t.RepoListBehaviorKind[];
};

export type RepoListConfigProps = {
  title?: string;
  selected?: t.RepoListBehaviorKind[];
  style?: t.CssValue;
  onClick?: t.PropListFieldSelectorClickHandler;
  onChange?: RepoListConfigHandler;
};

export const RepoListConfig: React.FC<RepoListConfigProps> = (props) => {
  const { title = 'Behaviors' } = props;
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
        const { previous, next } = e.as<t.RepoListBehaviorKind>();
        props.onChange?.({ previous, next });
        props.onClick?.(e);
      }}
    />
  );
};
