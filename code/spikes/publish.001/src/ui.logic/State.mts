import { BundlePaths } from './common';
import { StateBus as Bus } from './StateBus/index.mjs';
import { StateChange as Change } from './State.Change.mjs';
import { StateIs as Is } from './State.Is.mjs';

export { BundlePaths };
const { useState, withEvents } = Bus;

/**
 * UI State Manager
 */
export const State = {
  BundlePaths,
  Is,
  Change,
  Bus,
  withEvents,
  useState,
};
