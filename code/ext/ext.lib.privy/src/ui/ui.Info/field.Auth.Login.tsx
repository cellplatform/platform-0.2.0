import { Button, COLORS, Icons, Spinner, type t, css } from './common';

export function login(privy: t.PrivyInterface, enabled: boolean): t.PropListItem | undefined {
  if (!privy.ready) enabled = false;

  /**
   * Handlers
   */
  const handleClick = () => {
    if (!privy.authenticated) privy.login();
    if (privy.authenticated) privy.logout();
  };

  const styles = {
    logoutBody: css({
      display: 'grid',
      gridTemplateColumns: 'auto auto',
      columnGap: '5px',
    }),
  };

  /**
   * Render
   */
  const color = enabled ? COLORS.BLUE : COLORS.DARK;
  const elButton = (
    <Button style={{ color }} enabled={enabled} onClick={handleClick}>
      <div {...styles.logoutBody}>
        <div>{privy.authenticated ? 'logout' : 'login'}</div>
        <Icons.Logout size={14} />
      </div>
    </Button>
  );

  const elSpinner = !privy.ready && (
    <Spinner.Bar width={20} color={enabled ? COLORS.BLUE : undefined} />
  );

  return {
    label: privy.authenticated ? 'Authenticated' : 'Authenticate',
    value: elSpinner || elButton,
  };
}
