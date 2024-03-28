import { Dev, type t } from '../../test.ui';
import { Specs } from 'sys.ui.react.common';

export type CmdBarLoaderProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const CmdBarLoader: React.FC<CmdBarLoaderProps> = (props) => {
  const { store, docuri } = props;
  const spec = Specs['sys.ui.react.common.Command.Bar'];
  return <Dev.Harness spec={spec} env={{ store, docuri }} />;
};
