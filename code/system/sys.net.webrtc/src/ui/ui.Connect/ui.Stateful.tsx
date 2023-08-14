import { type t } from './common';
import { Connect } from './ui.Connect';
import { useController, usePeer } from './use.mjs';

export const Stateful: React.FC<t.ConnectStatefulProps> = (props) => {
  const self = usePeer(props.self);
  const controller = useController({
    self,
    showInfo: props.showInfo,
    onChange: props.onChange,
    onReady: props.onReady,
  });

  return (
    <Connect
      // Stateful
      client={controller.client}
      info={controller.info}
      loading={controller.loading}
      fields={props.fields}
      showInfo={controller.showInfo}
      onInfoToggle={controller.onToggleInfo}
      //
      // Props
      edge={props.edge}
      showInfoToggle={props.showInfoToggle}
      showInfoAsCard={props.showInfoAsCard}
      copiedMessage={controller.copied?.message}
      style={props.style}
      margin={props.margin}
    />
  );
};
