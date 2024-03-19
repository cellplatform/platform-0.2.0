import { Dev, type t } from '../../test.ui';
import { Specs } from 'ext.lib.automerge';

export type AutomergeInfoProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const AutomergeInfo: React.FC<AutomergeInfoProps> = (props) => {
  const { store, docuri } = props;
  const spec = Specs['ext.lib.automerge.ui.Info'];
  return <Dev.Harness spec={spec} env={{ store, docuri }} />;
};
