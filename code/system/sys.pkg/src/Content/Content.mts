import { ContentBundler as Bundler } from '../Content.Bundler';
import { ContentLogger as Logger } from '../Content.Logger';

export const Content = {
  Bundler,
  Logger,

  bundler: Bundler.create,
  logger: Logger.create,
};
