import { DEFAULTS, PropList, type t } from './common';
import { Field } from './field';
import { useStateful } from './use.Stateful';

/**
 * Component
 */
export const View: React.FC<t.InfoProps> = (props) => {
  const { theme = DEFAULTS.props.theme } = props;
  const { fields, data } = useStateful(props);
  const ctx: t.InfoFieldCtx = { fields, theme };

  const items = PropList.builder<t.InfoField>()
    .field('Visible', () => Field.visible(data.visible, theme))
    .field('Module', () => Field.module(ctx))
    .field('Module.Verify', () => Field.moduleVerify(ctx))
    .field('Repo', () => Field.repo(ctx, data.repo))
    .field('Component', () => Field.component(ctx, data.component))
    .field('Doc', () => Field.document(ctx, data.document))
    .items(fields);

  return (
    <PropList
      title={PropList.Info.title(props)}
      items={items}
      width={PropList.Info.width(props)}
      theme={props.theme}
      margin={props.margin}
      style={props.style}
    />
  );
};
