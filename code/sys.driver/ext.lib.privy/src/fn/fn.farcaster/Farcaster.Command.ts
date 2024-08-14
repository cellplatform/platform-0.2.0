import { rx, type t } from './common';

export const FarcasterCommand = {
  /**
   * Behavior implementation.
   */
  listen(
    fc: t.Farcaster,
    cmd: t.Cmd<t.FarcasterCmd>,
    options: { dispose$?: t.UntilObservable } = {},
  ) {
    const life = rx.lifecycle(options.dispose$);
    const events = cmd.events(life.dispose$);
    const on = events.on;

    on('get:fc', (e) => cmd.invoke('get:fc:res', { fc }, e.tx));

    on('send:cast', async (e) => {
      const text = e.params.text;
      const payload = { text };
      const submitted = await fc.hub.submitCast(payload, fc.fid, fc.signer);
      cmd.invoke('send:cast:res', { submitted }, e.tx);
    });

    on('req:signer', async (e) => {
      await fc.requestSignerFromWarpcast();
      cmd.invoke('req:signer:res', {}, e.tx);
    });

    return life;
  },
} as const;
