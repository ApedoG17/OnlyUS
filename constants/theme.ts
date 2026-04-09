import { DarkTheme } from '@react-navigation/native';

export const COLOR_PALETTE = {
  background: '#09090B',
  surface: '#18181B',
  surfaceHover: '#27272A',
  primary: '#F43F5E', // Rose/Coral
  primaryMuted: '#9F1239',
  text: '#FAFAFA',
  textMuted: '#A1A1AA',
  border: '#27272A',
  danger: '#EF4444',
};

export const OnlyUsTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLOR_PALETTE.primary,
    background: COLOR_PALETTE.background,
    card: COLOR_PALETTE.surface,
    text: COLOR_PALETTE.text,
    border: COLOR_PALETTE.border,
    notification: COLOR_PALETTE.primary,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
