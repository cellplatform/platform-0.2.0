import { R, t } from '../common';

/**
 * Helper wrapper for manipulating controlled spec-runner state.
 */
export async function State(initial?: t.TestRunnerPropListData) {
  let _current = await Wrangle.initialState(initial);

  const api = {
    /**
     * State properties:
     */
    get current() {
      return _current;
    },

    get specs() {
      return _current.specs ?? (_current.specs = {});
    },

    get results() {
      const specs = api.specs;
      return specs.results ?? (specs.results = {});
    },

    /**
     * Mutation methods:
     */
    selectSpec(hash: string) {
      const selected = api.specs.selected ?? [];
      if (!selected.includes(hash)) {
        _current.specs = {
          ..._current.specs,
          selected: [...selected, hash],
        };
      }
    },

    unselectSpec(hash: string) {
      const selected = api.specs.selected ?? [];
      api.specs.selected = selected.filter((item) => item !== hash);
    },

    runStart(spec: t.TestSuiteModel) {
      const hash = spec.hash();
      api.results[hash] = true;
    },

    runComplete(spec: t.TestSuiteModel, res: t.TestSuiteRunResponse) {
      const hash = spec.hash();
      api.results[hash] = res;
    },
  } as const;

  return api;
}

/**
 * Helpers
 */
const Wrangle = {
  async initialState(initial?: t.TestRunnerPropListData) {
    const data = R.clone(initial ?? {});
    const specs = data.specs ?? (data.specs = {});
    specs.all = specs.all ?? [];
    specs.selected = specs.selected ?? [];
    return data;
  },

  ctx(specs: t.TestRunnerPropListSpecsData) {
    const ctx = specs.ctx ?? {};
    return typeof ctx === 'function' ? ctx() : ctx;
  },
};
