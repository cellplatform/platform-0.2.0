import { Sample } from 'ext.lib.ai.openai';
import { Dev, type t } from '../../test.ui';

export type CodeEditorAIProps = {
  store: t.Store;
  docuri: string;
  accessToken?: string;
  style?: t.CssValue;
};

export const CodeEditorAI: React.FC<CodeEditorAIProps> = (props) => {
  const { store, docuri, accessToken } = props;
  const env = { store, docuri, accessToken };
  return <Dev.Harness spec={Sample.spec} env={env} />;
};
