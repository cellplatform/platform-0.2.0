import type { UserConfig } from 'vite';

import basicSsl from '@vitejs/plugin-basic-ssl';
import { fs } from '../builder/common';
import { Paths } from '../builder/Paths';

/**
 * Add a temporary self-signed SSL certificate.
 */
export async function devServerSsl(config: UserConfig) {
  const certDir = Paths.certDir;
  fs.ensureDirSync(certDir, {});

  config.plugins?.push(
    basicSsl({
      name: 'test',
      domains: ['*.custom.com'],
      certDir,
    }),
  );

  const server = config?.server!;
  server.https || (server.https = {});
}
