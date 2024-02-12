import type { t } from './common';

export type ModuleNamespaceTheme = t.ModuleLoaderTheme;

/**
 * <Component>
 */
export type ModuleNamespaceProps<N extends string = string> = {
  name?: N;
  imports?: t.ModuleImports;
  render?: t.ModuleRenderer<any>;
  commandbar?: t.ModuleNamespaceCommandbarProps;
  flipped?: boolean;
  theme?: t.ModuleNamespaceTheme;
  style?: t.CssValue;
};

export type ModuleNamespaceCommandbarProps = {
  visible?: boolean;
};
