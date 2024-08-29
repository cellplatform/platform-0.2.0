import { PropList, type t } from './common';
import { Field } from './field';
import { Wrangle } from './u';

type F = t.InfoField;

export const View: React.FC<t.InfoProps> = (props) => {
  const { data = {} } = props;
  const ctx = Wrangle.ctx(props);

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
