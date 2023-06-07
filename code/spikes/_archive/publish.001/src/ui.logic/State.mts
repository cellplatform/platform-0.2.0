import { BundlePaths } from './common';
import { StateBus as Bus } from './StateBus';
import { StateChange as Change } from './State.Change.mjs';
import { StateIs as Is } from './State.Is.mjs';
import { Fetch } from './Fetch.mjs';

export { BundlePaths };
const { useState, withEvents } = Bus;

/**
 * UI State Manager
 */
export const State = {
  Is,
  BundlePaths,
  Fetch,
  Change,
  Bus,
  withEvents,
  useState,
};
