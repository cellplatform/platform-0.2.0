let _count = 0;

type Foo = {
  count: number;
  inc(by?: number): void;
};

/**
 * Sample.
 */
export const Foo: Foo = {
  /**
   * Current singleton count.
   */
  get count() {
    return _count;
  },

  /**
   * Increment count.
   */
  inc(by = 1) {
    _count += by;
  },
};
