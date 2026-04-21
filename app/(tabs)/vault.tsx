import AuthBackground from '@/components/AuthBackground';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { decode } from 'base64-arraybuffer';
import * as ImagePicker from 'expo-image-picker';
import { Lock, Plus, ShieldCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';

const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';
const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const GRID_PADDING = SPACING.md;
const ITEM_MARGIN = 2;
const ITEM_WIDTH = (width - (GRID_PADDING * 2) - (ITEM_MARGIN * 2 * COLUMN_COUNT)) / COLUMN_COUNT;

type VaultMedia = {
  id: string;
  image_url: string;
  is_locked: boolean;
  uploader_id: string;
  created_at: string;
};

export default function Vault() {
  const { userData } = useAuthStore();
  const [media, setMedia] = useState<VaultMedia[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!userData?.connectionId) return;

    const fetchMedia = async () => {
      const { data, error } = await supabase
        .from('vault_media')
        .select('*')
        .eq('connection_id', userData.connectionId)
        .order('created_at', { ascending: false });

      if (data) {
        setMedia(data);
      }
    };

    fetchMedia();

    const channel = supabase.channel(`vault-${userData.connectionId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'vault_media', filter: `connection_id=eq.${userData.connectionId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMedia = payload.new as VaultMedia;
            setMedia(prev => [newMedia, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as VaultMedia;
            setMedia(prev => prev.map(m => m.id === updated.id ? updated : m));
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old;
            setMedia(prev => prev.filter(m => m.id !== deleted.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userData?.connectionId]);

  const handleUpload = async () => {
    if (!userData?.connectionId || !userData?.id) return;

    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images.');
      return;
    }

    // Launch picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      if (!asset.base64) return;
      
      setIsUploading(true);
      try {
        const fileExt = asset.uri.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${userData.connectionId}/${fileName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('vault')
          .upload(filePath, decode(asset.base64), { contentType: `image/${fileExt}` });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage.from('vault').getPublicUrl(filePath);

        // Insert into database
        const { error: dbError } = await supabase.from('vault_media').insert([{
          connection_id: userData.connectionId,
          uploader_id: userData.id,
          image_url: publicUrl,
          is_locked: false // default false
        }]);

        if (dbError) throw dbError;
        
        // Optionally insert log
        await supabase.from('activity_logs').insert([{
          connection_id: userData.connectionId,
          user_id: userData.id,
          user_name: userData.name || 'User',
          action: 'dropped a photo in the Vault',
          type: 'vault_drop'
        }]);
        
      } catch (err: any) {
        console.error(err);
        Alert.alert('Upload Failed', err.message || 'Something went wrong.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const toggleLock = async (item: VaultMedia) => {
    if (item.uploader_id !== userData?.id) {
      Alert.alert('Locked', 'Only the uploader can unlock this media.');
      return;
    }
    
    // Optimistic UI
    setMedia(prev => prev.map(m => m.id === item.id ? { ...m, is_locked: !m.is_locked } : m));
    
    const { error } = await supabase.from('vault_media').update({ is_locked: !item.is_locked }).eq('id', item.id);
    if (error) {
      // Revert on error
      setMedia(prev => prev.map(m => m.id === item.id ? { ...m, is_locked: item.is_locked } : m));
    }
  };

  const renderItem = ({ item }: { item: VaultMedia }) => (
    <TouchableOpacity 
      style={styles.gridItem} 
      activeOpacity={0.9} 
      onPress={() => toggleLock(item)}
      onLongPress={() => toggleLock(item)}
    >
      {item.is_locked ? (
        <View style={styles.lockedContainer}>
          <Image source={{ uri: item.image_url }} style={styles.image} blurRadius={40} />
          <View style={styles.lockedOverlay}>
            <Lock color="rgba(255,255,255,0.7)" size={24} />
          </View>
        </View>
      ) : (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      )}
    </TouchableOpacity>
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
          data={media}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginTop: 100 }}>
              No media in the Vault yet. Drop a photo!
            </Text>
          }
        />

        {/* ── FAB ── */}
        <TouchableOpacity 
          style={[styles.fabOuter, isUploading && { opacity: 0.7 }]} 
          activeOpacity={0.8}
          onPress={handleUpload}
          disabled={isUploading}
        >
          <View style={styles.fabInner}>
            {isUploading ? <ActivityIndicator color="#111" /> : <Plus color="#111" size={32} />}
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
