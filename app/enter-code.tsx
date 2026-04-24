import AuthBackground from '@/components/AuthBackground';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { ArrowLeft, KeyRound } from 'lucide-react-native';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function EnterCode() {
  const router = useRouter();
  const { userData, setConnectionData } = useAuthStore();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    let cleanCode = code.trim().toUpperCase();
    if (cleanCode.length < 5) {
      Alert.alert('Invalid Code', 'Please enter a valid unique code.');
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .eq('invite_code', cleanCode)
        .single();

      if (error || !data) {
        throw new Error('Code not found or has expired.');
      }

      const { error: updateError, data: updatedData } = await supabase
        .from('connections')
        .update({ guest_id: userData?.id, status: 'detected' })
        .eq('id', data.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Guest successfully connected! Store context.
      setConnectionData(data.id, data.host_id);

      setLoading(false);
      Alert.alert('Connection Match!', 'Secure handshake established.');
      router.replace({ pathname: '/connection', params: { state: 'detected', inviteCode: cleanCode } } as any);
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Connection Failed', e.message || 'Could not verify the code.');
    }
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        style={styles.keyboardAware}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          <Link href="../" asChild>
            <TouchableOpacity style={styles.backBtn}>
              <ArrowLeft color="#FAFAFA" size={24} />
            </TouchableOpacity>
          </Link>

          <View style={styles.headerBlock}>
            <Text style={styles.subText}>SECURE HANDSHAKE</Text>
            <View style={styles.titleRow}>
              <View style={styles.accentLine} />
              <Text style={styles.mainTitle}>Enter Code</Text>
            </View>
            <Text style={styles.descText}>
              Paste the unique 6-digit access code provided by your partner to lock your environments together.
            </Text>
          </View>

          <View style={styles.glassCard}>
            <View style={styles.iconWrap}>
              <KeyRound color={COLOR_PALETTE.primary} size={32} />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Unique Access Code</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 8F-29-XA"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={code}
                onChangeText={(text) => setCode(text.toUpperCase())}
                autoCapitalize="characters"
                maxLength={8}
              />
            </View>

            <TouchableOpacity 
              onPress={handleSubmit} 
              activeOpacity={0.8}
              disabled={loading}
              style={{ marginTop: SPACING.md }}
            >
              <View style={[styles.gradientBtn, { backgroundColor: '#FF8A00' }]}>
                <Text style={styles.btnText}>
                  {loading ? 'Verifying...' : 'Establish Connection'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  keyboardAware: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  headerBlock: { marginBottom: SPACING.xl, paddingRight: SPACING.xl },
  subText: { color: COLOR_PALETTE.primary, fontWeight: '800', fontSize: 12, letterSpacing: 2, marginBottom: SPACING.sm },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, gap: SPACING.md },
  accentLine: { width: 24, height: 3, backgroundColor: '#FAFAFA' },
  mainTitle: { color: '#FAFAFA', fontSize: 44, fontFamily: SERIF_FONT, fontWeight: '800' },
  descText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 22, marginTop: SPACING.sm },

  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  inputWrap: { marginBottom: SPACING.lg },
  inputLabel: { color: '#FAFAFA', fontSize: 12, fontWeight: '700', marginBottom: 6, marginLeft: 4, textAlign: 'center' },
  input: {
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.xl,
    color: COLOR_PALETTE.primary,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  gradientBtn: {
    height: 52,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#111', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
});
