import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#C9A66B',
        tabBarInactiveTintColor: '#C4826A',
        tabBarStyle: {
          backgroundColor: '#0D0A0B',
          borderTopColor: '#7B2D3E55',
          borderTopWidth: 0.5,
        },
        headerStyle: {
          backgroundColor: '#7B2D3E',
        },
        headerTintColor: '#E8C5B0',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 13,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Pasarela Studio Internacional',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guardados"
        options={{
          title: 'Mis artículos guardados',
          tabBarLabel: 'Guardados',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Mi perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="imagen"
        options={{
          title: 'Generar imagen',
          tabBarLabel: 'imagen',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="image-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}