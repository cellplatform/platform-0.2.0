import { TextboxSync } from 'sys.ui.react.common';
import { useDoc } from '../../ui/ui.use';
import { type t } from './common';

/**
 * <Layout>
 */
export type LayoutProps = {
  repo?: { store: t.Store; index: t.StoreIndexState };
  docuri?: string;
  path?: t.ObjectPath;
  theme?: t.CommonTheme;
  style?: t.CssValue;
};
export const Layout: React.FC<LayoutProps> = (props) => {
  const { repo, docuri } = props;

  const doc1 = useDoc(repo?.store, docuri).ref;
  const doc2 = useDoc(repo?.store, docuri).ref;

  return (
    <TextboxSync.Dev.Layout
      state={[doc1, doc2]}
      path={props.path}
      theme={props.theme}
      style={props.style}
    />
  );
};
