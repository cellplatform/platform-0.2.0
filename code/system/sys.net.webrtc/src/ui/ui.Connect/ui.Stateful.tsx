import { type t } from './common';
import { Connect } from './ui.Connect';
import { useController } from './useController.mjs';
import { usePeer } from './usePeer.mjs';

export const Stateful: React.FC<t.ConnectStatefulProps> = (props) => {
  const { onChange } = props;
  const self = usePeer(props.self);
  const controller = useController({ self, onChange });
  return (
    <Connect
      client={controller.client}
      info={controller.info}
      loading={controller.loading}
      fields={props.fields}
      edge={props.edge}
      innerCard={props.innerCard}
      copiedMessage={controller.copied?.message}
      style={props.style}
      margin={props.margin}
    />
  );
};
