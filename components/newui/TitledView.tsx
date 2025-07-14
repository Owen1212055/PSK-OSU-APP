import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Theme, useTheme } from '@/hooks/useThemeColor';

interface TitledViewProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const TitledView: React.FC<TitledViewProps> = ({
  title,
  subtitle,
  children,
}) => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title_new_chunky">{title}</ThemedText>
        {subtitle && <ThemedText type="title_new_chunky_subtext">{subtitle}</ThemedText>}
      </View>
      {children}
    </View>
  );
};

function useStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flexDirection: 'column',
      gap: 8,
    },
    header: {
      flexDirection: 'column'
    },
  });
}
