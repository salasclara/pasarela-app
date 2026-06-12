import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

function LogoPS({ size = 80 }: { size?: number }) {
  const r = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G transform={`translate(${r}, ${r})`}>
        <Circle cx="0" cy="0" r={r - 1} fill="#0D0A0B" />
        <Circle cx="0" cy="0" r={r - 6} fill="#0D0A0B" stroke="#C9A66B" strokeWidth="1.5" />
        <Circle cx="0" cy="0" r={r - 10} fill="#0D0A0B" stroke="#7B2D3E" strokeWidth="0.5" />
        <SvgText x="0" y="4" textAnchor="middle" fontSize={r * 0.72} fontWeight="700" fill="#C9A66B" fontFamily="serif">PS</SvgText>
      </G>
    </Svg>
  );
}

export default function Perfil() {
  const [stats, setStats] = useState({
    relatosRedactados: 0,
    estaSemana: 0,
    noticiasResumidas: 0,
    imagenesGeneradas: 0,
  });

  useFocusEffect(
    useCallback(() => {
      const cargar = async () => {
        try {
          const relatosStr = await AsyncStorage.getItem('relatosGuardados');
          const relatos = relatosStr ? JSON.parse(relatosStr) : [];
          const ahora = new Date();
          const inicioSemana = new Date(ahora);
          inicioSemana.setDate(ahora.getDate() - 7);
          const estaSemana = relatos.filter((r: any) => {
            try {
              const fecha = new Date(parseInt(r.id));
              return fecha >= inicioSemana;
            } catch { return false; }
          }).length;
          const imagenesStr = await AsyncStorage.getItem('imagenesGeneradas');
          const imagenes = imagenesStr ? parseInt(imagenesStr) : 0;
          const resumenesStr = await AsyncStorage.getItem('noticiasResumidas');
          const resumenes = resumenesStr ? parseInt(resumenesStr) : 0;
          setStats({
            relatosRedactados: relatos.length,
            estaSemana,
            noticiasResumidas: resumenes,
            imagenesGeneradas: imagenes,
          });
        } catch (e) {
          console.error(e);
        }
      };
      cargar();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <LogoPS size={72} />
        <View style={styles.profileInfo}>
          <Text style={styles.nombre}>Pasarela Studio Internacional</Text>
          <Text style={styles.cargo}>Escuela de Modelaje · Dallas, TX</Text>
          <Text style={styles.slogan}>Donde el talento se convierte en arte</Text>
        </View>
      </View>

      <Text style={styles.seccion}>Estadísticas</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{stats.relatosRedactados}</Text>
          <Text style={styles.statLabel}>Artículos redactados</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{stats.estaSemana}</Text>
          <Text style={styles.statLabel}>Esta semana</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{stats.noticiasResumidas}</Text>
          <Text style={styles.statLabel}>Noticias resumidas</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{stats.imagenesGeneradas}</Text>
          <Text style={styles.statLabel}>Imágenes generadas</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Fuentes activas</Text>
        <Text style={styles.infoVal}>20 medios</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Cobertura</Text>
        <Text style={styles.infoVal}>Moda · Belleza · Talento · Dallas</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Redes conectadas</Text>
        <View style={styles.iconRow}>
          <Ionicons name="logo-instagram" size={18} color="#C13584" />
          <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
          <Ionicons name="logo-facebook" size={18} color="#1877F2" />
        </View>
      </View>

      <Text style={styles.seccion}>Canal de WhatsApp</Text>
      <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('https://wa.me/19545164107')}>
        <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Únete a la comunidad</Text>
          <Text style={styles.contactVal}>Canal oficial de Pasarela Studio</Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color="#C4826A" />
      </TouchableOpacity>

      <Text style={styles.seccion}>Contacto</Text>

      <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('mailto:info@pasarelastudiointer.com')}>
        <Ionicons name="mail-outline" size={18} color="#C9A66B" />
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Correo electrónico</Text>
          <Text style={styles.contactVal}>info@pasarelastudiointer.com</Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color="#C4826A" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('https://wa.me/19545164107')}>
        <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>WhatsApp</Text>
          <Text style={styles.contactVal}>(954) 516-4107</Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color="#C4826A" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('https://pasarelastudiointer.com')}>
        <Ionicons name="globe-outline" size={18} color="#C9A66B" />
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Sitio web</Text>
          <Text style={styles.contactVal}>pasarelastudiointer.com</Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color="#C4826A" />
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0A0B', padding: 12 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#1E1519', borderRadius: 12, padding: 14,
    borderWidth: 0.5, borderColor: '#7B2D3E55', marginBottom: 16,
  },
  profileInfo: { flex: 1 },
  nombre: { fontSize: 15, fontWeight: '500', color: '#E8C5B0' },
  cargo: { fontSize: 12, color: '#C4826A', marginTop: 2 },
  slogan: { fontSize: 11, color: '#C9A66B', marginTop: 2, fontStyle: 'italic' },
  seccion: { fontSize: 11, fontWeight: '500', color: '#C4826A', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  statCard: {
    width: '47%', backgroundColor: '#1E1519', borderRadius: 10,
    padding: 12, alignItems: 'center', borderWidth: 0.5, borderColor: '#7B2D3E55',
  },
  statNum: { fontSize: 24, fontWeight: '500', color: '#C9A66B' },
  statLabel: { fontSize: 11, color: '#C4826A', marginTop: 2, textAlign: 'center' },
  infoCard: {
    backgroundColor: '#1E1519', borderRadius: 10, padding: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 0.5, borderColor: '#7B2D3E55', marginBottom: 8,
  },
  infoLabel: { fontSize: 12, fontWeight: '500', color: '#E8C5B0' },
  infoVal: { fontSize: 12, color: '#C9A66B', fontWeight: '500' },
  iconRow: { flexDirection: 'row', gap: 10 },
  contactCard: {
    backgroundColor: '#1E1519', borderRadius: 10, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 0.5, borderColor: '#7B2D3E55', marginBottom: 8,
  },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 11, color: '#C4826A' },
  contactVal: { fontSize: 12, fontWeight: '500', color: '#E8C5B0', marginTop: 1 },
});