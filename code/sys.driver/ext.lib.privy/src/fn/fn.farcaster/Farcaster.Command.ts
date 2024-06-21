import { type t, rx } from './common';

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

    events.on('get:fc').subscribe((e) => cmd.invoke('get:fc:res', { fc }, e.tx));

    events.on('send:cast').subscribe(async (e) => {
      const text = e.params.text;
      const payload = { text };
      const submitted = await fc.hub.submitCast(payload, fc.fid, fc.signer);
      cmd.invoke('send:cast:res', { submitted }, e.tx);
    });

    return life;
  },
} as const;
