import AuthBackground from '@/components/AuthBackground';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { default as React, useState } from 'react';
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

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [customOccupation, setCustomOccupation] = useState('');
  const [intent, setIntent] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [expectations, setExpectations] = useState('');

  const INTENTS = ['Friendship', 'Relationship', 'Sneaky Links', 'Just for Fun'];
  const OCCUPATIONS = ['Student', 'Tech/IT', 'Healthcare', 'Finance', 'Creative', 'Education', 'Service/Trade', 'Other'];
  const HOBBIES_LIST = ['Fitness', 'Gaming', 'Reading', 'Travel', 'Music', 'Cooking', 'Art', 'Outdoors', 'Sports', 'Photography'];

  const toggleHobby = (hobby: string) => {
    if (hobbies.includes(hobby)) {
      setHobbies(hobbies.filter(h => h !== hobby));
    } else {
      setHobbies([...hobbies, hobby]);
    }
  };

  const nextStep = () => {
    if (step === 1 && !username) {
      Alert.alert('Required', 'Please enter a username or alias.');
      return;
    }
    if (step === 2 && (!occupation || (occupation === 'Other' && !customOccupation) || !intent)) {
      Alert.alert('Required', 'Please fill out your occupation and intent.');
      return;
    }
    setStep(step + 1);
  };

  const submitOnboarding = () => {
    if (hobbies.length === 0 || !expectations) {
      Alert.alert('Required', 'Help your future partner understand you by filling these out.');
      return;
    }
    setLoading(true);
    // Submit to backend simulation
    setTimeout(() => {
      setLoading(false);
      Alert.alert('All Set!', 'Your private profile is ready.');
      router.replace('/connection' as any);
    }, 1500);
  };

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          <View style={styles.headerBlock}>
            <Text style={styles.subText}>STEP {step} OF 3</Text>
            <View style={styles.titleRow}>
              <View style={styles.accentLine} />
              <Text style={styles.mainTitle}>
                {step === 1 ? 'About You' : step === 2 ? 'Your Lifestyle' : 'Deep Dive'}
              </Text>
            </View>
            <Text style={styles.descText}>
              {step === 1 && 'Let\'s get the basics down so your partner knows exactly who they are connecting with.'}
              {step === 2 && 'Give us some context about your day-to-day and what you want from this app.'}
              {step === 3 && 'The things that make you, you. This goes straight into your shared relationship vault.'}
            </Text>
          </View>

          <View style={styles.glassCard}>
            
            {step === 1 && (
              <View style={styles.stepContainer}>
                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Username / Alias</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="This will be what your partner sees"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>

                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Age (Optional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="For demographics & support only"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="number-pad"
                  />
                </View>
              </View>
            )}

            {step === 2 && (
              <View style={styles.stepContainer}>
                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Occupation</Text>
                  <View style={styles.intentGrid}>
                    {OCCUPATIONS.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[styles.intentPill, occupation === item && styles.intentPillActive]}
                        onPress={() => {
                          setOccupation(item);
                          if (item !== 'Other') setCustomOccupation('');
                        }}
                      >
                        <Text style={[styles.intentText, occupation === item && styles.intentTextActive]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {occupation === 'Other' && (
                    <TextInput
                      style={[styles.input, { marginTop: SPACING.md }]}
                      placeholder="Please specify your occupation"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={customOccupation}
                      onChangeText={setCustomOccupation}
                    />
                  )}
                </View>

                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>What brings you to OnlyUs?</Text>
                  <View style={styles.intentGrid}>
                    {INTENTS.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={[styles.intentPill, intent === item && styles.intentPillActive]}
                        onPress={() => setIntent(item)}
                      >
                        <Text style={[styles.intentText, intent === item && styles.intentTextActive]}>
                          {item}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {step === 3 && (
              <View style={styles.stepContainer}>
                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>Hobbies & Interests (Select multiple)</Text>
                  <View style={styles.intentGrid}>
                    {HOBBIES_LIST.map((item) => {
                      const isSelected = hobbies.includes(item);
                      return (
                        <TouchableOpacity
                          key={item}
                          style={[styles.intentPill, isSelected && styles.intentPillActive]}
                          onPress={() => toggleHobby(item)}
                        >
                          <Text style={[styles.intentText, isSelected && styles.intentTextActive]}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.inputWrap}>
                  <Text style={styles.inputLabel}>What do you expect from this app?</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="I hope to build a deeper connection without the noise of Twitter and Insta."
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={expectations}
                    onChangeText={setExpectations}
                    multiline
                    textAlignVertical="top"
                  />
                </View>
              </View>
            )}

            <View style={styles.btnRow}>
              {step > 1 && (
                <TouchableOpacity 
                  style={styles.ghostBtn} 
                  onPress={() => setStep(step - 1)}
                >
                  <Text style={styles.ghostBtnText}>Back</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={[styles.primaryBtn, step === 1 && { flex: 1 }]} 
                onPress={step === 3 ? submitOnboarding : nextStep}
                disabled={loading}
              >
                <Text style={styles.primaryBtnText}>
                  {loading ? 'Processing...' : step === 3 ? 'Complete Setup' : 'Continue'}
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: 80,
    paddingBottom: 40,
  },
  headerBlock: {
    marginBottom: SPACING.xxl,
  },
  subText: {
    color: COLOR_PALETTE.primary,
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
    fontSize: 38,
    fontFamily: SERIF_FONT,
    fontWeight: '800',
  },
  descText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    lineHeight: 22,
    marginTop: SPACING.sm,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  stepContainer: {
    marginBottom: SPACING.lg,
  },
  inputWrap: {
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    marginLeft: 4,
  },
  input: {
    height: 52,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    color: '#FAFAFA',
    fontSize: 15,
  },
  textArea: {
    height: 100,
    paddingTop: SPACING.md,
    borderRadius: RADIUS.lg,
  },
  intentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  intentPill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  intentPillActive: {
    borderColor: COLOR_PALETTE.primary,
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
  },
  intentText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '600',
  },
  intentTextActive: {
    color: COLOR_PALETTE.primary,
  },
  btnRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  ghostBtn: {
    flex: 1,
    height: 52,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtnText: {
    color: '#FAFAFA',
    fontWeight: '700',
    fontSize: 15,
  },
  primaryBtn: {
    flex: 2,
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: '#FF8A00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 16,
  },
});
