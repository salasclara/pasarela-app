import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';

function LogoRM({ size = 80 }: { size?: number }) {
  const r = size / 2;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <G transform={`translate(${r}, ${r})`}>
        <Circle cx="0" cy="0" r={r - 1} fill="#0c0b0a" />
        <Circle cx="0" cy="0" r={r - 6} fill="#0c0b0a" stroke="#c9973a" strokeWidth="1.5" />
        <Circle cx="0" cy="0" r={r - 10} fill="#0c0b0a" stroke="#c9973a" strokeWidth="0.5" />
        <SvgText x="0" y="4" textAnchor="middle" fontSize={r * 0.72} fontWeight="700" fill="#c9973a" fontFamily="serif">RM</SvgText>
        <Line x1={-r * 0.6} y1={r * 0.28} x2={r * 0.6} y2={r * 0.28} stroke="#c9973a" strokeWidth="1" />
        <Line x1={-r * 0.6} y1={r * 0.33} x2={r * 0.6} y2={r * 0.33} stroke="#1a5276" strokeWidth="0.75" />
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
          console.log('STATS:', { relatos: relatos.length, estaSemana, imagenes, resumenes });

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
        <LogoRM size={72} />
        <View style={styles.profileInfo}>
          <Text style={styles.nombre}>Rocimar Morales</Text>
          <Text style={styles.cargo}>Periodista · Cabimas, Zulia</Text>
          <Text style={styles.slogan}>La voz de la zona petrolera</Text>
        </View>
      </View>

      <Text style={styles.seccion}>Estadísticas</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{stats.relatosRedactados}</Text>
          <Text style={styles.statLabel}>Relatos redactados</Text>
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
        <Text style={styles.infoVal}>29 medios</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Cobertura</Text>
        <Text style={styles.infoVal}>Cabimas · Venezuela · Internacional</Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Redes conectadas</Text>
        <View style={styles.iconRow}>
          <Ionicons name="logo-instagram" size={18} color="#C13584" />
          <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
          <Ionicons name="logo-twitter" size={18} color="#1DA1F2" />
        </View>
      </View>

      <Text style={styles.seccion}>Canal de WhatsApp</Text>
      <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('https://whatsapp.com/channel/0029VaCr6fkK0IBmSADPtV04')}>
        <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Únete a la comunidad</Text>
          <Text style={styles.contactVal}>Canal oficial de Rocimar Morales</Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color="#6b6560" />
      </TouchableOpacity>
    <Text style={styles.seccion}>Contacto</Text>

      <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('mailto:contacto@rocimarmorales.com')}>
        <Ionicons name="mail-outline" size={18} color="#a87c2e" />
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Correo electrónico</Text>
          <Text style={styles.contactVal}>contacto@rocimarmorales.com</Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color="#6b6560" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('https://wa.me/584141675017')}>
        <Ionicons name="logo-whatsapp" size={18} color="#25D366" />
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>WhatsApp</Text>
          <Text style={styles.contactVal}>+58 414 167 5017</Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color="#6b6560" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('https://rocimarmorales.com/#contacto')}>
        <Ionicons name="globe-outline" size={18} color="#a87c2e" />
        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Sitio web</Text>
          <Text style={styles.contactVal}>rocimarmorales.com</Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color="#6b6560" />
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f3ee', padding: 12 },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderWidth: 0.5, borderColor: '#d8d3cb', marginBottom: 16,
  },
  profileInfo: { flex: 1 },
  nombre: { fontSize: 15, fontWeight: '500', color: '#0c0b0a' },
  cargo: { fontSize: 12, color: '#6b6560', marginTop: 2 },
  slogan: { fontSize: 11, color: '#a87c2e', marginTop: 2, fontWeight: '500' },
  seccion: { fontSize: 11, fontWeight: '500', color: '#6b6560', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  statCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 10,
    padding: 12, alignItems: 'center', borderWidth: 0.5, borderColor: '#d8d3cb',
  },
  statNum: { fontSize: 24, fontWeight: '500', color: '#a87c2e' },
  statLabel: { fontSize: 11, color: '#6b6560', marginTop: 2, textAlign: 'center' },
  infoCard: {
    backgroundColor: '#fff', borderRadius: 10, padding: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 0.5, borderColor: '#d8d3cb', marginBottom: 8,
  },
  infoLabel: { fontSize: 12, fontWeight: '500', color: '#0c0b0a' },
  infoVal: { fontSize: 12, color: '#a87c2e', fontWeight: '500' },
  iconRow: { flexDirection: 'row', gap: 10 },
  contactCard: {
    backgroundColor: '#fff', borderRadius: 10, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 0.5, borderColor: '#d8d3cb', marginBottom: 8,
  },
  contactInfo: { flex: 1 },
  contactLabel: { fontSize: 11, color: '#6b6560' },
  contactVal: { fontSize: 12, fontWeight: '500', color: '#0c0b0a', marginTop: 1 },
});