import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  color: string;
  delay: number;
}

function StatItem({ value, suffix, label, color, delay }: StatItemProps) {
  const [display, setDisplay] = useState(0);
  const frame = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1800;
      const steps = 60;
      const interval = duration / steps;
      let current = 0;

      frame.current = setInterval(() => {
        current += 1;
        const progress = current / steps;
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * value));

        if (current >= steps) {
          clearInterval(frame.current!);
          setDisplay(value);
        }
      }, interval);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frame.current) clearInterval(frame.current);
    };
  }, []);

  return (
    <View style={styles.statItem}>
      <View style={[styles.statBadge, { borderColor: color }]}>
        <Text style={[styles.statNumber, { color }]}>
          {display.toLocaleString()}{suffix}
        </Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function StatsCounter() {
  const stats = [
    { value: 12400, suffix: '+',    label: 'Couples Connected',    color: COLOR_PALETTE.primary, delay: 0   },
    { value: 98,    suffix: '%',    label: 'Feel More Connected',  color: COLOR_PALETTE.secondary, delay: 300 },
    { value: 247,   suffix: ' days',label: 'Avg. Streak Record',   color: COLOR_PALETTE.goldAccent, delay: 600 },
    { value: 100,   suffix: '%',    label: 'Completely Private',   color: '#7C3AED', delay: 900 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OnlyUs in Numbers</Text>
      <View style={styles.grid}>
        {stats.map((s, i) => (
          <StatItem key={i} {...s} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    backgroundColor: COLOR_PALETTE.surface,
  },
  title: {
    color: COLOR_PALETTE.text,
    fontFamily: SERIF,
    fontSize: 28,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: SPACING.lg,
  },
  statItem: {
    alignItems: 'center',
    minWidth: '40%',
  },
  statBadge: {
    borderWidth: 1.5,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
  },
  statLabel: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});
