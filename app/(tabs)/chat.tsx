import AuthBackground from '@/components/AuthBackground';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { Camera, Image as ImageIcon, Mic, Send } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';

type Message = {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
};

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: "Hey babe 💜 you there?", fromMe: false, time: '9:01 AM' },
  { id: '2', text: "Always here for you 🤍", fromMe: true, time: '9:02 AM' },
  { id: '3', text: "I was thinking about you all morning honestly", fromMe: false, time: '9:04 AM' },
  { id: '4', text: "Same... this app feels so different from everything else. Finally just us.", fromMe: true, time: '9:05 AM' },
  { id: '5', text: "Exactly. No noise. No distractions.", fromMe: false, time: '9:06 AM' },
  { id: '6', text: "I love it 🔐", fromMe: true, time: '9:06 AM' },
  { id: '7', text: "What are you doing tonight?", fromMe: false, time: '9:10 AM' },
  { id: '8', text: "Hopefully spending it with you ✨", fromMe: true, time: '9:11 AM' },
];

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { userData } = useAuthStore();

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      fromMe: true,
      time,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.fromMe ? styles.rowRight : styles.rowLeft]}>
      {!item.fromMe && (
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80' }}
          style={styles.avatar}
        />
      )}
      <View style={styles.bubbleWrap}>
        <View style={[styles.bubble, item.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
          <Text style={[styles.bubbleText, item.fromMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
            {item.text}
          </Text>
        </View>
        <Text style={[styles.timeText, item.fromMe ? styles.timeRight : styles.timeLeft]}>
          {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <AuthBackground>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 70}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&q=80' }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>Partner</Text>
            <View style={styles.encryptedBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.encryptedText}>Encrypted Stream Active</Text>
            </View>
          </View>
        </View>

        {/* ── Message Feed ── */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* ── Input Console ── */}
        <View style={styles.inputConsole}>
          <TouchableOpacity style={styles.consoleIcon}>
            <Camera color="rgba(255,255,255,0.6)" size={22} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.consoleIcon}>
            <ImageIcon color="rgba(255,255,255,0.6)" size={22} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Say something..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
          />

          <TouchableOpacity style={styles.consoleIcon}>
            <Mic color="rgba(255,255,255,0.6)" size={22} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sendBtn, inputText.trim().length > 0 && styles.sendBtnActive]}
            onPress={handleSend}
            activeOpacity={0.8}
          >
            <Send color={inputText.trim().length > 0 ? '#111' : 'rgba(255,255,255,0.3)'} size={20} />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 65 : 50,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(15, 5, 24, 0.6)',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLOR_PALETTE.primary,
    marginRight: SPACING.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: '#FAFAFA',
    fontFamily: SERIF_FONT,
    fontSize: 20,
    fontWeight: '800',
  },
  encryptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#1A9E6B',
  },
  encryptedText: {
    color: '#1A9E6B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Messages
  messageList: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  rowLeft: {
    alignSelf: 'flex-start',
  },
  rowRight: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  bubbleWrap: {
    flexShrink: 1,
  },
  bubble: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.xl,
    maxWidth: '100%',
  },
  bubbleMe: {
    backgroundColor: COLOR_PALETTE.primary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextMe: {
    color: '#111',
    fontWeight: '600',
  },
  bubbleTextThem: {
    color: '#FAFAFA',
  },
  timeText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 4,
  },
  timeLeft: {
    textAlign: 'left',
    marginLeft: 4,
  },
  timeRight: {
    textAlign: 'right',
    marginRight: 4,
  },

  // Input Console
  inputConsole: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.md,
    backgroundColor: 'rgba(15, 5, 24, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    gap: SPACING.sm,
  },
  consoleIcon: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    maxHeight: 120,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingVertical: Platform.OS === 'ios' ? SPACING.md : SPACING.sm,
    color: '#FAFAFA',
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  sendBtnActive: {
    backgroundColor: COLOR_PALETTE.primary,
    borderColor: COLOR_PALETTE.primary,
  },
});
