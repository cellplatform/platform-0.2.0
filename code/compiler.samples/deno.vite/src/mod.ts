type Foo = {
  count: number;
};

/**
 * Deno module definition.
 */
export const Foo: Foo = {
  count: 0,
} as const;
