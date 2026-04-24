import { useScrollContext } from '@/context/ScrollContext';
import { useEnterAnim, useInView } from '@/hooks/useInView';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

interface StepItemProps {
  num: string;
  title: string;
  desc: string;
  color: string;
  showConnector: boolean;
  triggered: boolean;
  delay: number;
}

function StepItem({ num, title, desc, color, showConnector, triggered, delay }: StepItemProps) {
  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const connectorH = useSharedValue(0);
  const contentAnim = useEnterAnim(triggered, delay + 120, { fromX: 20, fromY: 0 });

  React.useEffect(() => {
    if (!triggered) return;
    circleOpacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    circleScale.value = withDelay(delay, withSpring(1, { damping: 14, stiffness: 100 }));
    if (showConnector) {
      connectorH.value = withDelay(
        delay + 300,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) })
      );
    }
  }, [triggered]);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  const connectorStyle = useAnimatedStyle(() => ({
    flex: 1,
    width: 2,
    marginVertical: SPACING.xs,
    minHeight: 40,
    backgroundColor: color + '40',
    transform: [{ scaleY: connectorH.value }],
    transformOrigin: 'top',
  }));

  return (
    <View style={styles.step}>
      <View style={styles.leftCol}>
        <Animated.View style={[styles.numCircle, { borderColor: color }, circleStyle]}>
          <Text style={[styles.numText, { color }]}>{num}</Text>
        </Animated.View>
        {showConnector && <Animated.View style={connectorStyle} />}
      </View>
      <Animated.View style={[styles.rightCol, contentAnim]}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDesc}>{desc}</Text>
      </Animated.View>
    </View>
  );
}

export default function HowItWorks() {
  const scrollOffset = useScrollContext();
  const { onLayout, triggered } = useInView(scrollOffset);

  const labelStyle = useEnterAnim(triggered, 0, { fromX: -24, fromY: 0 });
  const titleStyle = useEnterAnim(triggered, 100, { fromY: 30 });

  const steps = [
    {
      num: '01',
      title: 'Create Your Account',
      desc: 'Sign up in seconds. Your profile is strictly private — no public presence, no discoverability.',
      color: COLOR_PALETTE.primary,
    },
    {
      num: '02',
      title: 'Invite Your Partner',
      desc: 'Generate a unique, single-use encrypted invite link. Only one person can ever accept it.',
      color: COLOR_PALETTE.secondary,
    },
    {
      num: '03',
      title: 'Lock In & Connect',
      desc: "Once accepted, you're locked in together. Your private universe starts immediately — streaks, vault, chats, everything.",
      color: '#7C3AED',
    },
  ];

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.Text style={[styles.subtitle, labelStyle]}>THE PROCESS</Animated.Text>
      <Animated.Text style={[styles.title, titleStyle]}>Simple. Intentional. Secure.</Animated.Text>

      {steps.map((step, i) => (
        <StepItem
          key={i}
          {...step}
          showConnector={i < steps.length - 1}
          triggered={triggered}
          delay={220 + i * 220}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  subtitle: {
    color: COLOR_PALETTE.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLOR_PALETTE.text,
    fontFamily: SERIF,
    fontSize: 32,
    marginBottom: SPACING.xl,
  },
  step: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
  },
  leftCol: {
    alignItems: 'center',
    width: 56,
  },
  numCircle: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_PALETTE.surface,
  },
  numText: {
    fontSize: 16,
    fontWeight: '800',
  },
  rightCol: {
    flex: 1,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  stepTitle: {
    color: COLOR_PALETTE.text,
    fontFamily: SERIF,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  stepDesc: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
});
