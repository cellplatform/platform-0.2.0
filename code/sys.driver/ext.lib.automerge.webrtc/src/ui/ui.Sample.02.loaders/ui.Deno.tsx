import { Specs } from 'ext.lib.deno';
import { Dev, type t } from '../../test.ui';

export type DenoDeployProps = {
  store: t.Store;
  docuri: string;
  accessToken?: string;
  style?: t.CssValue;
};

export const DenoDeploy: React.FC<DenoDeployProps> = (props) => {
  const { store, docuri, accessToken } = props;
  const spec = Dev.find(Specs, (key) => key.includes('.Sample.01')).spec;
  return <Dev.Harness spec={spec} env={{ store, docuri, accessToken }} />;
};
