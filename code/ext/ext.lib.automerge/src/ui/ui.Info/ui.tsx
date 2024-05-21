import { DEFAULTS, PropList, type t } from './common';
import { Field } from './field';
import { useStateful } from './use.Stateful';

/**
 * Component
 */
export const View: React.FC<t.InfoProps> = (props) => {
  const { theme = DEFAULTS.theme } = props;
  const { fields, data } = useStateful(props);
  const ctx: t.InfoFieldCtx = { fields, theme };

  const items = PropList.builder<t.InfoField>()
    .field('Visible', () => Field.visible(data.visible, theme))
    .field('Module', () => Field.module(ctx))
    .field('Module.Verify', () => Field.moduleVerify(ctx))
    .field('Repo', () => Field.repo(data.repo, ctx))
    .field('Component', () => Field.component(data.component, ctx))
    .field('Doc', () => Field.document(data.document, ctx))
    .items(fields);

  return (
    <PropList
      title={PropList.Info.title(props)}
      items={items}
      width={PropList.Info.width(props)}
      defaults={{ clipboard: false }}
      theme={props.theme}
      margin={props.margin}
      style={props.style}
    />
  );
};
