import { type t } from './common';
import { Connect } from './ui.Connect';
import { useController, usePeer } from './use.mjs';

export const Stateful: React.FC<t.ConnectStatefulProps> = (props) => {
  const { onReady, onChange } = props;

  const self = usePeer(props.self);
  const controller = useController({ self, onChange, onReady });

  return (
    <Connect
      client={controller.client}
      info={controller.info}
      loading={controller.loading}
      fields={props.fields}
      edge={props.edge}
      showInfoAsCard={props.showInfoAsCard}
      showInfo={props.showInfo}
      copiedMessage={controller.copied?.message}
      style={props.style}
      margin={props.margin}
    />
  );
};
