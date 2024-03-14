import { Dev, type t } from '../../test.ui';
import { Sample } from 'ext.lib.ai.faceapi';

export type FaceProps = {
  stream?: MediaStream;
  style?: t.CssValue;
};

export const Face: React.FC<FaceProps> = (props) => {
  const { stream } = props;
  return <Dev.Harness spec={Sample.spec} env={{}} />;
};
