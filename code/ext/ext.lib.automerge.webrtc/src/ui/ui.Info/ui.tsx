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
    .field('Network.Shared', () => Field.network.shared(data, fields, shared?.doc, theme))
    .field('Network.Transfer', () => Field.network.transfer(bytes, isTransmitting, theme))
    .items(fields);

  return (
    <PropList
      title={Wrangle.title(props)}
      items={items}
      width={props.width ?? { min: 230 }}
      defaults={{ clipboard: false }}
      card={props.card}
      flipped={props.flipped}
      padding={props.card ? [20, 25, 30, 25] : undefined}
      margin={props.margin}
      theme={theme}
      style={props.style}
    />
  );
};

/**
 * Helpers
 */
const Wrangle = {
  title(props: t.InfoProps) {
    const title = PropList.Wrangle.title(props.title);
    if (!title.margin && props.card) title.margin = [0, 0, 15, 0];
    return title;
  },
} as const;
