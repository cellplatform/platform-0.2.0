import { ModuleLoader, type t } from './common';

/**
 * A factory for code-split (dynamicly loaded) ESM module.
 */
export const factory = ModuleLoader.factory<t.SampleName, t.SampleFactoryCtx>(async (e) => {
  const { store, docuri, accessToken, peerid } = e.ctx;

  if (e.name === 'CodeEditor') {
    const { CodeEditorLoader } = await import('./ui.CodeEditor'); // NB: dynamic code-splitting here.
    return <CodeEditorLoader store={store} docuri={docuri} />;
  }

  if (e.name === 'CodeEditor.AI') {
    const { CodeEditorAI } = await import('./ui.CodeEditor.AI');
    return <CodeEditorAI store={store} docuri={docuri} accessToken={accessToken} />;
  }

  if (e.name === 'Deno.Deploy') {
    const { DenoDeploy } = await import('./ui.Deno');
    return <DenoDeploy store={store} docuri={docuri} accessToken={accessToken} />;
  }

  if (e.name === 'ImageCrdt') {
    const { ImageCrdt } = await import('./ui.ImageCrdt');
    return <ImageCrdt store={store} docuri={docuri} />;
  }

  if (e.name === 'AutomergeInfo') {
    const { AutomergeInfo } = await import('./ui.Automerge.Info');
    return <AutomergeInfo store={store} docuri={docuri} />;
  }

  if (e.name === 'CmdBar') {
    const { CmdBarLoader } = await import('./ui.CmdBar');
    return <CmdBarLoader store={store} docuri={docuri} />;
  }

  return null;
});
