import { DarkTheme } from '@react-navigation/native';

export const COLOR_PALETTE = {
  background: '#0A0A12',       // Deep blue-black
  surface: '#12121E',
  surfaceHover: '#1C1C2E',
  primary: '#4ECDC4',          // Teal (from logo)
  primaryMuted: '#389E96',
  secondary: '#FF6B8A',        // Rose/coral (from logo)
  secondaryMuted: '#C44D66',
  accent: '#7C3AED',           // Vibrant violet accent
  text: '#F8F9FA',
  textMuted: '#9CA3AF',
  border: '#1E1E30',
  danger: '#EF4444',
  goldAccent: '#F5C842',       // Vibrant gold for select highlights
};

export const GRADIENTS = {
  primary: ['#4ECDC4', '#389E96'],
  secondary: ['#FF6B8A', '#C44D66'],
  hero: ['rgba(10,10,18,0)', 'rgba(10,10,18,0.6)', 'rgba(10,10,18,1)'],
  card: ['#12121E', '#1C1C2E'],
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
    notification: COLOR_PALETTE.secondary,
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
  xxl: 32,
  full: 9999,
};
