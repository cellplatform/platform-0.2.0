import { R, t, Time } from '../common';
import { Pkg } from '../index.pkg.mjs';
import { ContentLogFilename as Filename } from './Filename.mjs';

type VersionString = string;
type UnixEpoch = number;

/**
 * Tools for working with a content log.
 */
export const ContentLogger = {
  Filename,

  /**
   * Write deployment to the file-log.
   */
  create(fs: t.Fs) {
    return {
      /**
       * Write the results of a deployment to the log.
       */
      async write(args: {
        bundle: t.BundleLogEntry;
        timestamp?: UnixEpoch;
        deployment?: t.DeploymentLogEntry;
      }) {
        const { bundle, deployment } = args;
        const timestamp = args.timestamp ?? Time.now.timestamp;
        const version = args.bundle.version;
        const filename = ContentLogger.Filename.create(version);
        const packagedBy = `${Pkg.name}@${Pkg.version}`;
        const data: t.LogEntry = { packagedBy, timestamp, bundle, deployment };
        await fs.write(filename, JSON.stringify(data));
      },

      /**
       * Read in a summary of the log and produce a "publicly shareable" view for the client..
       */
      async publicSummary(options: { max?: number; latest?: VersionString } = {}) {
        const m = await fs.manifest({});
        let paths = m.files
          .filter((item) => ContentLogger.Filename.isMatch(item.path))
          .map((item) => item.path)
          .reverse();

        const wait = paths.map((path) => fs.json.read<t.LogEntry>(path));
        const items = (await Promise.all(wait)) as t.LogEntry[];

        let history: t.LogPublicHistoryItem[] = items
          .filter((entry) => Boolean(entry.deployment))
          .map((entry) => {
            const timestamp = entry.timestamp;
            const version = entry.bundle.version;
            const deployment = entry.deployment!;
            const { success, error } = deployment;
            const urls = success?.urls.public ?? [];
            const item: t.LogPublicHistoryItem = { timestamp, version, urls, error };
            return item;
          });
        history = dedupeVersionsToLatest(history);
        if (options.max) {
          history = history.slice(0, options.max);
        }

        /**
         * Finish up.
         */
        const latest = options.latest
          ? { version: options.latest }
          : { version: history[0].version };

        const res: t.LogPublicHistory = { latest, history };
        return res;
      },
    };
  },
};

/**
 * [Helpers]
 */

/**
 * Multiple deployments may have occured with the same SemVer number.
 * Each deployment also has a timestamp associated with it (Unix Epoch).
 * Collapse the list to only include each version once with the latest deployment it has.
 */
function dedupeVersionsToLatest(list: t.LogPublicHistoryItem[]) {
  const byVersion = R.groupBy((item: t.LogPublicHistoryItem) => item.version);
  const grouped = byVersion(list);

  const history = Object.keys(grouped).map((version) => {
    const items = grouped[version];
    const descending = R.sortBy(R.prop('timestamp'), items).reverse();
    return descending[0];
  });

  return history;
}
