import { useEffect } from 'react';
import { COLORS, Color } from './common';

/**
 * https://docs.privy.io/guide/configuration/
 
      :root {
        --privy-border-radius-sm: 'your-custom-value';
        --privy-border-radius-md: 'your-custom-value';
        --privy-border-radius-lg: 'your-custom-value';
        --privy-border-radius-full: 'your-custom-value';
        --privy-color-background: 'your-custom-value';
        --privy-color-background-2: 'your-custom-value';
        --privy-color-foreground: 'your-custom-value';
        --privy-color-foreground-2: 'your-custom-value';
        --privy-color-foreground-3: 'your-custom-value';
        --privy-color-foreground-4: 'your-custom-value';
        --privy-color-foreground-accent: 'your-custom-value';
        --privy-color-accent: 'your-custom-value';
        --privy-color-accent-light: 'your-custom-value';
        --privy-color-accent-dark: 'your-custom-value';
        --privy-color-success: 'your-custom-value';
        --privy-color-error: 'your-custom-value';
      }

 */

let _isOverridden = false; // singleton

export function useStyleOverride() {
  useEffect(() => {
    if (!_isOverridden) {
      const root = document.documentElement;
      const setProperty = root.style.setProperty;

      setProperty('--privy-border-radius-sm', '5px');
      setProperty('--privy-border-radius-md', '6px');
      setProperty('--privy-border-radius-lg', '10px');
      setProperty('--privy-border-radius-full', '15px');

      setProperty('--privy-color-accent:', COLORS.DARK);
      setProperty('--privy-color-accent-light', Color.alpha(COLORS.BLUE, 0.2));
    }

    _isOverridden = true;
  }, []);
}
