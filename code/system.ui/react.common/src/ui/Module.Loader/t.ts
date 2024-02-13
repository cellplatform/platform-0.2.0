import type { t } from './common';

export type ModuleLoaderTheme = 'Light' | 'Dark';
export type ModuleLoaderFace = 'Front' | 'Back';

/**
 * <Component>
 */
export type ModuleLoaderProps = {
  flipped?: boolean;
  spinning?: boolean;
  spinner?: ModuleLoaderSpinner;
  theme?: ModuleLoaderTheme;
  front?: { element: t.RenderOutput };
  back?: { element: t.RenderOutput };
  style?: t.CssValue;
  onError?: ModuleLoaderErrorHandler;
};

/**
 * <Component> ← Stateful
 */
export type ModuleLoaderStatefulProps = Omit<t.ModuleLoaderProps, 'front' | 'back' | 'spinning'> & {
  name?: string;
  factory?: ModuleLoaderFactory<any> | null;
};

/**
 * Factory
 */
export type ModuleLoaderFactory<N extends string = string> = (
  e: ModuleLoaderFactoryArgs<N>,
) => ModuleLoaderFactoryRes;
export type ModuleLoaderFactoryArgs<N extends string = string> = {
  name: N;
  theme: ModuleLoaderTheme;
  face: ModuleLoaderFace;
  is: { front: boolean; back: boolean };
};
export type ModuleLoaderFactoryRes = Promise<t.RenderOutput>;

/**
 * Spinner configuation
 */
export type ModuleLoaderSpinner = {
  bodyOpacity?: t.Percent;
  bodyBlur?: t.Pixels;
  element?: t.RenderOutput | ((e: { theme: ModuleLoaderTheme }) => t.RenderOutput); // Custom spinning renderer.
};

/**
 * Events
 */
export type ModuleLoaderErrorHandler = (e: ModuleLoaderErrorHandlerArgs) => void;
export type ModuleLoaderErrorHandlerArgs = {
  error: any;
  clear(): void;
  closeable(): void;
};
