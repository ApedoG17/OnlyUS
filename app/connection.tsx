import AuthBackground from '@/components/AuthBackground';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Check, Copy, HeartHandshake, Link as LinkIcon, Lock, QrCode } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Easing, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { supabase } from '@/lib/supabase';

const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';

type ConnectionState = 'idle' | 'selecting_method' | 'generated_secret' | 'waiting' | 'detected' | 'locked';

export default function Connection() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userData } = useAuthStore();
  const [showWelcome, setShowWelcome] = useState(true);
  const [connectionState, setConnectionState] = useState<ConnectionState>((params.state as ConnectionState) || 'idle');
  const [inviteMode, setInviteMode] = useState<'code' | 'link' | null>(null);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
  const [secretText, setSecretText] = useState('');

  // Animations
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const radarScale1 = useRef(new Animated.Value(1)).current;
  const radarOpacity1 = useRef(new Animated.Value(0.6)).current;
  const radarScale2 = useRef(new Animated.Value(1)).current;
  const radarOpacity2 = useRef(new Animated.Value(0.6)).current;
  
  const lockProgress = useRef(new Animated.Value(0)).current;

  const listenToConnection = (code: string) => {
    supabase.channel(`listen-${code}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'connections', filter: `invite_code=eq.${code}` },
        (payload) => {
          if (payload.new.status === 'detected') setConnectionState('detected');
          if (payload.new.status === 'locked') setConnectionState('locked');
        }
      )
      .subscribe();
  };

  useEffect(() => {
    if (params.inviteCode) {
      setSecretText(params.inviteCode as string);
      listenToConnection(params.inviteCode as string);
    }

    Animated.timing(welcomeOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(welcomeOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          setShowWelcome(false);
          startRadar();
        });
      }, 3000);
    });
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (connectionState === 'waiting') {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connectionState]);

  const startRadar = () => {
    const createPulse = (scale: Animated.Value, opacity: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scale, {
              toValue: 3,
              duration: 2500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 2500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    };

    createPulse(radarScale1, radarOpacity1, 0);
    createPulse(radarScale2, radarOpacity2, 1250);
  };

  const handleHoldIn = () => {
    Animated.timing(lockProgress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(async ({ finished }) => {
      if (finished) {
        setConnectionState('locked');
        if (secretText) {
          await supabase.from('connections').update({ status: 'locked' }).eq('invite_code', secretText);
        }
      }
    });
  };

  const handleHoldOut = () => {
    if (connectionState !== 'locked') {
      Animated.timing(lockProgress, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSelectMethod = async (mode: 'code' | 'link') => {
    setInviteMode(mode);
    setConnectionState('generated_secret');
    setCopied(false);

    const generatedCode = mode === 'code' 
      ? Math.random().toString(36).substring(2, 8).toUpperCase()
      : `onlyus.app/invite/${Math.random().toString(36).substring(2, 8)}`;
    setSecretText(generatedCode);

    const { error } = await supabase.from('connections').insert([
      { invite_code: generatedCode, host_id: userData?.id, status: 'waiting' }
    ]);
    if (error) {
      console.error('Insert error:', error);
      Alert.alert('Database Error', 'Failed to save the generated code: ' + error.message);
    }

    listenToConnection(generatedCode);
  };

  const handleCopy = async () => {
    setCopied(true);
    await Clipboard.setStringAsync(secretText);
    if (connectionState === 'generated_secret') {
      setConnectionState('waiting');
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AuthBackground>
      <View style={styles.root}>

        {/* ── Hidden Dev Trigger (Top Left Corner) ── */}
        {connectionState === 'waiting' && (
          <TouchableOpacity 
            style={styles.devTrigger} 
            onPress={() => setConnectionState('detected')}
          >
            <Text style={{color: 'transparent'}}>DEV</Text>
          </TouchableOpacity>
        )}

        {/* ── Go Back Header ── */}
        {!showWelcome && (
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => router.push('/')}
          >
            <ArrowLeft color="#FAFAFA" size={24} />
          </TouchableOpacity>
        )}

        {/* ── Welcome Overlay ── */}
        {showWelcome && (
          <Animated.View style={[styles.overlay, { opacity: welcomeOpacity }]}>
            <Text style={styles.welcomeSub}>SETUP COMPLETE</Text>
            <Text style={styles.welcomeMain}>Welcome, {userData?.name || 'User'}</Text>
            <Text style={styles.welcomeDesc}>
              Goal: {userData?.intent || 'Deep Connection'}. You can now connect to your partner to have a great private experience free from external noise.
            </Text>
          </Animated.View>
        )}

        {/* ── Main Node UI ── */}
        {!showWelcome && (
          <View style={styles.nodeContainer}>
            
            <View style={styles.statusHeader}>
              <Text style={styles.statusLabel}>SYS.STATUS</Text>
              <Text style={styles.statusValue}>
                {connectionState === 'idle' && 'AWAITING LINK'}
                {connectionState === 'selecting_method' && 'CONFIGURE INVITE'}
                {connectionState === 'generated_secret' && 'SECRET GENERATED'}
                {connectionState === 'waiting' && 'RADAR ACTIVE'}
                {connectionState === 'detected' && 'PARTNER FOUND'}
                {connectionState === 'locked' && 'CONNECTION SECURED'}
              </Text>
              <Text style={styles.identityText}>
                {userData?.name || 'User'} • Seek {userData?.intent || 'Connection'}
              </Text>
            </View>

            {/* ── RADAR CORE ── */}
            <View style={styles.radarZone}>
              
              {connectionState !== 'locked' && (
                <>
                  <Animated.View style={[
                    styles.ring, 
                    { transform: [{ scale: radarScale1 }], opacity: radarOpacity1 }
                  ]} />
                  <Animated.View style={[
                    styles.ring, 
                    { transform: [{ scale: radarScale2 }], opacity: radarOpacity2 }
                  ]} />
                </>
              )}

              <View style={styles.coreButton}>
                {(connectionState === 'idle' || connectionState === 'selecting_method' || connectionState === 'generated_secret') && (
                  <TouchableOpacity 
                    style={styles.innerCore} 
                    onPress={() => setConnectionState('selecting_method')}
                    disabled={connectionState !== 'idle'}
                  >
                    <LinkIcon color="#FFF" size={32} />
                  </TouchableOpacity>
                )}
                {connectionState === 'waiting' && (
                  <View style={[styles.innerCore, { backgroundColor: COLOR_PALETTE.primary }]}>
                    <Text style={styles.countdown}>{formatTime(timeLeft)}</Text>
                  </View>
                )}
                {connectionState === 'detected' && (
                  <View style={[styles.innerCore, { backgroundColor: '#FF8A00' }]}>
                    <HeartHandshake color="#FFF" size={32} />
                  </View>
                )}
                {connectionState === 'locked' && (
                  <View style={[styles.innerCore, { backgroundColor: '#1A9E6B' }]}>
                    <Lock color="#FFF" size={32} />
                  </View>
                )}
              </View>
            </View>

            {/* ── BOTTOM ACTIONS ── */}
            <View style={styles.bottomBlock}>
              
              {connectionState === 'idle' && (
                <>
                  <Text style={styles.actionTitle}>System Unlinked</Text>
                  <Text style={styles.actionDesc}>
                    Your ecosystem is entirely isolated. Generate an invite to establish your secure 1-to-1 connection.
                  </Text>
                  <TouchableOpacity 
                    style={styles.primaryBtn} 
                    onPress={() => setConnectionState('selecting_method')}
                  >
                    <Text style={styles.primaryBtnText}>Create Invite</Text>
                  </TouchableOpacity>
                </>
              )}

              {connectionState === 'selecting_method' && (
                <>
                  <Text style={styles.actionTitle}>Invite Format</Text>
                  <Text style={[styles.actionDesc, { marginBottom: SPACING.md }]}>
                    How would you like to link with your partner?
                  </Text>
                  <View style={styles.methodRow}>
                    <TouchableOpacity 
                      style={styles.methodCard} 
                      onPress={() => handleSelectMethod('code')}
                    >
                      <QrCode color={COLOR_PALETTE.primary} size={28} />
                      <Text style={styles.methodTitle}>Unique Code</Text>
                      <Text style={styles.methodDesc}>For partners who already downloaded OnlyUs</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.methodCard} 
                      onPress={() => handleSelectMethod('link')}
                    >
                      <LinkIcon color="#FF8A00" size={28} />
                      <Text style={styles.methodTitle}>Magic Link</Text>
                      <Text style={styles.methodDesc}>Universal deep link to text externally</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {connectionState === 'generated_secret' && (
                <>
                  <Text style={styles.actionTitle}>
                    {inviteMode === 'code' ? 'Code Generated' : 'Link Generated'}
                  </Text>
                  
                  <View style={styles.secretBox}>
                    <Text style={styles.secretText}>{secretText}</Text>
                    <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                      {copied ? <Check color="#1A9E6B" size={20} /> : <Copy color="#FAFAFA" size={20} />}
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.actionDesc}>
                    Copy this secret to automatically activate the radar.
                  </Text>

                  <TouchableOpacity 
                    style={[styles.primaryBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' }]} 
                    onPress={() => setConnectionState('idle')}
                  >
                    <Text style={[styles.primaryBtnText, { color: '#E0E0E0' }]}>Cancel Request</Text>
                  </TouchableOpacity>
                </>
              )}

              {connectionState === 'waiting' && (
                <>
                  <Text style={styles.actionTitle}>Radar Active</Text>

                  <View style={styles.secretBox}>
                    <Text style={styles.secretText}>{secretText}</Text>
                    <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                      {copied ? <Check color="#1A9E6B" size={20} /> : <Copy color="#FAFAFA" size={20} />}
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.actionDesc}>
                    Broadcasting connection request. Valid for 24 hours.
                  </Text>

                  <TouchableOpacity 
                    style={[styles.primaryBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#FF5E5E' }]} 
                    onPress={() => {
                      setConnectionState('idle');
                      setTimeLeft(24 * 60 * 60);
                    }}
                  >
                    <Text style={[styles.primaryBtnText, { color: '#FF5E5E' }]}>Cancel Request</Text>
                  </TouchableOpacity>
                </>
              )}

              {connectionState === 'detected' && (
                <>
                  <Text style={styles.actionTitle}>Partner Detected</Text>
                  <Text style={styles.actionDesc}>
                    Someone has executed your secure invite. Are you ready to merge ecosystems?
                  </Text>

                  <Pressable 
                    onPressIn={handleHoldIn}
                    onPressOut={handleHoldOut}
                    style={styles.holdBtn}
                  >
                    <Animated.View style={[styles.holdFill, {
                      width: lockProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%']
                      })
                    }]} />
                    <Text style={styles.holdText}>Hold 3 seconds to Lock In</Text>
                  </Pressable>
                </>
              )}

              {connectionState === 'locked' && (
                <>
                  <Text style={[styles.actionTitle, { color: '#1A9E6B' }]}>Connection Forged</Text>
                  <Text style={styles.actionDesc}>
                    Your private world is now ready for both of you. 
                  </Text>
                  <TouchableOpacity style={styles.enterBtn} onPress={() => router.push('/(tabs)' as any)}>
                    <Text style={styles.enterText}>Enter The Vault →</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

          </View>
        )}
      </View>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBtn: {
    position: 'absolute',
    top: 55,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 90,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 5, 30, 0.95)',
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  welcomeSub: {
    color: COLOR_PALETTE.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    marginBottom: SPACING.md,
  },
  welcomeMain: {
    color: '#FFF',
    fontFamily: SERIF_FONT,
    fontSize: 42,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  welcomeDesc: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 300,
  },

  nodeContainer: {
    flex: 1,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
  },
  statusHeader: { alignItems: 'center', marginTop: SPACING.md },
  statusLabel: { color: COLOR_PALETTE.textMuted, fontSize: 11, letterSpacing: 2, fontWeight: '800' },
  statusValue: { color: COLOR_PALETTE.primary, fontSize: 14, fontWeight: '700', marginTop: 4, letterSpacing: 1 },
  identityText: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 6, fontWeight: '600' },

  radarZone: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: COLOR_PALETTE.primary,
    borderWidth: 2,
  },
  coreButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  innerCore: {
    flex: 1,
    width: '100%',
    borderRadius: 50,
    backgroundColor: 'rgba(78, 205, 196, 0.4)', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdown: { color: '#FFF', fontWeight: '800', fontSize: 16 },

  bottomBlock: {
    alignItems: 'center',
    minHeight: 220,
    justifyContent: 'flex-end',
  },
  actionTitle: { color: '#FFF', fontFamily: SERIF_FONT, fontSize: 26, marginBottom: 12, textAlign: 'center' },
  actionDesc: { color: COLOR_PALETTE.textMuted, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.xl },
  
  primaryBtn: {
    width: '100%',
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: '#FF8A00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#000', fontWeight: '800', fontSize: 16 },

  // Method Selection
  methodRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  methodCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'flex-start',
  },
  methodTitle: { color: '#FAFAFA', fontWeight: '700', fontSize: 16, marginTop: SPACING.md, marginBottom: 4 },
  methodDesc: { color: 'rgba(255,255,255,0.5)', fontSize: 12, lineHeight: 18 },

  // Generated Secret
  secretBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    width: '100%',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: SPACING.sm,
  },
  secretText: {
    color: COLOR_PALETTE.primary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  copyBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: RADIUS.sm,
  },

  ghostVault: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  holdBtn: {
    width: '100%',
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  holdFill: { ...StyleSheet.absoluteFillObject, backgroundColor: '#FF8A00' },
  holdText: { color: '#FFF', fontWeight: '800', letterSpacing: 1, zIndex: 2 },
  enterBtn: { width: '100%', height: 56, borderRadius: RADIUS.full, backgroundColor: '#1A9E6B', alignItems: 'center', justifyContent: 'center' },
  enterText: { color: '#111', fontWeight: '800', fontSize: 16 },

  devTrigger: { position: 'absolute', top: 110, left: 20, width: 40, height: 40, zIndex: 999 }
});
