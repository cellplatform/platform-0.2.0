import { t, Time, slug } from '../common.mjs';

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
       * Read in a summary of the log.
       */
      async summary(options: { max?: number } = {}) {
        //
        const m = await fs.manifest({});
        // console.log('m', m);
        let paths = m.files
          .filter((item) => ContentLog.Filename.isMatch(item.path))
          .map((item) => item.path)
          .reverse();

        if (options.max) {
          paths = paths.slice(0, options.max);
        }

        const wait = paths.map((path) => fs.json.read<t.LogEntry>(path));
        const items = (await Promise.all(wait)) as t.LogEntry[];

        //.filter(Boolean) as t.LogEntry[];

        // console.log(
        //   'files',
        //   paths.map((f) => f),
        // );
        // const items = files.map(() => )

        items.forEach((entry) => {
          const timestamp = entry.timestamp;
          const version = entry.bundle.version;
          const { success, error } = entry.deployment;

          // const urls = entry.deployment.success?.urls;
          const urls = success?.urls ?? [];

          console.log('-------------------------------------------');
          console.log('timestamp', timestamp);
          console.log('version', version);
          // console.log('success', success);
          console.log('urls', urls);
          console.log('error', error);
        });
      },
    };
  },
};
