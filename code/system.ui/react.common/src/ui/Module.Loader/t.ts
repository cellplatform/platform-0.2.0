import type { t } from './common';

type RenderOutput = JSX.Element | null | false;
type RenderInput = JSX.Element | null | false;

/**
 * <Component>
 */
export type ModuleLoaderProps = {
  flipped?: boolean;
  back?: { element: RenderInput };
  style?: t.CssValue;
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
