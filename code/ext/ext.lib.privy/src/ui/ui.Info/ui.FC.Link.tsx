import { useEffect, useState } from 'react';
import { Button, COLORS, Icons, Spinner, Time, css, type t } from './common';
import { FCUsername } from './ui.FC.Username';

export type FCLinkProps = {
  privy: t.PrivyInterface;
  enabled?: boolean;
  showClose?: boolean;
  style?: t.CssValue;
  onClick?: t.InfoFarcasterClickHandler;
};

export const FCLink: React.FC<FCLinkProps> = (props) => {
  const { privy, enabled = true } = props;
  const showClose = (props.showClose ?? false) && enabled;
  const fc = privy.user?.farcaster;
  const fid = fc?.fid;
  const isAuthenticated = !!fid;

  const [spinning, setSpinning] = useState(false);

  /**
   * Lifecycle
   */
  useEffect(() => {
    if (isAuthenticated && spinning) setSpinning(false);
  }, [isAuthenticated]);

  /**
   * Handlers
   */

  const spin = () => {
    setSpinning(true);
    Time.delay(2000, () => setSpinning(false));
  };

  const linkFarcaster = () => {
    if (!enabled) return;
    privy.linkFarcaster();
    spin();
  };

  const unlinkFarcaster = () => {
    if (!enabled) return;
    if (typeof fid === 'number') privy.unlinkFarcaster(fid);
    spin();
  };

  /**
   * Render
   */
  const color = enabled ? COLORS.BLUE : COLORS.DARK;
  const styles = {
    base: css({
      height: 19,
      display: 'grid',
      alignContent: 'center',
    }),
    close: css({}),
  };

  const button = (label: string, onClick: () => void) => (
    <Button style={{ color }} label={label} enabled={enabled} onClick={onClick} />
  );

  const buttonIcon = (onClick: () => void) => {
    return (
      <Button style={styles.close} enabled={enabled} onClick={onClick}>
        <Icons.Close size={16} />
      </Button>
    );
  };

  const elSpinner = spinning && <Spinner.Bar width={35} />;
  const elLink = !isAuthenticated && button('Connect', linkFarcaster);
  const elUnlink = showClose && buttonIcon(unlinkFarcaster);
  const elUsername = isAuthenticated && !elUnlink && (
    <FCUsername user={fc} onClick={props.onClick} />
  );

  return (
    <div {...css(styles.base, props.style)}>{elSpinner || elUnlink || elLink || elUsername}</div>
  );
};
