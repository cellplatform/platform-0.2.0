import { DEFAULTS, PropList, type t } from './common';
import { Field } from './field';

type F = t.InfoField;
const DEF = DEFAULTS.props;

export const View: React.FC<t.InfoProps> = (props) => {
  const { data = {}, theme = DEF.theme, enabled = DEF.enabled } = props;
  const fields = PropList.fields<F>(props.fields, DEF.fields);
  const ctx: t.InfoCtx = { fields, theme, enabled };

  const items = PropList.builder<F>()
    .field('Module', () => Field.module(ctx))
    .field('Module.Verify', () => Field.moduleVerify(ctx))
    .field('Component', () => Field.component(ctx, data.component))
    .items(ctx.fields);

  return (
    <PropList
      title={PropList.Info.title(props)}
      items={items}
      width={PropList.Info.width(props)}
      theme={ctx.theme}
      margin={props.margin}
      style={props.style}
    />
  );
};
