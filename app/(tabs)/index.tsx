import AuthBackground from '@/components/AuthBackground';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { BellRing, CalendarHeart, Camera, Flame, Heart, Image as ImageIcon, MessageCircleHeart } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';

// Mock Data for Moods
type Mood = 'connected' | 'busy' | 'need_space' | 'spicy';
const MOOD_COLORS = {
  connected: '#1A9E6B', // Green
  busy: '#FF8A00',      // Orange
  need_space: '#777777',// Grey
  spicy: '#FF2A5F',     // Red/Pink
};

const LOG_DATA = [
  { id: '1', user: 'Partner', action: 'changed mood to connected', time: '10 mins ago', icon: Heart },
  { id: '2', user: 'You', action: 'dropped a photo in the Vault', time: '2 hours ago', icon: ImageIcon },
  { id: '3', user: 'Partner', action: 'sent an urgent ping', time: 'Yesterday', icon: BellRing },
];

export default function Dashboard() {
  const [myMood, setMyMood] = useState<Mood>('connected');
  const [partnerMood, setPartnerMood] = useState<Mood>('busy');

  return (
    <AuthBackground>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* ── Top Header ── */}
        <View style={styles.header}>
          <Text style={styles.dateText}>FRIDAY, APRIL 10</Text>
          <Text style={styles.titleText}>OnlyUs.</Text>
        </View>

        {/* ── Dual Mood Rings ── */}
        <View style={styles.ringsContainer}>
          {/* Partner Ring */}
          <View style={styles.avatarBlock}>
            <View style={[styles.ringOuter, { borderColor: MOOD_COLORS[partnerMood] }]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' }} 
                style={styles.avatarImg}
              />
            </View>
            <Text style={styles.avatarName}>Partner</Text>
            <Text style={[styles.avatarMoodText, { color: MOOD_COLORS[partnerMood] }]}>
              {partnerMood.toUpperCase().replace('_', ' ')}
            </Text>
          </View>

          {/* Connection Line */}
          <View style={styles.connectionLine}>
            <View style={[styles.lineDot, { backgroundColor: MOOD_COLORS[partnerMood] }]} />
            <View style={styles.lineBar} />
            <View style={[styles.lineDot, { backgroundColor: MOOD_COLORS[myMood] }]} />
          </View>

          {/* User Ring */}
          <TouchableOpacity 
            style={styles.avatarBlock}
            onPress={() => setMyMood(myMood === 'connected' ? 'spicy' : 'connected')}
            activeOpacity={0.8}
          >
            <View style={[styles.ringOuter, { borderColor: MOOD_COLORS[myMood] }]}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80' }} 
                style={styles.avatarImg}
              />
            </View>
            <Text style={styles.avatarName}>You</Text>
            <Text style={[styles.avatarMoodText, { color: MOOD_COLORS[myMood] }]}>
              {myMood.toUpperCase().replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Quick Actions (Mixed) ── */}
        <View style={styles.actionsWrap}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionCard}>
              <MessageCircleHeart color="#FF2A5F" size={26} />
              <Text style={styles.actionLabel}>Send Kiss</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <BellRing color="#FF8A00" size={26} />
              <Text style={styles.actionLabel}>Urgent Ping</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <Camera color={COLOR_PALETTE.primary} size={26} />
              <Text style={styles.actionLabel}>Drop Photo</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBanner}>
              <CalendarHeart color="#FAFAFA" size={22} />
              <Text style={styles.actionBannerText}>Set Next Date Idea</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBannerDark}>
              <Flame color="#FF2A5F" size={22} />
              <Text style={styles.actionBannerTextDark}>Spicy Mode</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Activity Log ── */}
        <View style={styles.logSection}>
          <Text style={styles.sectionHeader}>CONNECTION LOG</Text>
          
          <View style={styles.logCard}>
            {LOG_DATA.map((item, index) => (
              <View key={item.id} style={[styles.logItem, index === LOG_DATA.length - 1 && styles.logItemLast]}>
                <View style={styles.logIconBox}>
                  <item.icon color={COLOR_PALETTE.primary} size={16} />
                </View>
                <View style={styles.logTextWrap}>
                  <Text style={styles.logMainText}>
                    <Text style={{ fontWeight: '800', color: '#FAFAFA' }}>{item.user}</Text> {item.action}
                  </Text>
                  <Text style={styles.logTimeText}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 60,
    paddingHorizontal: SPACING.xl,
    paddingBottom: 120, // space for tab bar
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  dateText: {
    color: COLOR_PALETTE.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 4,
  },
  titleText: {
    color: '#FAFAFA',
    fontFamily: SERIF_FONT,
    fontSize: 28,
    fontWeight: '700',
  },

  // Dual Rings
  ringsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  avatarBlock: {
    alignItems: 'center',
  },
  ringOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    padding: 4,
    marginBottom: SPACING.sm,
  },
  avatarImg: {
    flex: 1,
    width: '100%',
    borderRadius: 50,
  },
  avatarName: {
    color: '#FAFAFA',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 2,
  },
  avatarMoodText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // Connection Line
  connectionLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 60,
    marginHorizontal: SPACING.md,
    marginTop: -40, // offset avatar text
  },
  lineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  lineBar: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 4,
  },

  // Actions
  actionsWrap: {
    marginBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionLabel: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: '700',
    marginTop: SPACING.md,
  },
  actionBanner: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  actionBannerText: {
    color: '#FAFAFA',
    fontWeight: '700',
    fontSize: 14,
  },
  actionBannerDark: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 42, 95, 0.15)',
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  actionBannerTextDark: {
    color: '#FF2A5F',
    fontWeight: '800',
    fontSize: 14,
  },

  // Log
  logSection: {
    marginTop: SPACING.sm,
  },
  sectionHeader: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
  },
  logCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  logItemLast: {
    borderBottomWidth: 0,
  },
  logIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  logTextWrap: {
    flex: 1,
  },
  logMainText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  logTimeText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 2,
  },
});
