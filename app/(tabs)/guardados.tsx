import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Relato = {
  id: string;
  titulo: string;
  relato: string;
  categoria: string;
  scope: string;
  tono: string;
  fecha: string;
};

export default function Guardados() {
  const [relatos, setRelatos] = useState<Relato[]>([]);
  const [expandido, setExpandido] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const cargar = async () => {
        try {
          const data = await AsyncStorage.getItem('relatosGuardados');
          setRelatos(data ? JSON.parse(data) : []);
        } catch (e) {
          console.error(e);
        }
      };
      cargar();
    }, [])
  );

  const eliminar = async (id: string) => {
    Alert.alert('Eliminar', '¿Eliminar este relato?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          const nuevos = relatos.filter(r => r.id !== id);
          setRelatos(nuevos);
          await AsyncStorage.setItem('relatosGuardados', JSON.stringify(nuevos));
        }
      }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.subtitulo}>Archivo personal de Rocimar</Text>
      {relatos.length === 0 ? (
        <View style={styles.vacio}>
          <Text style={styles.vacioText}>No hay relatos guardados aún.{'\n'}Genera un relato desde el feed.</Text>
        </View>
      ) : (
        relatos.map(item => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => setExpandido(expandido === item.id ? null : item.id)}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            {expandido === item.id && (
              <Text style={styles.relatoText}>{item.relato}</Text>
            )}
            <View style={styles.meta}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.categoria}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#1a5276' }]}>
                <Text style={[styles.badgeText, { color: '#fff' }]}>{item.tono}</Text>
              </View>
              <Text style={styles.fecha}>{item.fecha}</Text>
            </View>
            <TouchableOpacity onPress={() => eliminar(item.id)} style={styles.eliminarBtn}>
              <Text style={styles.eliminarText}>Eliminar</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f3ee', padding: 12 },
  subtitulo: { fontSize: 12, color: '#6b6560', marginBottom: 12, marginTop: 4 },
  vacio: { alignItems: 'center', marginTop: 60 },
  vacioText: { fontSize: 13, color: '#6b6560', textAlign: 'center', lineHeight: 22 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 0.5, borderColor: '#d8d3cb' },
  titulo: { fontSize: 13, fontWeight: '500', color: '#0c0b0a', lineHeight: 20, marginBottom: 10 },
  relatoText: { fontSize: 13, color: '#0c0b0a', lineHeight: 21, marginBottom: 10, padding: 10, backgroundColor: '#f6f3ee', borderRadius: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  badge: { backgroundColor: '#c9973a', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '500', color: '#0c0b0a' },
  fecha: { fontSize: 10, color: '#6b6560' },
  eliminarBtn: { marginTop: 8, alignSelf: 'flex-end' },
  eliminarText: { fontSize: 11, color: '#e74c3c' },
});