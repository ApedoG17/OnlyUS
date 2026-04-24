import AuthBackground from '@/components/AuthBackground';
import { RADIUS, SPACING } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import { Link } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
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
const isWeb = Platform.OS === 'web';

/* ── Web-safe pressable wrapper ─────────────────────────────────────────
   On web, TouchableOpacity / Pressable inside ScrollViews can silently
   swallow clicks due to the gesture-responder negotiation in RN-Web.
   This component renders a plain <div> on web so native click events
   always fire, while falling back to TouchableOpacity on mobile.       */
function WebSafeButton({
  onPress,
  style,
  disabled,
  children,
}: {
  onPress: () => void;
  style?: any;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  if (isWeb) {
    return (
      <div
        onClick={disabled ? undefined : onPress}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          userSelect: 'none',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <View style={style}>{children}</View>
      </div>
    );
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      disabled={disabled}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
}

function passwordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: '', color: 'transparent', width: '0%' };
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasNum = /[0-9]/.test(pw);
  const hasSpec = /[^A-Za-z0-9]/.test(pw);
  const score = [pw.length >= 8, hasUpper, hasLower, hasNum, hasSpec].filter(Boolean).length;
  if (score <= 2) return { label: 'Weak', color: '#EF4444', width: '30%' };
  if (score === 3) return { label: 'Fair', color: '#FF8A00', width: '55%' };
  if (score === 4) return { label: 'Good', color: '#4ECDC4', width: '78%' };
  return { label: 'Strong', color: '#22C55E', width: '100%' };
}

export default function Register() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const strength = passwordStrength(password);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = 'Full name is required.';
    if (!email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!agreed) e.agreed = 'You must agree to the terms to continue.';
    return e;
  };

  const handleRegister = useCallback(async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace('/onboarding' as any);
    }, 1500);
  }, [fullName, email, password, confirmPassword, agreed]);

  const toggleAgreed = useCallback(() => {
    setAgreed((v) => !v);
    setErrors((p) => ({ ...p, agreed: '' }));
  }, []);

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        style={styles.keyboardAware}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <Link href="../" asChild>
            <TouchableOpacity style={styles.backBtn}>
              <ArrowLeft color="#FAFAFA" size={22} />
            </TouchableOpacity>
          </Link>

          {/* Header */}
          <View style={styles.headerBlock}>
            <Text style={styles.subText}>CREATE YOUR ACCOUNT</Text>
            <View style={styles.titleRow}>
              <View style={styles.accentLine} />
              <Text style={styles.mainTitle}>Join Us.</Text>
            </View>
            <Text style={styles.descText}>
              Private. Intimate. Just the two of you. Set up your account and start your journey together.
            </Text>
          </View>

          {/* Glass Card */}
          <View style={styles.glassCard}>
            <Text style={styles.cardTitle}>Register</Text>

            {/* Full Name */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={[styles.inputRow, errors.fullName ? styles.inputRowError : null]}>
                <User color="rgba(255,255,255,0.4)" size={16} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={fullName}
                  onChangeText={(v) => { setFullName(v); setErrors((p) => ({ ...p, fullName: '' })); }}
                  autoCapitalize="words"
                />
              </View>
              {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}
            </View>

            {/* Email */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputRow, errors.email ? styles.inputRowError : null]}>
                <Mail color="rgba(255,255,255,0.4)" size={16} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@email.com"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={email}
                  onChangeText={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: '' })); }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputRow, errors.password ? styles.inputRowError : null]}>
                <Lock color="rgba(255,255,255,0.4)" size={16} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Min. 8 characters"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={password}
                  onChangeText={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: '' })); }}
                  secureTextEntry={!showPassword}
                />
                <WebSafeButton onPress={() => setShowPassword((s) => !s)} style={styles.eyeBtn}>
                  {showPassword
                    ? <EyeOff color="rgba(255,255,255,0.5)" size={18} />
                    : <Eye color="rgba(255,255,255,0.5)" size={18} />}
                </WebSafeButton>
              </View>
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

              {/* Strength bar */}
              {password.length > 0 && (
                <View style={styles.strengthWrap}>
                  <View style={styles.strengthTrack}>
                    <View style={[styles.strengthFill, { width: strength.width as any, backgroundColor: strength.color }]} />
                  </View>
                  <Text style={[styles.strengthLabel, { color: strength.color }]}>{strength.label}</Text>
                </View>
              )}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputWrap}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={[styles.inputRow, errors.confirmPassword ? styles.inputRowError : null]}>
                <Lock color="rgba(255,255,255,0.4)" size={16} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter your password"
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={confirmPassword}
                  onChangeText={(v) => { setConfirmPassword(v); setErrors((p) => ({ ...p, confirmPassword: '' })); }}
                  secureTextEntry={!showConfirm}
                />
                <WebSafeButton onPress={() => setShowConfirm((s) => !s)} style={styles.eyeBtn}>
                  {showConfirm
                    ? <EyeOff color="rgba(255,255,255,0.5)" size={18} />
                    : <Eye color="rgba(255,255,255,0.5)" size={18} />}
                </WebSafeButton>
              </View>
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Terms */}
            <WebSafeButton onPress={toggleAgreed} style={styles.termsRow}>
              <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                {agreed && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </WebSafeButton>
            {errors.agreed ? <Text style={[styles.errorText, { marginTop: 4 }]}>{errors.agreed}</Text> : null}

            {/* Submit */}
            <WebSafeButton
              onPress={handleRegister}
              disabled={loading}
              style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            >
              <Text style={styles.submitBtnText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </WebSafeButton>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign in link */}
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.signinBtn}>
                <Text style={styles.signinBtnText}>Already have an account?{' '}</Text>
                <Text style={[styles.signinBtnText, styles.signinBtnAccent]}>Sign In</Text>
              </TouchableOpacity>
            </Link>
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
    paddingTop: 56,
    paddingBottom: 48,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Header
  headerBlock: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  subText: {
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 2.5,
    marginBottom: SPACING.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  accentLine: {
    width: 24,
    height: 3,
    backgroundColor: '#FF8A00',
    borderRadius: 2,
  },
  mainTitle: {
    color: '#FAFAFA',
    fontSize: 46,
    fontFamily: SERIF_FONT,
    fontWeight: '800',
  },
  descText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 4,
  },

  // Glass Card
  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.13)',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  cardTitle: {
    color: '#FAFAFA',
    fontFamily: SERIF_FONT,
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },

  // Inputs
  inputWrap: { marginBottom: SPACING.md },
  inputLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 7,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: SPACING.md,
    gap: 10,
  },
  inputRowError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    color: '#FAFAFA',
    fontSize: 15,
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
    flexShrink: 0,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 6,
  },

  // Password strength
  strengthWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  strengthTrack: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    minWidth: 44,
    textAlign: 'right',
  },

  // Terms checkbox
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  checkboxActive: {
    backgroundColor: '#FF8A00',
    borderColor: '#FF8A00',
  },
  checkmark: {
    color: '#FAFAFA',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 14,
  },
  termsText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    lineHeight: 20,
    flex: 1,
  },
  termsLink: {
    color: '#FF8A00',
    fontWeight: '700',
  },

  // Submit button
  submitBtn: {
    height: 54,
    borderRadius: RADIUS.full,
    backgroundColor: '#FF8A00',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: '#FAFAFA',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    fontWeight: '600',
  },

  // Sign in
  signinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  signinBtnText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
  },
  signinBtnAccent: {
    color: '#FF8A00',
    fontWeight: '700',
  },
});