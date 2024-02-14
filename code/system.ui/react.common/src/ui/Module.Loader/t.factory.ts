import type { t } from './common';

type RenderProps = Omit<t.ModuleLoaderStatefulProps, 'name' | 'factory'>;

/**
 * Factory function builder.
 */
export type ModuleLoaderFactoryFunc<TName extends string = string> = (
  factory: t.ModuleLoaderFactory<TName>,
) => ModuleLoaderFactoryBuilder<TName>;

export type ModuleLoaderFactoryBuilder<TName extends string> = {
  readonly factory: t.ModuleLoaderFactory<TName>;
  render(name: TName, props?: RenderProps): JSX.Element;
};
