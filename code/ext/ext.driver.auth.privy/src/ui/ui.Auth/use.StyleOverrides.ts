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

const singleton = {
  isOverriden: false,
};

export function useStyleOverrides() {
  useEffect(() => {
    if (!singleton.isOverriden) {
      const root = document.documentElement;
      const style = root.style;

      style.setProperty('--privy-border-radius-sm', '4px');
      style.setProperty('--privy-border-radius-md', '6px');
      style.setProperty('--privy-border-radius-lg', '10px');
      style.setProperty('--privy-border-radius-full', '15px');

      style.setProperty('--privy-color-accent:', COLORS.DARK);
      style.setProperty('--privy-color-accent-light', Color.alpha(COLORS.BLUE, 0.2));
    }

    singleton.isOverriden = true;
  }, []);
}
