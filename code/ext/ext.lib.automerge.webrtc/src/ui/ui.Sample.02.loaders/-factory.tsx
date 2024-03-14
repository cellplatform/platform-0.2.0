import { ModuleLoader, type t } from './common';

/**
 * A factory for code-split (dynamicly loaded) ESM module.
 */
export const factory = ModuleLoader.factory<t.SampleName, t.SampleFactoryCtx>(async (e) => {
  const { store, docuri, accessToken } = e.ctx;

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

  if (e.name === 'DiagramEditor') {
    // @ts-ignore
    await import('@tldraw/tldraw/tldraw.css');
    const { Canvas } = await import('ext.lib.tldraw');
    return <Canvas style={{ opacity: 0.9 }} />;
  }

  if (e.name === 'ModuleNamespace') {
    const { ModuleNamespace } = await import('sys.ui.react.common');
    return <ModuleNamespace />;
  }

  if (e.name === 'FaceAPI') {
    const { Face } = await import('./ui.Face');
    return <Face stream={e.ctx.stream} />;
  }

  if (e.name === 'ImageCrdt') {
    const { ImageCrdt } = await import('./ui.ImageCrdt');
    return <ImageCrdt store={store} docuri={docuri} />;
  }

  return null;
});
