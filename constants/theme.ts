/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';


const burgundy = '#7B2D3E';
const gold = '#C9A66B';

export const Colors = {
  light: {
    text: '#0D0A0B',
    background: '#F5EDE6',
    tint: burgundy,
    icon: '#C4826A',
    tabIconDefault: '#C4826A',
    tabIconSelected: burgundy,
  },
  dark: {
    text: '#E8C5B0',
    background: '#0D0A0B',
    tint: gold,
    icon: '#C4826A',
    tabIconDefault: '#C4826A',
    tabIconSelected: gold,
  },
};

export const PasarelaColors = {
  burgundy:  '#7B2D3E',
  roseTaupe: '#C4826A',
  blush:     '#E8C5B0',
  gold:      '#C9A66B',
  negro:     '#0D0A0B',
  cream:     '#F5EDE6',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "Outfit, system-ui, -apple-system, sans-serif",
    serif: "Cormorant Garamond, Georgia, serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, monospace",
  },
});

