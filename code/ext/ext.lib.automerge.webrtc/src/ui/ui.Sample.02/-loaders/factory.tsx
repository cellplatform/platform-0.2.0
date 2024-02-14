import { ModuleLoader, type t } from '../common';

type TName = t.SampleFactoryTypename;

/**
 * A factory for code-split (dynamicly loaded) ESM module.
 */
export const loadFactory: t.LoadFactory<TName> = async (e) => {
  const { typename, store, docuri, shared } = e;

  const loader = ModuleLoader.factory<TName>(async (e) => {
    if (e.name === 'Auth') {
      const { AuthLoader } = await import('./Auth');
      return <AuthLoader store={store} docuri={docuri} />;
    }

    if (e.name === 'CodeEditor') {
      const { CodeEditorLoader } = await import('./CodeEditor'); // NB: dynamic code-splitting here.
      return <CodeEditorLoader store={store} docuri={docuri} />;
    }

    if (e.name === 'DiagramEditor') {
      // @ts-ignore
      await import('@tldraw/tldraw/tldraw.css');
      const { Canvas } = await import('ext.lib.tldraw');
      return <Canvas style={{ opacity: 0.9 }} />;
    }

    if (e.name === 'CmdHost') {
      const { CmdHostLoader } = await import('./CmdHost');
      return <CmdHostLoader store={store} shared={shared} factory={loadFactory} />;
    }

    if (e.name === 'ModuleNamespace') {
      const { ModuleNamespace } = await import('sys.ui.react.common');
      return <ModuleNamespace />;
    }

    return null;
  });

  return loader.render(typename);
};
