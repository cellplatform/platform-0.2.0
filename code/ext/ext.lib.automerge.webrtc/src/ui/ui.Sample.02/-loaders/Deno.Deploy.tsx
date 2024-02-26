import { Dev, type t } from '../../../test.ui';
import { Sample } from 'ext.lib.deno';

export type DenoDeployProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const DenoDeploy: React.FC<DenoDeployProps> = (props) => {
  return <Dev.Harness spec={Sample.spec} />;
};
