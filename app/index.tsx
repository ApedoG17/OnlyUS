import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Heart, Image as ImageIcon, Lock, Sparkles } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Just the Two of You',
    description: 'A private space exclusively for two. No randoms, no group chats, no distractions. Once you link, you are locked in.',
    icon: <Lock color={COLOR_PALETTE.primary} size={48} />,
  },
  {
    id: '2',
    title: 'Build & Reflect',
    description: 'Track your relationship timeline, share daily mood check-ins, and answer daily prompts to encourage deeper conversations.',
    icon: <Sparkles color={COLOR_PALETTE.primary} size={48} />,
  },
  {
    id: '3',
    title: 'Shared Memory Vault',
    description: 'A dedicated, secure space for your private photos and voice notes. Completely distraction-free and totally yours.',
    icon: <ImageIcon color={COLOR_PALETTE.primary} size={48} />,
  },
  {
    id: '4',
    title: 'Commitment First',
    description: 'Changing partners requires an official break-up protocol. Your connection is sacred until you both decide otherwise.',
    icon: <Heart color={COLOR_PALETTE.primary} size={48} />,
  },
];

export default function Index() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const currentIndex = event.nativeEvent.contentOffset.x / slideSize;
    setActiveIndex(Math.round(currentIndex));
  };

  const handleNext = () => {
    if (activeIndex === ONBOARDING_SLIDES.length - 1) {
      // Logic to move to login/register flow
      console.log('Done with onboarding');
    } else {
      scrollRef.current?.scrollTo({ x: (activeIndex + 1) * width, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>OnlyUs.</Text>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        style={styles.carousel}
      >
        {ONBOARDING_SLIDES.map((slide) => (
          <View key={slide.id} style={styles.slide}>
            <View style={styles.iconContainer}>
              {slide.icon}
            </View>
            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideDescription}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Pagination & Footer */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {ONBOARDING_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>
            {activeIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>

        {activeIndex === ONBOARDING_SLIDES.length - 1 && (
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>I have an invite code</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.background,
  },
  header: {
    paddingTop: 60,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: COLOR_PALETTE.primary,
    letterSpacing: -1,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLOR_PALETTE.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.border,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLOR_PALETTE.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  slideDescription: {
    fontSize: 16,
    color: COLOR_PALETTE.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: SPACING.xl,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLOR_PALETTE.surfaceHover,
  },
  dotActive: {
    backgroundColor: COLOR_PALETTE.primary,
    width: 24,
  },
  primaryButton: {
    backgroundColor: COLOR_PALETTE.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  primaryButtonText: {
    color: COLOR_PALETTE.text,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
});
