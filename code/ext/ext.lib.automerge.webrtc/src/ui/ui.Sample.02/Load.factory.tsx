import { type t } from './common';

/**
 * A factory for code-split (dynamicly loaded) ESM module.
 */
export const loadFactory: t.LoadFactory = async (e) => {
  const { typename, docuri, store } = e;

  if (typename === 'CodeEditor') {
    const { CodeEditorLoader } = await import('./Load.CodeEditor'); // NB: dynamic code-splitting here.
    return <CodeEditorLoader store={store} docuri={docuri} />;
  }

  if (typename === 'DiagramEditor') {
    // @ts-ignore
    await import('@tldraw/tldraw/tldraw.css');
    const { Canvas } = await import('ext.lib.tldraw');
    return <Canvas style={{ opacity: 0.9 }} />;
  }

  if (typename === 'Auth') {
    const { AuthLoader } = await import('./Load.Auth');
    return <AuthLoader store={store} docuri={docuri} />;
  }

  return;
};
