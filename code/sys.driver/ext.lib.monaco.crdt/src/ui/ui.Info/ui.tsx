import { DEFAULTS, PropList, type t } from './common';
import { Field } from './field';
import { Wrangle } from './u';

const DEF = DEFAULTS.props;

/**
 * Component
 */
export const View: React.FC<t.InfoProps> = (props) => {
  const { data = {}, enabled = DEF.enabled, theme = DEF.theme } = props;
  const ctx = Wrangle.ctx(props);

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
      enabled={enabled}
      margin={props.margin}
      theme={theme}
      style={props.style}
    />
  );
};
