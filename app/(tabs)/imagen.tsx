import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as MediaLibrary from 'expo-media-library';
import { useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ViewShot from 'react-native-view-shot';

const PasarelaImg = require('../../assets/images/rocimar.png');

const FORMATOS = [
  { id: 'story',  label: 'Story',  sub: '9:16', w: 240, h: 426 },
  { id: 'post',   label: 'Post',   sub: '4:5',  w: 240, h: 300 },
  { id: 'banner', label: 'Banner', sub: '16:9', w: 240, h: 135 },
];

function TarjetaNoticia({ titulo, scope, imagenUrl, formato }: {
  titulo: string; scope: string; imagenUrl: string; formato: typeof FORMATOS[0]
}) {
  const { w, h } = formato;
  const fontSize = formato.id === 'banner' ? 8 : formato.id === 'story' ? 13 : 11;
  const maxLines = formato.id === 'banner' ? 2 : formato.id === 'story' ? 8 : 5;

  return (
    <View style={{ width: w, height: h, backgroundColor: '#0D0A0B', overflow: 'hidden' }}>
      <Image
        source={imagenUrl ? { uri: imagenUrl } : PasarelaImg}
        style={{ position: 'absolute', top: 0, left: 0, width: w, height: h }}
        resizeMode={imagenUrl ? 'cover' : 'contain'}
        defaultSource={PasarelaImg}
        onError={() => {}}
      />
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(13,10,11,0.75)', padding: 8 }}>
        <Text style={{ fontSize: 7, color: '#C9A66B', fontWeight: '500', letterSpacing: 1.5, marginBottom: 3 }}>
          PASARELA STUDIO INTERNACIONAL
        </Text>
        <View style={{ height: 0.5, backgroundColor: '#C9A66B', opacity: 0.5, marginBottom: 4 }} />
        <Text style={{ fontSize: 7, color: '#C9A66B', fontWeight: '500', letterSpacing: 1 }}>
          {scope.toUpperCase()}
        </Text>
      </View>
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(13,10,11,0.85)', padding: 10 }}>
        <Text style={{ fontSize: fontSize, color: '#E8C5B0', fontWeight: '700', lineHeight: fontSize * 1.4, marginBottom: 6 }} numberOfLines={maxLines}>
          {titulo}
        </Text>
        <View style={{ height: 1, backgroundColor: '#C9A66B', marginBottom: 5 }} />
        <Text style={{ fontSize: 10, fontWeight: '700', color: '#C9A66B' }}>Pasarela Studio Internacional</Text>
        <Text style={{ fontSize: 8, color: 'rgba(232,197,176,0.7)' }}>Moda · Belleza · Talento</Text>
        <Text style={{ fontSize: 7, color: 'rgba(232,197,176,0.5)' }}>@pasarelastudiointernacional · Dallas, TX</Text>
      </View>
    </View>
  );
}

export default function Imagen() {
  const [formatoActivo, setFormatoActivo] = useState(FORMATOS[1]);
  const [titulo, setTitulo] = useState('Selecciona una noticia en el feed');
  const [scope, setScope] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');
  const viewShotRef = useRef<ViewShot>(null);

  useFocusEffect(
    useCallback(() => {
      const cargarNoticia = async () => {
        try {
          const data = await AsyncStorage.getItem('noticiaActual');
          if (data) {
            const noticia = JSON.parse(data);
            setTitulo(noticia.titulo);
            setScope(noticia.scope);
            setImagenUrl(noticia.imagen || '');
          }
        } catch (e) {
          console.error('Error cargando noticia:', e);
        }
      };
      cargarNoticia();
    }, [])
  );

  const guardarImagen = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería.');
        return;
      }
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        const imagenesStr = await AsyncStorage.getItem('imagenesGeneradas');
        const imagenes = imagenesStr ? parseInt(imagenesStr) + 1 : 1;
        await AsyncStorage.setItem('imagenesGeneradas', imagenes.toString());
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('✓ Guardada', 'La imagen se guardó en tu galería.');
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la imagen.');
    }
  };

  const compartirImagen = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png' });
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo compartir la imagen.');
    }
  };

  const compartirEnApp = async (app: string) => {
    try {
      const uri = await viewShotRef.current?.capture?.();
      if (!uri) return;
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: `Compartir en ${app}` });
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo compartir.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.secLabel}>Formato</Text>
      <View style={styles.formatoRow}>
        {FORMATOS.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[styles.formatoChip, formatoActivo.id === f.id && styles.formatoChipActivo]}
            onPress={() => setFormatoActivo(f)}
          >
            <Text style={[styles.formatoLabel, formatoActivo.id === f.id && styles.formatoLabelActivo]}>{f.label}</Text>
            <Text style={[styles.formatoSub, formatoActivo.id === f.id && styles.formatoSubActivo]}>{f.sub}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.secLabel}>Vista previa</Text>
      <View style={styles.previewContainer}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: 'png', quality: 1, pixelRatio: 3 }}
        >
          <TarjetaNoticia titulo={titulo} scope={scope} imagenUrl={imagenUrl} formato={formatoActivo} />
        </ViewShot>
      </View>

      <Text style={styles.secLabel}>Acciones</Text>
      <View style={styles.accionesGrid}>
        <TouchableOpacity style={styles.accionBtn} onPress={guardarImagen}>
          <Ionicons name="download-outline" size={18} color="#C9A66B" />
          <Text style={styles.accionText}>Guardar en galería</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.accionBtn} onPress={compartirImagen}>
          <Ionicons name="share-outline" size={18} color="#C9A66B" />
          <Text style={styles.accionText}>Compartir</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.accionBtn, { borderColor: '#C13584' }]} onPress={() => compartirEnApp('Instagram')}>
          <Ionicons name="logo-instagram" size={18} color="#C13584" />
          <Text style={[styles.accionText, { color: '#C13584' }]}>Instagram</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.accionBtn, { borderColor: '#25D366' }]} onPress={() => compartirEnApp('WhatsApp')}>
          <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
          <Text style={[styles.accionText, { color: '#25D366' }]}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0A0B', padding: 12 },
  secLabel: { fontSize: 10, fontWeight: '500', color: '#C4826A', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 4 },
  formatoRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  formatoChip: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#7B2D3E55', backgroundColor: '#1E1519', alignItems: 'center' },
  formatoChipActivo: { backgroundColor: '#C9A66B', borderColor: '#C9A66B' },
  formatoLabel: { fontSize: 13, fontWeight: '500', color: '#C4826A' },
  formatoLabelActivo: { color: '#0D0A0B' },
  formatoSub: { fontSize: 10, color: '#C4826A', marginTop: 2 },
  formatoSubActivo: { color: '#0D0A0B' },
  previewContainer: { alignItems: 'center', marginBottom: 16, backgroundColor: '#1E1519', borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: '#7B2D3E55' },
  accionesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  accionBtn: { width: '47%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#C9A66B', backgroundColor: '#1E1519' },
  accionText: { fontSize: 12, fontWeight: '500', color: '#C9A66B' },
});