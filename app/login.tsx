import AuthBackground from '@/components/AuthBackground';
import { RADIUS, SPACING } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { ArrowLeft, MessageCircle } from 'lucide-react-native';
import React, { useState } from 'react';
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

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both your email and password.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Welcome Back!', 'Successfully signed in to your private space.');
      // router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        style={styles.keyboardAware}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Quick back route for demo, usually no back button on straight login pages if root */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/')}>
            <ArrowLeft color="#FAFAFA" size={24} />
          </TouchableOpacity>

          {/* Top Header Text */}
          <View style={styles.headerBlock}>
            <Text style={styles.subText}>RETURN TO YOUR SPACE</Text>
            <View style={styles.titleRow}>
              <View style={styles.accentLine} />
              <Text style={styles.mainTitle}>Welcome!</Text>
            </View>
            <Text style={styles.descText}>
              Sign back in to your secure, distraction-free environment. 
            </Text>
          </View>

          {/* Glass Form Card */}
          <View style={styles.glassCard}>
            <Text style={styles.cardTitle}>Sign in</Text>

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="developer@tech.com"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              onPress={handleLogin} 
              activeOpacity={0.8}
              disabled={loading}
              style={{ marginTop: SPACING.md }}
            >
              <View style={[styles.gradientBtn, { backgroundColor: '#FF8A00' }]}>
                <Text style={styles.btnText}>
                  {loading ? 'Authenticating...' : 'Submit'}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.switchMode} 
              onPress={() => router.push('/register' as any)}
            >
              <Text style={styles.switchModeText}>Don't have an account? Register</Text>
            </TouchableOpacity>

            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialIcon}><FontAwesome name="facebook" color="#FAFAFA" size={20} /></TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}><FontAwesome name="instagram" color="#FAFAFA" size={20} /></TouchableOpacity>
              <TouchableOpacity style={styles.socialIcon}><MessageCircle color="#FAFAFA" size={20} /></TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  keyboardAware: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center', // Center it slightly more than register since it's shorter
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
  headerBlock: {
    marginBottom: SPACING.xl,
    paddingRight: SPACING.xl,
  },
  subText: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  accentLine: {
    width: 24,
    height: 3,
    backgroundColor: '#FAFAFA',
  },
  mainTitle: {
    color: '#FAFAFA',
    fontSize: 48,
    fontFamily: SERIF_FONT,
    fontWeight: '800',
  },
  descText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 22,
    marginTop: SPACING.sm,
  },

  // Glass Card Layout
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    color: '#FAFAFA',
    fontFamily: SERIF_FONT,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  inputWrap: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    color: '#FAFAFA',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(0,0,0,0.2)', 
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.lg,
    color: '#FAFAFA',
    fontSize: 15,
  },
  gradientBtn: {
    height: 52,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  btnText: {
    color: '#FAFAFA',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  switchMode: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  switchModeText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xl,
    marginTop: SPACING.xl,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
