import { Config } from '../../../config.mjs';
export default Config.vite(import.meta.url, (e) => {
  /**
   * NOTE
   *    The module is NOT configured as a "library" and with
   *    no `addExternalDependency` calls, everything is bundled into
   *    a single deployable bundle.
   */

  e.environment('web:react');
});
