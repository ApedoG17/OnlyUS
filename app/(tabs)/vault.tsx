import AuthBackground from '@/components/AuthBackground';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Lock, Plus, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { Dimensions, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const GRID_PADDING = SPACING.md;
const ITEM_MARGIN = 2;
// Calculate item width exactly: width minus container padding minus inner margins
const ITEM_WIDTH = (width - (GRID_PADDING * 2) - (ITEM_MARGIN * 2 * COLUMN_COUNT)) / COLUMN_COUNT;

// Mock Data
const MOCK_MEDIA = [
  { id: '1', url: 'https://images.unsplash.com/photo-1516589178581-6cd78532f115?auto=format&fit=crop&w=500&q=80', isLocked: false },
  { id: '2', url: 'https://images.unsplash.com/photo-1534069814468-b80c102a96a0?auto=format&fit=crop&w=500&q=80', isLocked: false },
  { id: '3', url: 'https://images.unsplash.com/photo-1522856339183-ecee8d7fbbfc?auto=format&fit=crop&w=500&q=80', isLocked: true },
  { id: '4', url: 'https://images.unsplash.com/photo-1518598811802-bd90bba13143?auto=format&fit=crop&w=500&q=80', isLocked: false },
  { id: '5', url: 'https://images.unsplash.com/photo-1560241088-7517c49392e6?auto=format&fit=crop&w=500&q=80', isLocked: false },
  { id: '6', url: 'https://images.unsplash.com/photo-1581022295087-35e592704906?auto=format&fit=crop&w=500&q=80', isLocked: false },
  { id: '7', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=500&q=80', isLocked: true },
  { id: '8', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=500&q=80', isLocked: false },
  { id: '9', url: 'https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?auto=format&fit=crop&w=500&q=80', isLocked: false },
  { id: '10', url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=500&q=80', isLocked: false },
  { id: '11', url: 'https://images.unsplash.com/photo-1522856339183-ecee8d7fbbfc?auto=format&fit=crop&w=500&q=80', isLocked: false },
  { id: '12', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80', isLocked: false },
];

export default function Vault() {
  
  const renderItem = ({ item }: { item: typeof MOCK_MEDIA[0] }) => (
    <View style={styles.gridItem}>
      {item.isLocked ? (
        <View style={styles.lockedContainer}>
          <Image source={{ uri: item.url }} style={[styles.image, { blurRadius: 20 }]} />
          <View style={styles.lockedOverlay}>
            <Lock color="rgba(255,255,255,0.7)" size={24} />
          </View>
        </View>
      ) : (
        <Image source={{ uri: item.url }} style={styles.image} />
      )}
    </View>
  );

  return (
    <AuthBackground>
      <View style={styles.container}>
        
        {/* ── Encrypted Header ── */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>The Vault</Text>
            <View style={styles.secureBadge}>
              <ShieldCheck color="#1A9E6B" size={14} />
              <Text style={styles.secureText}>Encrypted</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>Your strictly isolated digital gallery.</Text>
        </View>

        {/* ── Media Grid ── */}
        <FlatList
          data={MOCK_MEDIA}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* ── FAB ── */}
        <TouchableOpacity style={styles.fabOuter} activeOpacity={0.8}>
          <View style={styles.fabInner}>
            <Plus color="#111" size={32} />
          </View>
        </TouchableOpacity>

      </View>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 70,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#FAFAFA',
    fontFamily: SERIF_FONT,
    fontSize: 34,
    fontWeight: '800',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 158, 107, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(26, 158, 107, 0.3)',
    gap: 6,
  },
  secureText: {
    color: '#1A9E6B',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    marginTop: 8,
  },

  listContent: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: SPACING.md,
    paddingBottom: 150, // space for tab bar and FAB
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    margin: ITEM_MARGIN,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  lockedContainer: {
    width: '100%',
    height: '100%',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 5, 24, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // FAB
  fabOuter: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 110 : 90, // sit above the tab bar safely
    right: SPACING.xl,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF8A00',
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabInner: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});
