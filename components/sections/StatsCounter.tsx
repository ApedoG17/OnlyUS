import { useScrollContext } from '@/context/ScrollContext';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, LayoutChangeEvent, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const { height: WINDOW_HEIGHT } = Dimensions.get('window');

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  color: string;
  delay: number;
  glowStarted: boolean;
}

function StatItem({ value, suffix, label, color, delay, glowStarted }: StatItemProps) {
  const [display, setDisplay] = useState(0);
  const frame = useRef<ReturnType<typeof setInterval> | null>(null);
  const glowAnim = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1800;
      const steps = 60;
      const interval = duration / steps;
      let current = 0;
      frame.current = setInterval(() => {
        current += 1;
        const progress = current / steps;
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

  useEffect(() => {
    if (!glowStarted) return;
    const timer = setTimeout(() => {
      glowAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0, { duration: 900 }),
        ),
        -1
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [glowStarted]);

  const glowStyle = useAnimatedStyle(() => ({
    shadowColor: color,
    shadowOpacity: interpolate(glowAnim.value, [0, 1], [0.1, 0.9]),
    shadowRadius: interpolate(glowAnim.value, [0, 1], [4, 24]),
    shadowOffset: { width: 0, height: 0 },
    elevation: interpolate(glowAnim.value, [0, 1], [2, 16]),
  }));

  return (
    <View style={styles.statItem}>
      <Animated.View style={[styles.statBadge, { borderColor: color }, glowStyle]}>
        <Text style={[styles.statNumber, { color }]}>
          {display.toLocaleString()}{suffix}
        </Text>
      </Animated.View>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function StatsCounter() {
  const scrollOffset = useScrollContext();
  const [glowStarted, setGlowStarted] = useState(false);
  const sectionYSV = useSharedValue(-1);
  const glowStartedSV = useSharedValue(false);

  const handleLayout = (event: LayoutChangeEvent) => {
    sectionYSV.value = event.nativeEvent.layout.y;
  };

  useAnimatedReaction(
    () => scrollOffset?.value ?? 0,
    (scroll) => {
      'worklet';
      if (glowStartedSV.value || sectionYSV.value < 0) return;
      if (scroll + WINDOW_HEIGHT > sectionYSV.value + 80) {
        glowStartedSV.value = true;
        runOnJS(setGlowStarted)(true);
      }
    }
  );

  const stats = [
    { value: 12400, suffix: '+',     label: 'Couples Connected',   color: COLOR_PALETTE.primary,    delay: 0   },
    { value: 98,    suffix: '%',     label: 'Feel More Connected', color: COLOR_PALETTE.secondary,  delay: 300 },
    { value: 247,   suffix: ' days', label: 'Avg. Streak Record',  color: COLOR_PALETTE.goldAccent, delay: 600 },
    { value: 100,   suffix: '%',     label: 'Completely Private',  color: '#7C3AED',                delay: 900 },
  ];

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Text style={styles.title}>OnlyUs in Numbers</Text>
      <View style={styles.grid}>
        {stats.map((s, i) => (
          <StatItem key={i} {...s} glowStarted={glowStarted} />
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
