import { create } from './Spec.Context.create.mjs';
import { Wrangle } from '../Spec/Wrangle.mjs';

/**
 * Information object passed as the {ctx} to tests.
 */
export const SpecContext = {
  Wrangle,

  /**
   * Generate a new set of arguments used to render a spec/component.
   */
  create,
};
