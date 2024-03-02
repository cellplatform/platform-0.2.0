import { Dev, type t } from '../../../test.ui';
import { Sample } from 'ext.lib.deno';

export type DenoDeployProps = {
  store: t.Store;
  docuri: string;
  accessToken?: string;
  style?: t.CssValue;
};

export const DenoDeploy: React.FC<DenoDeployProps> = (props) => {
  const { store, docuri, accessToken } = props;
  return <Dev.Harness spec={Sample.spec} env={{ store, docuri, accessToken }} />;
};
