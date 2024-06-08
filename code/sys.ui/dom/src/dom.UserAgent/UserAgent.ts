import UAParser from 'ua-parser-js';
import { type t } from '../common';

type Flag = keyof t.UserAgentIs;
const flags: Flag[] = [
  'android',
  'iOS',
  'iPad',
  'iPhone',
  'macOS',
  'posix',
  'windows',
  'mobile',
  'tablet',
];
let _current: t.UserAgent | undefined; // NB: singleton.

/**
 * Ref:
 *    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
 *
 *    Summary:
 *    "The User-Agent request header is a characteristic string that lets
 *     servers and network peers identify the application, operating system,
 *     vendor, and/or version of the requesting user agent.""
 */
export const UserAgent = {
  flags,

  /**
   * Parse the browser user-agent string.
   */
  get current() {
    if (_current) return _current;
    const text = typeof navigator === 'object' ? navigator.userAgent : '';
    _current = UserAgent.parse(text);
    return _current;
  },

  /**
   * Convert a browser user-agent string into a structured object.
   * Example:
   *
   *    const ua = UserAgent.parse(navigator.userAgent);
   *
   */
  parse(input: t.UserAgentString): t.UserAgent {
    const parser = UAParser((input || '').trim());
    const { browser, engine, os, device } = parser;

    const flags = (): t.UserAgentIs => {
      const name = asString(os.name);
      let macOS = name === 'Mac OS';
      let iOS = name === 'iOS';
      let iPad = device.model === 'iPad';
      let iPhone = device.model === 'iPhone';
      const mobile = device.type === 'mobile';
      const tablet = device.type === 'tablet';

      if (macOS) {
        if (iPad || iPhone) iOS = true;
        if (iOS) macOS = false;
      }

      return {
        posix: ['Linux', 'Ubuntu'].includes(name),
        windows: name === 'Windows',
        android: name === 'Android',
        macOS,
        iOS,
        iPad,
        iPhone,
        mobile,
        tablet,
      };
    };

    return {
      is: flags(),
      browser: {
        name: asString(browser.name),
        version: asString(browser.version),
        major: asString(browser.major),
      },
      engine: {
        name: asString(engine.name),
        version: asString(engine.version),
      },
      os: {
        name: asString(os.name),
        version: asString(os.version),
      },
      device: {
        vendor: asString(device.vendor),
        model: asString(device.model),
        type: asString(device.type),
      },
    };
  },
} as const;

/**
 * Helpers
 */
function asString(input?: string) {
  return (input || '').trim();
}
