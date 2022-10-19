import { slug, t, Time } from '../common.mjs';

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
      async publicSummary(options: { max?: number } = {}) {
        const m = await fs.manifest({});
        let paths = m.files
          .filter((item) => ContentLog.Filename.isMatch(item.path))
          .map((item) => item.path)
          .reverse();

        if (options.max) {
          paths = paths.slice(0, options.max);
        }

        const wait = paths.map((path) => fs.json.read<t.LogEntry>(path));
        const items = (await Promise.all(wait)) as t.LogEntry[];

        let history = items.map((entry) => {
          const timestamp = entry.timestamp;
          const version = entry.bundle.version;
          const { success, error } = entry.deployment;
          const urls = success?.urls;
          const item: t.PublicLogHistoryItem = { timestamp, version, urls, error };
          return item;
        });

        /**
         * Finish up.
         */
        const latest = history[0];
        const res: t.PublicLogSummary = { latest, history };
        return res;
      },
    };
  },
};
