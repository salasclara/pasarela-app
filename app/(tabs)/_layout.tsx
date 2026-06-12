import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#c9973a',
        tabBarInactiveTintColor: '#6b6560',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#d8d3cb',
          borderTopWidth: 0.5,
        },
        headerStyle: {
          backgroundColor: '#c9973a',
        },
        headerTintColor: '#0c0b0a',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 13,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Noticias con Rocimar Morales',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="guardados"
        options={{
          title: 'Mis relatos guardados',
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
      <Tabs.Screen name="explore" options={{ href: null }} />
    </Tabs>
  );
}<Tabs.Screen
  name="imagen"
  options={{
    title: 'Generar imagen',
    tabBarLabel: 'Imagen',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="image-outline" size={size} color={color} />
    ),
  }}
/>