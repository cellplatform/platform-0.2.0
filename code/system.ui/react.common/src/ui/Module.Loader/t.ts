import type { t } from './common';

type RenderOutput = JSX.Element | null | false;
type RenderInput = JSX.Element | null | false;

export type ModuleLoaderTheme = 'Light' | 'Dark';

/**
 * <Component>
 */
export type ModuleLoaderProps = {
  flipped?: boolean;
  spinning?: boolean | t.ModuleLoaderSpinning;
  theme?: ModuleLoaderTheme;
  back?: { element: RenderInput };
  style?: t.CssValue;
};

export type ModuleLoaderSpinning = {
  width?: number;
  color?: string;
};

/**
 * Render factory
 */
export type ModuleRenderer<N extends string, T = unknown> = (
  e: ModuleRendererArgs<N, T>,
) => RenderOutput | Promise<RenderOutput>;

export type ModuleRendererArgs<N extends string, T = unknown> = {
  name: N;
  importer: t.ModuleImporter<T>;
};
