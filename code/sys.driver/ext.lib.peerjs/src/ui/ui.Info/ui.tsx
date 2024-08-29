import { DEFAULTS, PropList, type t } from './common';
import { Field } from './field';
import { useRedraw } from './use.Redraw';

/**
 * Component
 */
export const View: React.FC<t.InfoProps> = (props) => {
  const { theme = DEFAULTS.theme, self, data = {} } = props;
  const fields = PropList.fields(props.fields, DEFAULTS.fields.default);

  const ctx: t.InfoCtx = { fields, theme };

  useRedraw(self);

  const items = PropList.builder<t.InfoField>()
    .field('Module', () => Field.module(ctx))
    .field('Module.Verify', () => Field.moduleVerify(ctx))
    .field('Component', () => Field.component(ctx, data.component))
    .field('Peer', () => Field.peer(ctx, self))
    .items(fields);

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
