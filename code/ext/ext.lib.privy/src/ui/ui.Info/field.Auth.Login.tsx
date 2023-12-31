import { Button, COLORS, Spinner, type t } from './common';

export function login(privy: t.PrivyInterface, enabled: boolean): t.PropListItem | undefined {
  if (!privy.ready) enabled = false;

  /**
   * Handlers
   */
  const handleClick = () => {
    if (!privy.authenticated) privy.login();
    if (privy.authenticated) privy.logout();
  };

  /**
   * Render
   */
  const color = enabled ? COLORS.BLUE : COLORS.DARK;
  const elButton = (
    <Button
      label={privy.authenticated ? 'Logout' : 'Login'}
      style={{ color }}
      enabled={enabled}
      onClick={handleClick}
    />
  );

  const elSpinner = !privy.ready && (
    <Spinner.Bar width={20} color={enabled ? COLORS.BLUE : undefined} />
  );

  return {
    label: privy.authenticated ? 'Authenticated' : 'Authenticate',
    value: elSpinner || elButton,
  };
}
