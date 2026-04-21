/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: string
) {
  return props.light || '#000';
}
