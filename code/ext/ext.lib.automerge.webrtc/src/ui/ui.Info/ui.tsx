import {
  DEFAULTS,
  PropList,
  usePeerMonitor,
  useShared,
  useTransmitMonitor,
  type t,
} from './common';
import { Field } from './field';
import { useRedraw } from './use.Redraw';

/**
 * Component
 */
export const View: React.FC<t.InfoProps> = (props) => {
  const { theme, data = {} } = props;
  const fields = PropList.Wrangle.fields(props.fields, DEFAULTS.fields.default);

  useRedraw(data);
  const shared = useShared(data.network);
  const { bytes } = usePeerMonitor(data.network);
  const { isTransmitting } = useTransmitMonitor(bytes.total);

  const items = PropList.builder<t.InfoField>()
    .field('Visible', () => Field.visible(data.visible, theme))
    .field('Module', () => Field.module(theme))
    .field('Module.Verify', () => Field.moduleVerify(theme))
    .field('Component', () => Field.component(data.component, theme))
    .field('Peer', () => Field.peer(data, fields, theme))
    .field('Repo', () => Field.repo(data, fields, theme))
    .field('Network.Shared', () => Field.network.shared(data, shared?.doc, theme))
    .field('Network.Transfer', () => Field.network.transfer(bytes, isTransmitting, theme))
    .items(fields);

  return (
    <PropList
      title={PropList.Info.title(props)}
      items={items}
      width={PropList.Info.width(props)}
      defaults={{ clipboard: false }}
      margin={props.margin}
      theme={theme}
      style={props.style}
    />
  );
};
