import type { t } from './common';

export type * from '../common/t';
export type * from '../ui.Sample.02/t';

/**
 * Dynamic Loader (factory)
 */
export type SampleName =
  | 'CodeEditor'
  | 'CodeEditor.AI'
  | 'DiagramEditor'
  | 'Deno.Deploy'
  | 'ModuleNamespace'
  | 'FaceAPI'
  | 'ImageCrdt'
  | 'AutomergeInfo';

export type SampleFactoryCtx = {
  docuri: string;
  store: t.Store;
  accessToken?: string;
  stream?: MediaStream;
};
