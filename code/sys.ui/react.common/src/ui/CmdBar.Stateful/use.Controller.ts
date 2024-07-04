import { Pkg, type t, DEFAULTS } from './common';

export function useController(props: t.CmdBarStatefulProps) {
  const { paths = DEFAULTS.paths } = props;

  /**
   * Event Handlers
   */
  const onReady: t.CmdBarStatefulReadyHandler = (e) => {
    props.onReady?.({ ...e });
  };

  /**
   * API
   */
  return {
    handlers: { onReady },
  } as const;
}
