import type { t } from './common';

type B = boolean;
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
  onErrorCleared?: ModuleLoaderErrorClearedHandler;
};

/**
 * <Component> ← Stateful
 */
export type ModuleLoaderStatefulProps = Omit<t.ModuleLoaderProps, 'front' | 'back' | 'spinning'> & {
  name?: string; // NB: passed to the factory.
  factory?: ModuleLoaderFactory<any> | null;
};

/**
 * Factory
 */
export type ModuleLoaderFactory<N extends string = string> = (
  e: ModuleLoaderFactoryArgs<N>,
) => ModuleLoaderFactoryResponse;
export type ModuleLoaderFactoryArgs<N extends string = string> = {
  readonly name: N;
  readonly theme: ModuleLoaderTheme;
  readonly face: ModuleLoaderFace;
  readonly is: ModuleLoaderFactoryFlags;
};
export type ModuleLoaderFactoryFlags = { front: B; back: B; light: B; dark: B };
export type ModuleLoaderFactoryResponse = Promise<t.RenderOutput>;

/**
 * Factory function builder.
 */
export type ModuleLoaderFactoryFunc<TName extends string = string> = (
  factory: t.ModuleLoaderFactory<TName>,
) => ModuleLoaderFactoryBuilder<TName>;
export type ModuleLoaderFactoryBuilder<TName extends string> = {
  readonly factory: t.ModuleLoaderFactory<TName>;
  render(name: TName): JSX.Element;
  type(name: TName): { render(): JSX.Element };
};

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
  readonly error: any;
  clear(): void;
  closeable(): void;
};

export type ModuleLoaderErrorClearedHandler = (e: ModuleLoaderErrorClearedHandlerArgs) => void;
export type ModuleLoaderErrorClearedHandlerArgs = { readonly error: any };
