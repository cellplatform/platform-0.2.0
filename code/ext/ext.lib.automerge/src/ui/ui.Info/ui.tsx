import { PropList, type t } from './common';
import { Field } from './field';
import { useStateful } from './use.Stateful';

/**
 * Component
 */
export const View: React.FC<t.InfoProps> = (props) => {
  const { theme } = props;
  const { fields, data } = useStateful(props);

  const items = PropList.builder<t.InfoField>()
    .field('Visible', () => Field.visible(data.visible, theme))
    .field('Module', () => Field.module())
    .field('Module.Verify', () => Field.moduleVerify(theme))
    .field('Repo', () => Field.repo(data.repo, theme))
    .field('Component', () => Field.component(data.component))
    .field('Doc', () => Field.document(data.document, fields, theme))
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
