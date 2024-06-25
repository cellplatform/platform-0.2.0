import { DEFAULTS, PropList, type t } from './common';

export type ConnectorConfigHandler = (e: ConnectorConfigHandlerArgs) => void;
export type ConnectorConfigHandlerArgs = {
  previous?: t.ConnectorBehavior[];
  next?: t.ConnectorBehavior[];
};

export type ConnectorConfigProps = {
  title?: string;
  selected?: t.ConnectorBehavior[];
  style?: t.CssValue;
  onClick?: t.PropListFieldSelectorClickHandler;
  onChange?: ConnectorConfigHandler;
};

export const ConnectorConfig: React.FC<ConnectorConfigProps> = (props) => {
  const { title = 'Behaviors' } = props;
  return (
    <PropList.FieldSelector
      style={props.style}
      title={title}
      all={DEFAULTS.behaviors.all}
      defaults={DEFAULTS.behaviors.default}
      selected={props.selected}
      indent={20}
      indexes={false}
      resettable={true}
      onClick={(e) => {
        const { value } = e.as<t.ConnectorBehavior>();
        props.onChange?.(value);
        props.onClick?.(e);
      }}
    />
  );
};
