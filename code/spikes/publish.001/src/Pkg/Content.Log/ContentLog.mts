import { slug, t, Time, R } from '../common.mjs';

type VersionString = string;

const ContentLogFilename = {
  ext: '.log.json',
  isMatch: (path: string) => String(path).trim().endsWith(ContentLogFilename.ext),
  create: () => `${Time.now.timestamp}-${slug()}${ContentLogFilename.ext}`,
};

/**
 * Tools for working with a content log.
 */
export const ContentLog = {
  Filename: ContentLogFilename,

  /**
   * Write deployment to the file-log.
   */
  log(fs: t.Fs) {
    return {
      /**
       * Write the results of a deployment to the log.
       */
      async writeDeployment(data: t.LogEntry) {
        const filename = ContentLog.Filename.create();
        await fs.write(filename, JSON.stringify(data));
      },

      /**
       * Read in a summary of the log and produce a "publicly shareable" view for the client..
       */
      async publicSummary(options: { max?: number; latest?: VersionString } = {}) {
        const m = await fs.manifest({});
        let paths = m.files
          .filter((item) => ContentLog.Filename.isMatch(item.path))
          .map((item) => item.path)
          .reverse();

        const wait = paths.map((path) => fs.json.read<t.LogEntry>(path));
        const items = (await Promise.all(wait)) as t.LogEntry[];

        let history = items.map((entry) => {
          const timestamp = entry.timestamp;
          const version = entry.bundle.version;
          const { success, error } = entry.deployment;
          const urls = success?.urls.public ?? [];
          const item: t.PublicLogHistoryItem = { timestamp, version, urls, error };
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

        const res: t.PublicLogSummary = { latest, history };
        return res;
      },
    };
  },
};

/**
 * Helpers
 */

/**
 * Multiple deployments may have occured with the same SemVer number.
 * Each deployment also has a timestamp associated with it (Unix Epoch).
 * Collapse the list to only include each version once with the latest deployment it has.
 */
function dedupeVersionsToLatest(list: t.PublicLogHistoryItem[]) {
  const byVersion = R.groupBy((item: t.PublicLogHistoryItem) => item.version);
  const grouped = byVersion(list);

  const history = Object.keys(grouped).map((version) => {
    const items = grouped[version];
    const descending = R.sortBy(R.prop('timestamp'), items).reverse();
    return descending[0];
  });

  return history;
}
