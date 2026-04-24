import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';
import { Globe, Link2, LogOut, Mail, User } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import SplashScreen from '@/components/SplashScreen';
import BuildReflect from '@/components/sections/BuildReflect';
import CTABanner from '@/components/sections/CTABanner';
import Communication from '@/components/sections/Communication';
import ComparisonTable from '@/components/sections/ComparisonTable';
import CorePillars from '@/components/sections/CorePillars';
import FAQ from '@/components/sections/FAQ';
import FooterVision from '@/components/sections/FooterVision';
import HowItWorks from '@/components/sections/HowItWorks';
import PrivacyBadges from '@/components/sections/PrivacyBadges';
import RelationshipSystem from '@/components/sections/RelationshipSystem';
import StatsCounter from '@/components/sections/StatsCounter';
import Testimonials from '@/components/sections/Testimonials';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

const HERO_TITLE = 'JUST THE TWO\nOF YOU';
const TYPING_SPEED = 65; // ms per character

export default function Index() {
  const insets = useSafeAreaInsets();
  const [isSplashDone, setIsSplashDone] = useState(Platform.OS === 'web');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const { isSignedIn, logout } = useAuthStore();

  // ── Typewriter state ──
  const [typedText, setTypedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);
  const heroFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(HERO_TITLE.slice(0, i));
      if (i >= HERO_TITLE.length) {
        clearInterval(interval);
        setTypingDone(true);
        // Fade in subtitle + buttons
        Animated.timing(heroFade, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    }, TYPING_SPEED);
    return () => clearInterval(interval);
  }, []);

  const handleEnterCode = () => {
    if (isSignedIn) {
      router.push('/enter-code' as any);
    } else {
      router.push('/register' as any);
    }
  };

  return (
    <View style={styles.root}>
      {!isSplashDone && <SplashScreen onFinish={() => setIsSplashDone(true)} />}

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* ── Header ── */}
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <View style={styles.logoRow}>
            <Image source={require('../assets/images/logo.jpg')} style={styles.logoIcon} resizeMode="contain" />
            <Text style={styles.logoText}>OnlyUs.</Text>
          </View>
          {isSignedIn ? (
            <View style={{ zIndex: 100 }}>
              <TouchableOpacity 
                style={styles.profileBtn} 
                onPress={() => setShowProfileMenu(!showProfileMenu)}
              >
                <User color="#FAFAFA" size={20} />
              </TouchableOpacity>
              
              {showProfileMenu && (
                <View style={styles.dropdownMenu}>
                  <Link href="/connection" asChild onPress={() => setShowProfileMenu(false)}>
                    <TouchableOpacity style={styles.dropdownItem}>
                      <Link2 color="#FAFAFA" size={16} />
                      <Text style={styles.dropdownText}>Connection Node</Text>
                    </TouchableOpacity>
                  </Link>
                  <View style={styles.dropdownDivider} />
                  <TouchableOpacity style={styles.dropdownItem} onPress={() => { setShowProfileMenu(false); logout(); }}>
                    <LogOut color="#FF5E5E" size={16} />
                    <Text style={[styles.dropdownText, { color: '#FF5E5E' }]}>Log Out</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <Link href="/register" asChild>
              <TouchableOpacity style={styles.headerBtn}>
                <Text style={styles.headerBtnText}>Get Started</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>

        {/* ── Hero ── */}
        <View style={styles.heroWrap}>
          <ImageBackground
            source={require('../assets/images/hero.png')}
            style={styles.heroImg}
            imageStyle={styles.heroImgRadius}
          >
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>
                {typedText.replace('\\n', '\n')}
                {!typingDone && <Text style={styles.cursor}>|</Text>}
              </Text>
              <Animated.View style={{ opacity: heroFade }}>
                <Text style={styles.heroSub}>
                  OnlyUs is a private, relationship-focused mobile app designed exclusively for two. A secure and emotionally engaging digital space where couples communicate, build memories, and grow — without external distractions.
                </Text>
              </Animated.View>
              <Animated.View style={[styles.heroActions, { opacity: heroFade }]}>
                <Link href={isSignedIn ? '/connection' : '/register'} asChild>
                  <TouchableOpacity style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnTxt}>{isSignedIn ? 'Resume Connection' : 'Begin Journey'}</Text>
                  </TouchableOpacity>
                </Link>
                <Link href={isSignedIn ? '/enter-code' : '/register'} asChild>
                  <TouchableOpacity style={styles.ghostBtn}>
                    <Text style={styles.ghostBtnTxt}>Enter Code →</Text>
                  </TouchableOpacity>
                </Link>
              </Animated.View>
            </View>
          </ImageBackground>
        </View>

        {/* ── Privacy Trust Badges ── */}
        <PrivacyBadges />

        {/* ── Live Stats ── */}
        <StatsCounter />

        {/* ── Core Pillars ── */}
        <CorePillars />

        {/* ── How It Works ── */}
        <HowItWorks />

        {/* ── Comparison Table ── */}
        <ComparisonTable />

        {/* ── Mid-page CTA Banner ── */}
        <CTABanner />

        {/* ── Build & Reflect carousel ── */}
        <BuildReflect />

        {/* ── Relationship System (accordion) ── */}
        <RelationshipSystem />

        {/* ── Communication & Safety ── */}
        <Communication />

        {/* ── Shared Memory Vault ── */}
        <View style={styles.vaultSection}>
          <Text style={styles.sectionSub}>SHARED MEMORY VAULT</Text>
          <Text style={styles.sectionTitle}>A Private World,{'\n'}Just for Two</Text>
          <Image source={require('../assets/images/memories.png')} style={styles.vaultImage} />
          <View style={styles.vaultStats}>
            {[
              ['Photo & Video Storage', 'Private'],
              ['Screenshot Block', 'Active'],
              ['Accessible To', '2 Users Only'],
              ['Max Users', '2'],
            ].map(([label, val], i) => (
              <View key={i} style={[styles.vaultRow, i === 3 && { borderBottomWidth: 0 }]}>
                <Text style={styles.vaultLabel}>{label}</Text>
                <Text style={styles.vaultValue}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Testimonials ── */}
        <Testimonials />

        {/* ── FAQ ── */}
        <FAQ />

        {/* ── Footer Vision ── */}
        <FooterVision />

        {/* ── Commitment closing image ── */}
        <View style={styles.commitSection}>
          <View style={styles.commitText}>
            <Text style={styles.sectionSub}>COMMITMENT FIRST</Text>
            <Text style={styles.sectionTitle}>Exclusive homes for{'\n'}premium hearts</Text>
            <Text style={styles.commitDesc}>
              Changing partners requires an official break-up protocol. Your connection is sacred until you both decide otherwise. Make it intentional. Make it count.
            </Text>
            <TouchableOpacity style={styles.outlineBtn}>
              <Text style={styles.outlineBtnTxt}>Learn Protocol</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Legal Footer ── */}
        <View style={styles.footerBar}>
          <View style={styles.socialFooterRow}>
            <TouchableOpacity style={styles.footerSocialIcon}><FontAwesome name="twitter" color={COLOR_PALETTE.textMuted} size={18} /></TouchableOpacity>
            <TouchableOpacity style={styles.footerSocialIcon}><FontAwesome name="instagram" color={COLOR_PALETTE.textMuted} size={18} /></TouchableOpacity>
            <TouchableOpacity style={styles.footerSocialIcon}><FontAwesome name="facebook" color={COLOR_PALETTE.textMuted} size={18} /></TouchableOpacity>
            <TouchableOpacity style={styles.footerSocialIcon}><Globe color={COLOR_PALETTE.textMuted} size={18} /></TouchableOpacity>
            <TouchableOpacity style={styles.footerSocialIcon}><Mail color={COLOR_PALETTE.textMuted} size={18} /></TouchableOpacity>
          </View>
          <Text style={styles.footerText}>© 2026 OnlyUs Platform. All rights reserved.</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 20, /* Overridden inline with safe-area inset */
    paddingBottom: SPACING.lg,
    zIndex: 999, /* Ensure header and dropdown sit strictly above page content */
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
  },
  logoText: {
    color: COLOR_PALETTE.text,
    fontSize: 22,
    fontFamily: SERIF,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerBtn: {
    backgroundColor: COLOR_PALETTE.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  headerBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 14,
  },
  profileBtn: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    right: 0,
    backgroundColor: 'rgba(30, 20, 45, 0.95)',
    borderRadius: RADIUS.lg,
    padding: SPACING.sm,
    width: 200,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: SPACING.sm,
  },
  dropdownText: {
    color: '#FAFAFA',
    fontSize: 14,
    fontWeight: '600',
  },

  // Hero
  heroWrap: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
  },
  heroImg: {
    width: '100%',
    height: 560,
  },
  heroImgRadius: {
    borderRadius: RADIUS.xl,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,10,18,0.55)',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    justifyContent: 'flex-end',
  },
  heroTitle: {
    color: '#FAFAFA',
    fontFamily: SERIF,
    fontSize: 44,
    fontWeight: '800',
    lineHeight: 50,
    marginBottom: SPACING.md,
    letterSpacing: 0.5,
  },
  cursor: {
    color: COLOR_PALETTE.primary,
    fontWeight: '300',
  },
  heroSub: {
    color: '#E0E0E0',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: SPACING.lg,
    maxWidth: '88%',
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  primaryBtn: {
    backgroundColor: COLOR_PALETTE.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.full,
  },
  primaryBtnTxt: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
  ghostBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  ghostBtnTxt: {
    color: '#FAFAFA',
    fontWeight: '600',
    fontSize: 16,
  },

  // Vault Section
  vaultSection: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  sectionSub: {
    color: COLOR_PALETTE.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  sectionTitle: {
    color: COLOR_PALETTE.text,
    fontFamily: SERIF,
    fontSize: 30,
    marginBottom: SPACING.xl,
    lineHeight: 36,
  },
  vaultImage: {
    width: '100%',
    height: 280,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
  },
  vaultStats: {
    borderRadius: RADIUS.lg,
    backgroundColor: COLOR_PALETTE.surface,
    overflow: 'hidden',
  },
  vaultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLOR_PALETTE.border,
  },
  vaultLabel: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 15,
  },
  vaultValue: {
    color: COLOR_PALETTE.text,
    fontWeight: '700',
    fontSize: 15,
  },

  // Commitment Section
  commitSection: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    gap: SPACING.xl,
  },
  commitText: {
    flex: 1,
  },
  commitDesc: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: SPACING.lg,
  },
  commitImage: {
    width: '100%',
    height: 280,
    borderRadius: RADIUS.xl,
  },
  outlineBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: COLOR_PALETTE.primary,
  },
  outlineBtnTxt: {
    color: COLOR_PALETTE.primary,
    fontWeight: '700',
    fontSize: 15,
  },

  // Legal Footer
  footerBar: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.border,
    marginHorizontal: SPACING.xl,
  },
  socialFooterRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  footerSocialIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 12,
  },
});
