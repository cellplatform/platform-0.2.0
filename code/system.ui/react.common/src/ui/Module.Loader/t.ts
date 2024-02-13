import type { t } from './common';

type RenderOutput = JSX.Element | null | false;

export type ModuleLoaderTheme = 'Light' | 'Dark';

/**
 * <Component>
 */
export type ModuleLoaderProps = {
  flipped?: boolean;
  spinning?: boolean;
  spinner?: ModuleLoaderSpinner;
  theme?: ModuleLoaderTheme;
  front?: { element: RenderOutput };
  back?: { element: RenderOutput };
  style?: t.CssValue;
  onError?: ModuleLoaderErrorHandler;
};

/**
 * <Component> ← Stateful
 */
export type ModuleLoaderStatefulProps = Omit<t.ModuleLoaderProps, 'front' | 'back' | 'spinning'> & {
  factory?: ModuleLoaderFactory | ModuleLoaderFactoryProps | null;
};

export type ModuleLoaderFactory = (e: ModuleLoaderRenderArgs) => ModuleLoaderFactoryRes;
export type ModuleLoaderFactoryRes = RenderOutput | Promise<RenderOutput>;
export type ModuleLoaderFactoryProps = { front?: ModuleLoaderFactory; back?: ModuleLoaderFactory };
export type ModuleLoaderRenderArgs = { theme: ModuleLoaderTheme };

/**
 * Spinner configuation
 */
export type ModuleLoaderSpinner = {
  bodyOpacity?: t.Percent;
  bodyBlur?: t.Pixels;
  element?: RenderOutput | ((e: ModuleLoaderRenderArgs) => RenderOutput); // Custom spinning renderer.
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
