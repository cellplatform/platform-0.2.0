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
  const ctx = wrangle.ctx(props);

  useRedraw(props);
  const shared = useShared(data.network);
  const { bytes } = usePeerMonitor(data.network);
  const { isTransmitting } = useTransmitMonitor(bytes.total);

  const items = PropList.builder<t.InfoField>()
    .field('Visible', () => Field.visible(data.visible, theme))
    .field('Module', () => Field.module(ctx))
    .field('Module.Verify', () => Field.moduleVerify(ctx))
    .field('Component', () => Field.component(ctx, data.component))
    .field('Peer', () => Field.peer(ctx, data))
    .field('Repo', () => Field.repo(ctx, data))
    .field('Network.Shared', () => Field.network.shared(ctx, data, shared?.doc))
    .field('Network.Transfer', () => Field.network.transfer(ctx, bytes, isTransmitting))
    .items(ctx.fields);

  return (
    <PropList
      title={PropList.Info.title(props)}
      items={items}
      width={PropList.Info.width(props)}
      margin={props.margin}
      theme={theme}
      style={props.style}
    />
  );
};

/**
 * Helpers
 */
const wrangle = {
  ctx(props: t.InfoProps): t.InfoFieldCtx {
    const { theme = DEFAULTS.theme, stateful = DEFAULTS.stateful } = props;
    const fields = PropList.Wrangle.fields(props.fields, DEFAULTS.fields.default);
    return { theme, fields, stateful };
  },
} as const;
