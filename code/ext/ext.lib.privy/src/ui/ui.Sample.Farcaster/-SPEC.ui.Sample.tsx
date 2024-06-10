import { useEffect, useRef, useState } from 'react';
import { Color, COLORS, css, DEFAULTS, FC, rx, type t, Icons } from './common';

import { useExperimentalFarcasterSigner, usePrivy } from '@privy-io/react-auth';

export type SampleProps = {
  theme?: t.CommonTheme;
  style?: t.CssValue;
  onSigner?: t.FarcasterSignerHandler;
};

export const Sample: React.FC<SampleProps> = (props) => {
  const {} = props;

  const { getFarcasterSignerPublicKey, signFarcasterMessage, requestFarcasterSignerFromWarpcast } =
    useExperimentalFarcasterSigner();
  props.onSigner?.({
    signer: {
      getFarcasterSignerPublicKey,
      signFarcasterMessage,
      requestFarcasterSignerFromWarpcast,
    },
  });

  /**
   * Render
   */
  const theme = Color.theme(props.theme);
  const styles = {
    base: css({
      color: theme.fg,
      padding: 15,
    }),
  };

  return (
    <div {...css(styles.base, props.style)}>
      <Icons.Farcaster size={48} />
    </div>
  );
};
