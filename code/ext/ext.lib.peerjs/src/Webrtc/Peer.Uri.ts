import { Id, type t } from '../common';
import { Is } from './Is';

/**
 * Helper for formatting peer ids.
 */
export const PeerUri: t.WebrtcPeerUri = {
  Is,

  /**
   * Generate a new peer-id.
   */
  generate(prefix = true) {
    return `${Wrangle.formatPrefix(prefix)}${Id.cuid()}`;
  },

  /**
   * Strip the given string down from a URI to the peer-id.
   */
  id(input) {
    if (typeof input !== 'string') return '';
    const parts = input.trim().split(':');
    return parts[parts.length - 1].trim();
  },

  uri(input) {
    if (typeof input !== 'string') return '';
    input = input.trim();
    return input ? `peer:${PeerUri.id(input)}` : '';
  },

  /**
   * Prepend the default, or given prefix(es).
   */
  prepend(input, ...prefix) {
    const parts = input
      .trim()
      .split(':')
      .map((part) => part.trim());
    prefix = prefix.length === 0 ? ['peer'] : prefix;
    const prefixes = prefix.map((prefix) => Wrangle.stripColons(prefix));
    return `${prefixes.join(':')}:${parts.join(':')}`;
  },
} as const;

/**
 * Helpers
 */

export const Wrangle = {
  formatPrefix(input?: boolean | string) {
    let prefix = '';
    if (input === true) prefix = 'peer';
    if (typeof input === 'string') prefix = Wrangle.stripColons(input);
    return prefix ? `${prefix}:` : prefix;
  },
  stripColons(input: string) {
    return input.trim().replace(/^\:*/, '').replace(/\:*$/, '').trim();
  },
} as const;
