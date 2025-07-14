/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export type Theme = typeof Colors.dark;

export function color(theme: Theme, colorName: keyof Theme) {
  return theme[colorName];
}

export function inverseColor(theme: Theme, colorName: keyof Theme) {
  const inverted = theme === Colors.light ? Colors.dark : Colors.light;
  return inverted[colorName];
}

export function useTheme() {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme];
}

export function usePredefined(
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';

  return Colors[theme][colorName];
}

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
