import type { t } from './common';

type R = JSX.Element | null | false;

/**
 * <Component>
 */
export type ModuleNamespaceProps<N extends string = string> = {
  name?: N;
  imports?: t.ModuleImports;
  render?: t.ModuleRenderer<any>;
  commandbar?: t.ModuleNamespaceCommandbarProps;
  flipped?: boolean;
  style?: t.CssValue;
};

export type ModuleNamespaceCommandbarProps = {
  visible?: boolean;
};

/**
 * Render factory
 */
export type ModuleRenderer<N extends string, T = unknown> = (
  e: ModuleRendererArgs<N, T>,
) => R | Promise<R>;

export type ModuleRendererArgs<N extends string, T = unknown> = {
  name: N;
  importer: t.ModuleImporter<T>;
};
