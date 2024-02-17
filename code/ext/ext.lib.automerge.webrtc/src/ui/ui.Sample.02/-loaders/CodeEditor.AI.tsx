import { Dev, type t } from '../../../test.ui';
import spec from '../../ui.Sample.AI/-SPEC';

export type CodeEditorAIProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const CodeEditorAI: React.FC<CodeEditorAIProps> = (props) => {
  return <Dev.Harness spec={spec} />;
};
