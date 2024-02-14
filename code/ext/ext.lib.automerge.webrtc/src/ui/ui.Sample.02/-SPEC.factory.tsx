import { ModuleLoader, type t } from './common';

/**
 * A factory for code-split (dynamicly loaded) ESM module.
 */
export const loader = ModuleLoader.factory<t.SampleTypename, t.SampleFactoryCtx>(async (e) => {
  const { store, docuri } = e.ctx;

  if (e.name === 'Auth') {
    const { AuthLoader } = await import('./-loaders/Auth');
    return <AuthLoader store={store} docuri={docuri} />;
  }

  if (e.name === 'CodeEditor') {
    const { CodeEditorLoader } = await import('./-loaders/CodeEditor'); // NB: dynamic code-splitting here.
    return <CodeEditorLoader store={store} docuri={docuri} />;
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

  return null;
});
