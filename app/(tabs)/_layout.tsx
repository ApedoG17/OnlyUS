import { COLOR_PALETTE } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { CircleDot, MessageCircle, Vault } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLOR_PALETTE.primary,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeWrap]}>
              <CircleDot color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeWrap]}>
              <MessageCircle color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="vault"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeWrap]}>
              <Vault color={color} size={24} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(15, 5, 24, 0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    height: Platform.OS === 'ios' ? 88 : 70,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    elevation: 0,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeWrap: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
  },
});
