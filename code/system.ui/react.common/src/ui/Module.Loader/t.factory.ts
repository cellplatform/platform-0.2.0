import type { t } from './common';

type O = Record<string, unknown>;
type RenderProps = Omit<t.ModuleLoaderStatefulProps, 'name' | 'factory' | 'ctx'>;

/**
 * Factory
 */
export type ModuleLoaderFactory<TName extends string = string, Ctx extends O = O> = (
  e: ModuleLoaderFactoryArgs<TName, Ctx>,
) => ModuleLoaderFactoryResponse;

export type ModuleLoaderFactoryArgs<TName extends string = string, Ctx extends O = O> = {
  readonly name: TName;
  readonly ctx: Ctx;
  readonly theme: t.ModuleLoaderTheme;
  readonly face: t.ModuleLoaderFace;
  readonly is: ModuleLoaderFactoryFlags;
};

export type ModuleLoaderFactoryFlags = {
  readonly front: boolean;
  readonly back: boolean;
  readonly light: boolean;
  readonly dark: boolean;
};

export type ModuleLoaderFactoryResponse = Promise<t.RenderOutput>;

/**
 * Factory function builder.
 */
export type ModuleLoaderFactoryFunc<TName extends string = string, Ctx extends O = O> = (
  factory: t.ModuleLoaderFactory<TName, Ctx>,
) => ModuleLoaderFactoryBuilder<TName, Ctx>;

export type ModuleLoaderFactoryRenderProps = RenderProps;
export type ModuleLoaderFactoryBuilder<TName extends string, Ctx extends O = O> = {
  readonly factory: t.ModuleLoaderFactory<TName, Ctx>;
  render(name: TName, ctx: Ctx, props?: RenderProps): JSX.Element;
  ctx(ctx: Ctx): {
    readonly ctx: Ctx;
    render(name: TName, props?: RenderProps): JSX.Element;
  };
};
