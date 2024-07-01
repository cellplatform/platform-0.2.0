import { DEFAULTS, PropList, type t } from './common';
import { Field } from './field';

export const View: React.FC<t.InfoProps> = (props) => {
  const { data = {} } = props;
  const ctx = wrangle.ctx(props);

  const items = PropList.builder<t.InfoField>()
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

/**
 * Helpers
 */
const wrangle = {
  ctx(props: t.InfoProps): t.InfoFieldCtx {
    const { theme = DEFAULTS.theme } = props;
    const fields = PropList.fields(props.fields, DEFAULTS.fields.default);
    return { fields, theme };
  },
} as const;
