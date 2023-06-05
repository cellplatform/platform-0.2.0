import { R, Test, type t } from '../common';
import { Util } from '../Util.mjs';

/**
 * Helper wrapper for manipulating controlled spec-runner state.
 */
export async function State(initial?: t.TestRunnerPropListData) {
  const res = await Wrangle.initialState(initial);
  const imported = res.imported;
  let _current = res.data;

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

    get all() {
      return imported.map((e) => e.suite);
    },

    selectAll() {
      api.all.forEach((spec) => api.selectSpec(spec.hash()));
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

    clearResults() {
      api.specs.results = undefined;
    },
  } as const;

  return api;
}

/**
 * Helpers
 */
const Wrangle = {
  async initialState(initial?: t.TestRunnerPropListData) {
    const data = R.clone<t.TestRunnerPropListData>(initial ?? {});
    const specs = data.specs ?? (data.specs = {});
    const run = data.run ?? (data.run = {});

    const imported = await Util.importAndInitialize(data);
    run.all = imported.map((e) => e.suite);
    specs.selected = specs.selected ?? [];

    return {
      data,
      imported,
    };
  },
};
