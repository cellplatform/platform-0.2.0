import { PropList, type t } from './common';
import { Field } from './field';
import { Wrangle } from './u';
import { useDocuments } from './use.Documents';

type P = t.InfoProps;

/**
 * Component
 */
export const View: React.FC<P> = (props) => {
  const { data = {} } = props;
  const ctx = Wrangle.ctx(props);
  const documents = useDocuments(props.data, props.repos);

  const items = PropList.builder<t.InfoField>()
    .field('Visible', () => Field.visible(data.visible, props.onVisibleToggle))
    .field('Module', () => Field.module(ctx))
    .field('Module.Verify', () => Field.moduleVerify(ctx))
    .field('Repo', () => Field.repo(ctx, data.repo))
    .field('Component', () => Field.component(ctx, data.component))
    .field('Doc', () => Field.document(ctx, documents, data.document))
    .items(ctx.fields);

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
