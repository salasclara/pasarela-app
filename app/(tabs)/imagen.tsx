import {
  Montserrat_400Regular,
  Montserrat_700Bold,
  Montserrat_800ExtraBold,
  Montserrat_900Black,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as MediaLibrary from 'expo-media-library';
import { useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ViewShot from 'react-native-view-shot';

const SERVIDOR = 'https://pasarela-servidor-production.up.railway.app';

const CATEGORIA_COLORES: Record<string, string> = {
  moda: '#FF1493',
  belleza: '#FFD60A',
  talento: '#00AEEF',
  eventos: '#7A3FF2',
  lifestyle: '#00B67A',
  exclusivas: '#F4C430',
  entretenimiento: '#FF1493',
  dallas: '#00AEEF',
};

function getCategoriaColor(scope: string): string {
  return CATEGORIA_COLORES[scope.toLowerCase().trim()] || '#FF1493';
}

const FORMATOS = [
  { id: 'story', label: 'Story', sub: '9:16', w: 240, h: 426 },
  { id: 'post', label: 'Post', sub: '4:5', w: 240, h: 300 },
  { id: 'banner', label: 'Banner', sub: '16:9', w: 240, h: 135 },
];

function TarjetaNoticia({
  titular,
  hero,
  gancho,
  scope,
  imagenUrl,
  formato,
  pdpNumero,
}: {
  titular: string;
  hero: string;
  gancho: string;
  scope: string;
  imagenUrl: string;
  formato: typeof FORMATOS[0];
  pdpNumero: string;
}) {
  const { w, h } = formato;
  const color = getCategoriaColor(scope);
  const isBanner = formato.id === 'banner';
  const isStory = formato.id === 'story';

  const logoSize = isStory ? 48 : Math.round(h * 0.18);
  const headerHeight = h * 0.23;
  const catSize = isStory ? 9 : 7;
  const titSize = isStory ? 11 : isBanner ? 7 : 10;
  const heroSize = isStory ? 24 : isBanner ? 9 : 20;
  const footSize = isStory ? 7 : isBanner ? 5 : 6;

  return (
    <View style={{ width: w, height: h, backgroundColor: '#000', overflow: 'hidden' }}>
      <Image
        source={imagenUrl ? { uri: imagenUrl } : require('../../assets/images/pasarela.png')}
        style={{ position: 'absolute', top: headerHeight, left: 0, width: w, height: h - headerHeight }}
        resizeMode="cover"
      />

      <LinearGradient
        colors={[
          'rgba(0,0,0,0.98)',
          'rgba(0,0,0,0.80)',
          'rgba(0,0,0,0)',
        ]}
        locations={[0, 0.55, 1]}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: h * 0.24,
        }}
      />

      {!isBanner && (
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.98)',
            'rgba(0,0,0,0.88)',
            'rgba(0,0,0,0.45)',
            'rgba(0,0,0,0)',
          ]}
          locations={[0, 0.35, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: w * 0.78,
            height: h,
          }}
        />
      )}

      <LinearGradient
        colors={[
          'rgba(0,0,0,0)',
          'rgba(0,0,0,0.35)',
          'rgba(0,0,0,0.75)',
          'rgba(0,0,0,0.98)',
        ]}
        locations={[0, 0.35, 0.72, 1]}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: h * 0.78,
        }}
      />

      {!isBanner && (
        <>
          <View
            style={{
              position: 'absolute',
              top: h * 0.025,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: 'Bauhaus93',
                fontSize: logoSize,
                color: '#FF1493',
                letterSpacing: -1,
                lineHeight: logoSize,
                textAlign: 'center',
              }}
            >
              Pasarela
            </Text>

            <View
              style={{
                height: 1,
                backgroundColor: '#FF1493',
                width: w * 0.88,
                marginTop: -5,
                opacity: 0.75,
              }}
            />
          </View>

          <View
            style={{
              position: 'absolute',
              top: h * 0.205,
              left: w * 0.08,
            }}
          >
            <Text
              style={{
                fontSize: catSize,
                color,
                fontFamily: 'Montserrat_700Bold',
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}
            >
              {scope.toUpperCase()}
            </Text>
          </View>

          <View
            style={{
              position: 'absolute',
              top: h * (isStory ? 0.39 : 0.36),
              left: w * 0.08,
              width: w * (isStory ? 0.82 : 0.58),
            }}
          >
            {titular.length > 0 && (
              <Text
                style={{
                  fontSize: titSize,
                  color: '#FFFFFF',
                  fontFamily: 'Montserrat_800ExtraBold',
                  lineHeight: titSize * (isStory ? 1.12 : 0.95),
                  letterSpacing: -0.2,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
                numberOfLines={4}
              >
                {titular}
              </Text>
            )}

            {/* GANCHO — dentro del bloque posicionado */}
            {gancho.length > 0 && (
              <Text
                style={{
                  fontSize: isStory ? 8 : 7,
                  color: 'rgba(255,255,255,0.80)',
                  fontFamily: 'Montserrat_400Regular',
                  fontStyle: 'italic',
                  lineHeight: isStory ? 12 : 11,
                  marginBottom: 5,
                }}
                numberOfLines={4}
              >
                {gancho}
              </Text>
            )}

            <Text
              style={{
                fontSize: heroSize,
                color,
                fontFamily: 'Montserrat_900Black',
                lineHeight: heroSize * (isStory ? 1.04 : 0.95),
                textTransform: 'uppercase',
                letterSpacing: -0.5,
              }}
              numberOfLines={2}
              adjustsFontSizeToFit={isStory}
              minimumFontScale={0.65}
            >
              {hero}
            </Text>
          </View>
         
           

          <View
            style={{
              position: 'absolute',
              bottom: h * 0.055,
              left: w * 0.08,
              right: 20,
            }}
          >
            <View
              style={{
                height: 1,
                backgroundColor: color,
                width: w * 0.62,
                marginBottom: 5,
                opacity: 0.8,
              }}
            />

            <Text
              style={{
                fontSize: footSize + 2,
                color,
                fontFamily: 'Montserrat_700Bold',
                letterSpacing: 0.2,
              }}
            >
              Pasarela Tu Revista
            </Text>

            <Text
              style={{
                fontSize: footSize,
                color: 'rgba(255,255,255,0.60)',
                fontFamily: 'Montserrat_400Regular',
                marginTop: 1,
              }}
            >
              Moda · Belleza · Talento
            </Text>

            <Text
              style={{
                fontSize: footSize,
                color: 'rgba(255,255,255,0.48)',
                fontFamily: 'Montserrat_400Regular',
                marginTop: 1,
              }}
            >
              @pasarelaturevista
            </Text>
          </View>
        </>
      )}

      <Text
        style={{
          position: 'absolute',
          bottom: 8,
          right: 10,
          fontSize: 5,
          color: 'rgba(255,255,255,0.35)',
          fontFamily: 'Montserrat_400Regular',
          letterSpacing: 0.8,
        }}
      >
        {pdpNumero}
      </Text>

      {isBanner && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 8,
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontFamily: 'Bauhaus93',
              fontSize: 28,
              color: '#FF1493',
              lineHeight: 28,
            }}
          >
            Pasarela
          </Text>

          <Text
            style={{
              fontSize: 8,
              color: '#fff',
              fontFamily: 'Montserrat_700Bold',
              marginTop: 3,
            }}
            numberOfLines={2}
          >
            {titular} {hero}
          </Text>
        </View>
      )}
    </View>
  );
}


function PortadaEditorialStory({ fotoUrl, fotoAutorizada }: { fotoUrl: string; fotoAutorizada: boolean }) {
  const mostrarFoto = fotoAutorizada && !!fotoUrl;
  return (
    <View style={{ width: 240, height: 426, backgroundColor: '#09070A', overflow: 'hidden' }}>
      {mostrarFoto ? (
        <Image source={{ uri: fotoUrl }} resizeMode="cover" style={{ position: 'absolute', width: 240, height: 426 }} />
      ) : (
        <View style={{ position: 'absolute', top: 100, left: 16, right: 16, height: 155, borderWidth: 1, borderColor: '#FF008A', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
          <Text style={{ color: '#FFFFFF', textAlign: 'center', fontFamily: 'Montserrat_700Bold', fontSize: 12 }}>FOTOGRAFÍA EDITORIAL</Text>
          <Text style={{ color: '#F3CEDD', textAlign: 'center', fontSize: 9, marginTop: 7 }}>Selecciona una imagen con derechos de uso autorizados</Text>
        </View>
      )}
      <LinearGradient colors={['rgba(0,0,0,0.78)', 'rgba(0,0,0,0.04)', 'rgba(0,0,0,0.90)', '#080609']}
        locations={[0, 0.30, 0.62, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none" />
      <View style={{ position: 'absolute', top: 16, left: 10, right: 10, alignItems: 'center' }}>
        <Text adjustsFontSizeToFit numberOfLines={1} style={{ width: 220, textAlign: 'center', fontFamily: 'Bauhaus93', fontSize: 47, color: '#FF008A', includeFontPadding: false }}>Pasarela</Text>
        <Text style={{ color: '#FFFFFF', fontFamily: 'Montserrat_700Bold', fontSize: 7, letterSpacing: 1.5, marginTop: 2 }}>STUDIO INTERNACIONAL</Text>
      </View>
      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 62 }}>
        <Text style={{ color: '#FF008A', fontFamily: 'Montserrat_700Bold', fontSize: 9, letterSpacing: 2, marginBottom: 9 }}>TENDENCIAS</Text>
        <Text adjustsFontSizeToFit numberOfLines={4} style={{ color: '#FFFFFF', fontFamily: 'Montserrat_900Black', fontSize: 23, lineHeight: 27 }}>
          ROJO ESCARLATA: EL COLOR QUE CONQUISTA EL OTOÑO
        </Text>
        <Text style={{ color: '#FFFFFF', fontFamily: 'Montserrat_400Regular', fontSize: 10, marginTop: 10 }}>Una declaración de estilo</Text>
      </View>
      <View style={{ position: 'absolute', bottom: 19, left: 16, right: 16, borderTopWidth: 1, borderTopColor: '#FF008A', paddingTop: 7 }}>
        <Text style={{ color: '#FFFFFF', fontFamily: 'Montserrat_400Regular', fontSize: 8 }}>pasarelastudiointer.com</Text>
      </View>
    </View>
  );
}

export default function Imagen() {
  const [fontsLoaded] = useFonts({
    Bauhaus93: require('../../assets/fonts/Bauhaus93.ttf'),
    Montserrat_400Regular,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
  });

  const [formatoActivo, setFormatoActivo] = useState(FORMATOS[1]);
  const [storyEditorial, setStoryEditorial] = useState(false);
  const [fotoEditorialAutorizada, setFotoEditorialAutorizada] = useState(false);
  const [titular, setTitular] = useState('SELECCIONA UNA NOTICIA');
  const [gancho, setGancho] = useState('');
  const [hero, setHero] = useState('EN EL FEED');
  const [scope, setScope] = useState('moda');
  const [imagenUrl, setImagenUrl] = useState('');
  const [pdpNumero, setPdpNumero] = useState('PDP-0001');
  const [cargandoTitulo, setCargandoTitulo] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  useFocusEffect(
    useCallback(() => {
      const cargarNoticia = async () => {
        try {
          const data = await AsyncStorage.getItem('noticiaActual');

          if (data) {
            const noticia = JSON.parse(data);

            setScope(noticia.scope || 'moda');
            setImagenUrl(noticia.imagen || '');
            setFotoEditorialAutorizada(false);
            setCargandoTitulo(true);

            try {
              const response = await fetch(`${SERVIDOR}/titulo-editorial`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo: noticia.titulo }),
              });

              const resultado = await response.json();

              if (resultado.titular && resultado.hero) {
                setTitular(resultado.titular);
                setHero(resultado.hero);
                setGancho(resultado.gancho || '');
              } else {
                const palabras = noticia.titulo.trim().split(' ');
                setTitular(palabras.slice(0, -2).join(' ').toUpperCase());
                setHero(palabras.slice(-2).join(' ').toUpperCase());
                setGancho('');
              }
            } catch {
              const palabras = noticia.titulo.trim().split(' ');
              setTitular(palabras.slice(0, -2).join(' ').toUpperCase());
              setHero(palabras.slice(-2).join(' ').toUpperCase());
            } finally {
              setCargandoTitulo(false);
            }
          }

          const n = await AsyncStorage.getItem('imagenesGeneradas');
          const num = n ? parseInt(n) + 1 : 1;
          setPdpNumero(`PDP-${String(num).padStart(4, '0')}`);
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
        const n = await AsyncStorage.getItem('imagenesGeneradas');
        const nuevo = (n ? parseInt(n) : 0) + 1;

        await AsyncStorage.setItem('imagenesGeneradas', String(nuevo));
        setPdpNumero(`PDP-${String(nuevo + 1).padStart(4, '0')}`);
        await MediaLibrary.saveToLibraryAsync(uri);

        Alert.alert('✓ Guardada', `${pdpNumero} guardada en galería.`);
      }
    } catch {
      Alert.alert('Error', 'No se pudo guardar la imagen.');
    }
  };

  const compartirImagen = async () => {
    try {
      const uri = await viewShotRef.current?.capture?.();

      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png' });
      }
    } catch {
      Alert.alert('Error', 'No se pudo compartir.');
    }
  };

  const compartirEnApp = async (app: string) => {
    try {
      const uri = await viewShotRef.current?.capture?.();

      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `Compartir en ${app}`,
        });
      }
    } catch {
      Alert.alert('Error', 'No se pudo compartir.');
    }
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.secLabel}>Formato</Text>

      <View style={styles.formatoRow}>
        {FORMATOS.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.formatoChip, formatoActivo.id === f.id && styles.formatoChipActivo]}
            onPress={() => setFormatoActivo(f)}
          >
            <Text style={[styles.formatoLabel, formatoActivo.id === f.id && styles.formatoLabelActivo]}>
              {f.label}
            </Text>
            <Text style={[styles.formatoSub, formatoActivo.id === f.id && styles.formatoSubActivo]}>
              {f.sub}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {formatoActivo.id === 'story' && (
        <TouchableOpacity
          style={[styles.formatoChip, storyEditorial && styles.formatoChipActivo, { alignSelf: 'center', marginBottom: 12, paddingHorizontal: 18 }]}
          onPress={() => setStoryEditorial(v => !v)}
          accessibilityRole="button"
          accessibilityLabel="Alternar vista de Story editorial de prueba"
        >
          <Text style={[styles.formatoLabel, storyEditorial && styles.formatoLabelActivo]}>
            {storyEditorial ? '✓ Story editorial · Rojo escarlata' : 'Probar Story editorial · Rojo escarlata'}
          </Text>
        </TouchableOpacity>
      )}

      {formatoActivo.id === 'story' && storyEditorial && !!imagenUrl && (
        <TouchableOpacity onPress={() => setFotoEditorialAutorizada(v => !v)} style={{ alignSelf: 'center', marginBottom: 12, padding: 10 }} accessibilityRole="checkbox" accessibilityState={{ checked: fotoEditorialAutorizada }}>
          <Text style={{ color: '#FFFFFF', fontSize: 12 }}>
            {fotoEditorialAutorizada ? '☑' : '☐'} Confirmo que tengo derechos para usar esta fotografía
          </Text>
        </TouchableOpacity>
      )}

      {cargandoTitulo && (
        <Text style={{ color: '#FF1493', fontSize: 10, textAlign: 'center', marginBottom: 8 }}>
          ✦ Generando titular editorial...
        </Text>
      )}

      <Text style={styles.secLabel}>Vista previa</Text>

      <View style={styles.previewContainer}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
          {formatoActivo.id === 'story' && storyEditorial ? <PortadaEditorialStory fotoUrl={imagenUrl} fotoAutorizada={fotoEditorialAutorizada} /> : <TarjetaNoticia
            titular={titular}
            gancho={gancho}
            hero={hero}
            scope={scope}
            imagenUrl={imagenUrl}
            formato={formatoActivo}
            pdpNumero={pdpNumero}
          />}
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

        <TouchableOpacity
          style={[styles.accionBtn, { borderColor: '#C13584' }]}
          onPress={() => compartirEnApp('Instagram')}
        >
          <Ionicons name="logo-instagram" size={18} color="#C13584" />
          <Text style={[styles.accionText, { color: '#C13584' }]}>Instagram</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.accionBtn, { borderColor: '#25D366' }]}
          onPress={() => compartirEnApp('WhatsApp')}
        >
          <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
          <Text style={[styles.accionText, { color: '#25D366' }]}>WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0A0B', padding: 12 },
  secLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#C4826A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  formatoRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  formatoChip: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#7B2D3E55',
    backgroundColor: '#1E1519',
    alignItems: 'center',
  },
  formatoChipActivo: { backgroundColor: '#C9A66B', borderColor: '#C9A66B' },
  formatoLabel: { fontSize: 13, fontWeight: '500', color: '#C4826A' },
  formatoLabelActivo: { color: '#0D0A0B' },
  formatoSub: { fontSize: 10, color: '#C4826A', marginTop: 2 },
  formatoSubActivo: { color: '#0D0A0B' },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#1E1519',
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#7B2D3E55',
  },
  accionesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  accionBtn: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C9A66B',
    backgroundColor: '#1E1519',
  },
  accionText: { fontSize: 12, fontWeight: '500', color: '#C9A66B' },
});