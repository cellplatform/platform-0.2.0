import { Button, COLORS, type t } from './common';

export function FieldLogin(
  privy: t.PrivyInterface,
  fields: t.InfoField[],
  enabled: boolean,
): t.PropListItem | undefined {
  if (!privy.ready) enabled = false;
  const methods = fields.filter((field) => field.startsWith('Login.Method.'));
  if (methods.length === 0 || !fields.includes('Login')) return;

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
  const value = (
    <Button
      style={{ color }}
      label={privy.authenticated ? 'Logout' : 'Login'}
      enabled={enabled}
      onClick={handleClick}
    />
  );

  return {
    label: privy.authenticated ? 'Authenticated' : 'Authenticate',
    value,
  };
}
