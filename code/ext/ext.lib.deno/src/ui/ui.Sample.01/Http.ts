import { DEFAULTS } from './common';

const urls = DEFAULTS.urls;

const Api = {
  /**
   * Retrieve relevant end-point URL.
   */
  url(forcePublic = false) {
    const isLocalhost = location.hostname === 'localhost';
    const url = isLocalhost && !forcePublic ? urls.local : urls.prod;
    return url;
  },

  /**
   * Invoke an HTTP request against the API.
   */
  fetch() {
    /**
     * TODO 🐷
     */
    console.log('fetch');
  },
};

export const Http = { Api } as const;
