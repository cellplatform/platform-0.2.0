import { Dev, type t } from '../../../test.ui';
import { Sample } from 'ext.lib.openai';

export type CodeEditorAIProps = {
  store: t.Store;
  docuri: string;
  style?: t.CssValue;
};

export const CodeEditorAI: React.FC<CodeEditorAIProps> = (props) => {
  return <Dev.Harness spec={Sample.spec} />;
};
