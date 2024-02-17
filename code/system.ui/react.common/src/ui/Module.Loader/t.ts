import type { t } from './common';
export type * from './t.factory';

type O = Record<string, unknown>;

/**
 * <Component>
 */
export type ModuleLoaderProps = {
  spinning?: boolean;
  spinner?: ModuleLoaderSpinner | null;
  theme?: t.CommonTheme;
  element?: t.RenderOutput;
  style?: t.CssValue;
  onError?: ModuleLoaderErrorHandler;
  onErrorCleared?: ModuleLoaderErrorClearedHandler;
};

/**
 * <Component> ← Stateful
 */
export type ModuleLoaderStatefulProps = Omit<t.ModuleLoaderProps, 'front' | 'back' | 'spinning'> & {
  name?: string; // NB: passed to the factory.
  ctx?: O;
  factory?: t.ModuleFactory<any> | null;
};

/**
 * Spinner configuation
 */
export type ModuleLoaderSpinner = {
  bodyOpacity?: t.Percent;
  bodyBlur?: t.Pixels;
  element?: t.RenderOutput | ((e: { theme: t.CommonTheme }) => t.RenderOutput); // Custom spinning renderer.
};

/**
 * Events
 */
export type ModuleLoaderErrorHandler = (e: ModuleLoaderErrorHandlerArgs) => void;
export type ModuleLoaderErrorHandlerArgs = {
  readonly error: any;
  clear(): void;
  closeable(): void;
};

export type ModuleLoaderErrorClearedHandler = (e: ModuleLoaderErrorClearedHandlerArgs) => void;
export type ModuleLoaderErrorClearedHandlerArgs = { readonly error: any };
