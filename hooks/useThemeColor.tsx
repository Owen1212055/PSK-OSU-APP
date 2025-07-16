import { Colors } from '@/constants/Colors';
import {useThemeCtx} from "@/contexts/ThemeProvider";

export type Theme = typeof Colors.dark;

export function color(theme: Theme, colorName: keyof Theme) {
  return theme[colorName];
}

export function inverseColor(theme: Theme, colorName: keyof Theme) {
  const inverted = theme === Colors.light ? Colors.dark : Colors.light;
  return inverted[colorName];
}

export function useTheme(): Theme {
  const { effective } = useThemeCtx();
  return Colors[effective];
}

export function usePredefined(
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { effective } = useThemeCtx();
  return Colors[effective][colorName];
}

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { effective } = useThemeCtx();
  return props[effective] ?? Colors[effective][colorName];
}
