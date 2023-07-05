import { type t } from './common';
import { Connect } from './ui.Connect';
import { useController } from './useController.mjs';

export const ConnectStateful: React.FC<t.ConnectStatefulProps> = (props) => {
  const { self, onChange } = props;
  const controller = useController({ self, onChange });
  return (
    <Connect
      client={controller.client}
      info={controller.info}
      copiedMessage={controller.copiedMessage}
      edge={props.edge}
      card={props.card}
      style={props.style}
    />
  );
};
