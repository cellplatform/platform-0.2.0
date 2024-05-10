import type { t } from './common';

type RenderOutput = JSX.Element | null | false;

export type ModuleNamespaceTheme = t.CommonTheme;

/**
 * <Component>
 */
export type ModuleNamespaceProps<N extends string = string> = {
  name?: N;
  imports?: t.ModuleImports;
  render?: t.ModuleNamespaceRenderer<any>;
  cmdbar?: t.ModuleNamespaceCmdbarProps;
  flipped?: boolean;
  theme?: t.ModuleNamespaceTheme;
  style?: t.CssValue;
};

export type ModuleNamespaceCmdbarProps = {
  visible?: boolean;
};

/**
 * <Component>.List
 */
export type ModuleNamespaceListProps = {
  theme?: t.ModuleNamespaceTheme;
  style?: t.CssValue;
};

/**
 * Render factory
 */
export type ModuleNamespaceRenderer<N extends string, T = unknown> = (
  e: ModuleNamespaceRendererArgs<N, T>,
) => RenderOutput | Promise<RenderOutput>;

export type ModuleNamespaceRendererArgs<N extends string, T = unknown> = {
  name: N;
  importer: t.ModuleImporter<T>;
};
