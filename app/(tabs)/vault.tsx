import AuthBackground from '@/components/AuthBackground';
import { COLOR_PALETTE, SPACING } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function VaultPlaceholder() {
  return (
    <AuthBackground>
      <View style={styles.container}>
        <Text style={styles.text}>Shared Memory Vault</Text>
        <Text style={styles.sub}>Coming in Phase 2</Text>
      </View>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FAFAFA',
    fontSize: 24,
    fontWeight: '800',
  },
  sub: {
    color: COLOR_PALETTE.primary,
    marginTop: SPACING.sm,
  }
});
