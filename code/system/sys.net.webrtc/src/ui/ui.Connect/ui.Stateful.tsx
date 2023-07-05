import { type t } from './common';
import { Connect } from './ui.Connect';
import { useController } from './useController.mjs';

export const Stateful: React.FC<t.ConnectStatefulProps> = (props) => {
  const { self, onChange } = props;
  const controller = useController({ self, onChange });
  return (
    <Connect
      client={controller.client}
      info={controller.info}
      fields={props.fields}
      edge={props.edge}
      card={props.card}
      copiedMessage={controller.copied?.message}
      style={props.style}
    />
  );
};
