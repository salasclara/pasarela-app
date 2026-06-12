import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Clipboard from 'expo-clipboard';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, RefreshControl, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



const CATEGORIAS = ['Moda', 'Belleza', 'Talento', 'Entretenimiento', 'Dallas', 'Lifestyle'];
const COBERTURAS = ['Todos', 'Moda', 'Belleza', 'Talento', 'Dallas'];
const SERVER = 'https://pasarela-servidor-production.up.railway.app';
const BLOGGER_ID = '9121658512411797134';

const scopeColor: Record<string, { bg: string; text: string }> = {
  Cabimas:       { bg: '#FEF3CD', text: '#7B5200' },
  Venezuela:     { bg: '#D6EAF8', text: '#154360' },
  Internacional: { bg: '#E8F8F5', text: '#1A5276' },
};

type Noticia = {
  id: string;
  titulo: string;
  descripcion: string;
  fuente: string;
  scope: string;
  cat: string;
  link: string;
  tiempo: string;
  imagen: string;
};

async function llamarClaude(prompt: string): Promise<string> {
  const resp = await fetch(`${SERVER}/claude`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error);
  return data.texto;
}

export default function Feed() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [cargandoNoticias, setCargandoNoticias] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [catActiva, setCatActiva] = useState('Acontecer');
  const [scopeActivo, setScopeActivo] = useState('Todos');
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState<Noticia | null>(null);
  const [tono, setTono] = useState('informativo');
  const [resumen, setResumen] = useState('');
  const [relato, setRelato] = useState('');
  const [cargandoResumen, setCargandoResumen] = useState(false);
  const [cargandoRelato, setCargandoRelato] = useState(false);
  const [publicandoBlog, setPublicandoBlog] = useState(false);
  const [pantalla, setPantalla] = useState<'feed' | 'resumen' | 'relato'>('feed');

  const cargarNoticias = useCallback(async () => {
    try {
      const resp = await fetch(`${SERVER}/noticias`);
      const data = await resp.json();
      setNoticias(data.noticias || []);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar las noticias. Verifica tu conexión.');
    }
    setCargandoNoticias(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { cargarNoticias(); }, []);

  const onRefresh = () => { setRefreshing(true); cargarNoticias(); };

  const noticiasFiltradas = noticias.filter(n =>
    n.cat === catActiva && (scopeActivo === 'Todos' || n.scope === scopeActivo)
  );

  const abrirResumen = async (noticia: Noticia) => {
    setNoticiaSeleccionada(noticia);
    await AsyncStorage.setItem('noticiaActual', JSON.stringify(noticia));
    setResumen('');
    setRelato('');
    setTono('informativo');
    setPantalla('resumen');
    setCargandoResumen(true);
    try {
      const prompt = `Eres un asistente de noticias. Resume la siguiente noticia en 3-4 líneas en español neutro y directo. Usa la información disponible. Si la descripción es breve, amplía con lo que puedas inferir del título y la fuente, pero NO inventes nombres, fechas ni lugares específicos que no estén mencionados.\n\nTítulo: ${noticia.titulo}\nDescripción: ${noticia.descripcion}\nFuente: ${noticia.fuente}`;
      const resultado = await llamarClaude(prompt);
      setResumen(resultado);
    } catch (e) {
      Alert.alert('Error', String(e));
    }
    const resumenesStr = await AsyncStorage.getItem('noticiasResumidas');
    const resumenes = resumenesStr ? parseInt(resumenesStr) + 1 : 1;
    await AsyncStorage.setItem('noticiasResumidas', resumenes.toString());
    setCargandoResumen(false);
  };

  const generarRelato = async () => {
    if (!noticiaSeleccionada) return;
    setRelato('');
    setCargandoRelato(true);
    setPantalla('relato');
    try {
      const instrucciones: Record<string, string> = {
  informativo: 'Redacta un artículo editorial...',
  analitico:   'Redacta un artículo editorial analítico...',
  narrativo:   'Redacta un artículo editorial con la voz...',
};
      const prompt = `${instrucciones[tono as keyof typeof instrucciones]}\n\nTítulo: ${noticiaSeleccionada.titulo}\nDescripción: ${noticiaSeleccionada.descripcion}\nFuente: ${noticiaSeleccionada.fuente}`;
      const resultado = await llamarClaude(prompt);
      setRelato(resultado);
      const nuevoRelato = {
        id: Date.now().toString(),
        titulo: noticiaSeleccionada.titulo,
        relato: resultado,
        categoria: noticiaSeleccionada.cat,
        scope: noticiaSeleccionada.scope,
        tono,
        fecha: new Date().toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' }),
      };
      const guardadosStr = await AsyncStorage.getItem('relatosGuardados');
      const guardadosArr = guardadosStr ? JSON.parse(guardadosStr) : [];
      guardadosArr.unshift(nuevoRelato);
      await AsyncStorage.setItem('relatosGuardados', JSON.stringify(guardadosArr.slice(0, 50)));
    } catch (e) {
      Alert.alert('Error', 'No se pudo generar el relato. Verifica tu conexión.');
    }
    setCargandoRelato(false);
  };

  const publicarEnBlog = async () => {
  if (!relato || !noticiaSeleccionada) return;
  setPublicandoBlog(true);
  try {
    const resp = await fetch(`${SERVER}/publicar-blog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: noticiaSeleccionada.titulo,
        contenido: relato,
        categoria: noticiaSeleccionada.cat,
        scope: noticiaSeleccionada.scope,
        fuente: noticiaSeleccionada.fuente,
        link: noticiaSeleccionada.link,
      }),
    });
    const data = await resp.json();
    if (data.url) {
      Alert.alert(
        '✅ Publicado en Blog',
        'El relato se publicó exitosamente.',
        [
          { text: 'Ver publicación', onPress: () => Linking.openURL(data.url) },
          { text: 'Cerrar', style: 'cancel' },
        ]
      );
    } else {
      Alert.alert('Error al publicar', data.error || 'Error desconocido');
    }
  } catch (e: any) {
    Alert.alert('Error', e?.message || 'No se pudo publicar en el blog.');
  }
  setPublicandoBlog(false);
};

      

  const copiarTexto = async () => {
    if (!relato) return;
    await Clipboard.setStringAsync(relato);
    Alert.alert('✓ Copiado', 'El relato se copió al portapapeles.');
  };

  const compartirPor = async (app: string) => {
    if (!relato) return;
    const mensaje = `${noticiaSeleccionada?.titulo}\n\n${relato}\n\n— Pasarela Studio Internacional | Moda · Belleza · Talento`
    const texto = encodeURIComponent(mensaje);
    const deepLinks: Record<string, string> = {
      WhatsApp: `https://wa.me/?text=${texto}`,
      Telegram: `https://t.me/share/url?url=&text=${texto}`,
      Twitter:  `https://twitter.com/intent/tweet?text=${texto}`,
    };
    if (app === 'Instagram') {
      await Clipboard.setStringAsync(mensaje);
      Alert.alert('📋 Texto copiado', 'Abre Instagram y pega el texto en tu publicación o historia.');
      return;
    }
    const url = deepLinks[app];
    if (url) await Linking.openURL(url);
  };

  const compartirTexto = async () => {
    if (!relato) return;
    try {
      await Share.share({
        message: `${noticiaSeleccionada?.titulo}\n\n${relato}\n\n— Rocimar Morales | La voz de la zona petrolera`,
      });
    } catch (e) {
      Alert.alert('Error', 'No se pudo compartir.');
    }
  };

  // ── PANTALLA RELATO ──
  if (pantalla === 'relato' && noticiaSeleccionada) {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setPantalla('resumen')}>
          <Ionicons name="arrow-back" size={18} color="#0c0b0a" />
          <Text style={styles.backText}>Volver al resumen</Text>
        </TouchableOpacity>
        <View style={styles.seccionRow}>
          <Text style={styles.secLabel}>Relato redactado</Text>
          <View style={styles.tonoBadge}>
            <Text style={styles.tonoBadgeText}>{tono.charAt(0).toUpperCase() + tono.slice(1)}</Text>
          </View>
        </View>
        <View style={styles.contentBox}>
          {cargandoRelato ? (
            <>
              <ActivityIndicator color="#c9973a" style={{ margin: 20 }} />
              <Text style={styles.cargandoText}>Claude está redactando tu relato...</Text>
            </>
          ) : (
            <Text style={styles.contentText}>{relato}</Text>
          )}
        </View>
        {!cargandoRelato && (
          <>
            <TouchableOpacity
              style={[styles.blogBtn, publicandoBlog && { opacity: 0.6 }]}
              onPress={publicarEnBlog}
              disabled={publicandoBlog}
            >
              {publicandoBlog ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="globe-outline" size={16} color="#fff" />
              )}
              <Text style={styles.blogBtnText}>
                {publicandoBlog ? 'Publicando...' : 'Publicar en Blog'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.secLabel}>Compartir</Text>
            <View style={styles.shareGrid}>
              {[
                { label: 'Instagram', icon: 'logo-instagram', color: '#C13584' },
                { label: 'WhatsApp',  icon: 'logo-whatsapp',  color: '#25D366' },
                { label: 'Twitter',   icon: 'logo-twitter',   color: '#1DA1F2' },
                { label: 'Telegram',  icon: 'paper-plane-outline', color: '#0088cc' },
              ].map(s => (
                <TouchableOpacity key={s.label} style={styles.shareBtn} onPress={() => compartirPor(s.label)}>
                  <Ionicons name={s.icon as any} size={16} color={s.color} />
                  <Text style={[styles.shareBtnText, { color: s.color }]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={[styles.shareBtn, styles.shareFull]} onPress={copiarTexto}>
                <Ionicons name="copy-outline" size={16} color="#1a5276" />
                <Text style={[styles.shareBtnText, { color: '#1a5276' }]}>Copiar texto</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    );
  }

  // ── PANTALLA RESUMEN ──
  if (pantalla === 'resumen' && noticiaSeleccionada) {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setPantalla('feed')}>
          <Ionicons name="arrow-back" size={18} color="#0c0b0a" />
          <Text style={styles.backText}>Volver al feed</Text>
        </TouchableOpacity>
        <View style={styles.origTitle}>
          <Text style={styles.origTitleText}>{noticiaSeleccionada.titulo}</Text>
          <View style={styles.fuenteRow}>
            <Ionicons name="newspaper-outline" size={11} color="#6b6560" />
            <Text style={styles.fuenteOrig}>Fuente: {noticiaSeleccionada.fuente}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(noticiaSeleccionada.link)}>
              <Text style={styles.fuenteLink}>Ver original →</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.secLabel}>Resumen con IA</Text>
        <View style={styles.contentBox}>
          {cargandoResumen ? (
            <>
              <ActivityIndicator color="#c9973a" style={{ margin: 20 }} />
              <Text style={styles.cargandoText}>Claude está resumiendo la noticia...</Text>
            </>
          ) : (
            <Text style={styles.contentText}>{resumen}</Text>
          )}
        </View>
        {!cargandoResumen && (
          <>
            <Text style={styles.secLabel}>Tono del relato</Text>
            <View style={styles.tonoRow}>
              {['informativo', 'analitico', 'narrativo'].map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tonoChip, tono === t && styles.tonoChipActivo]}
                  onPress={() => setTono(t)}
                >
                  <Text style={[styles.tonoChipText, tono === t && styles.tonoChipTextActivo]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.primaryBtn} onPress={generarRelato}>
              <Ionicons name="pencil-outline" size={16} color="#0c0b0a" />
              <Text style={styles.primaryBtnText}>Redactar relato completo</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    );
  }

  // ── PANTALLA FEED ──
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catsBar}>
        {CATEGORIAS.map(cat => (
          <TouchableOpacity key={cat} style={[styles.catBtn, catActiva === cat && styles.catBtnActivo]} onPress={() => setCatActiva(cat)}>
            <Text style={[styles.catText, catActiva === cat && styles.catTextActivo]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scopeBar}>
        {COBERTURAS.map(s => (
          <TouchableOpacity key={s} style={[styles.scopePill, scopeActivo === s && styles.scopePillActivo]} onPress={() => setScopeActivo(s)}>
            <Text style={[styles.scopeText, scopeActivo === s && styles.scopeTextActivo]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {cargandoNoticias ? (
        <View style={styles.cargandoContainer}>
          <ActivityIndicator color="#c9973a" size="large" />
          <Text style={styles.cargandoText}>Cargando noticias...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.lista}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#c9973a" />}
        >
          {noticiasFiltradas.length === 0 ? (
            <Text style={styles.vacio}>No hay noticias en esta sección{'\n'}Desliza hacia abajo para actualizar</Text>
          ) : (
            noticiasFiltradas.map(n => (
              <TouchableOpacity key={n.id} style={styles.card} onPress={() => abrirResumen(n)}>
                <View style={styles.cardMeta}>
                  <View style={[styles.scopeTag, { backgroundColor: scopeColor[n.scope]?.bg || '#f6f3ee' }]}>
                    <Text style={[styles.scopeTagText, { color: scopeColor[n.scope]?.text || '#0c0b0a' }]}>{n.scope}</Text>
                  </View>
                  <Text style={styles.fuente}>{n.fuente}</Text>
                </View>
                <Text style={styles.cardTitulo}>{n.titulo}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.tiempo}>{n.tiempo}</Text>
                  <TouchableOpacity style={styles.aiBtn} onPress={() => abrirResumen(n)}>
                    <Ionicons name="sparkles-outline" size={11} color="#a87c2e" />
                    <Text style={styles.aiBtnText}>Resumir con IA</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

container:          { flex: 1, backgroundColor: '#0D0A0B' },
catsBar:            { backgroundColor: '#7B2D3E', flexGrow: 0 },
catBtn:             { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
catBtnActivo:       { borderBottomColor: '#C9A66B' },
catText:            { fontSize: 12, color: 'rgba(232,197,176,0.55)' },
catTextActivo:      { color: '#E8C5B0', fontWeight: '500' },
scopeBar:           { backgroundColor: '#0D0A0B', flexGrow: 0, borderBottomWidth: 0.5, borderBottomColor: '#7B2D3E', paddingHorizontal: 10, paddingVertical: 8 },
scopePill:          { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#C4826A44', marginRight: 6 },
scopePillActivo:    { backgroundColor: '#7B2D3E', borderColor: '#7B2D3E' },
scopeText:          { fontSize: 11, color: '#C4826A' },
scopeTextActivo:    { color: '#E8C5B0' },
lista:              { padding: 12 },
cargandoContainer:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
vacio:              { fontSize: 13, color: '#C4826A', textAlign: 'center', marginTop: 40, lineHeight: 22 },
card:               { backgroundColor: '#1E1519', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 0.5, borderColor: '#7B2D3E55' },
cardMeta:           { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
scopeTag:           { borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2, backgroundColor: '#7B2D3E22' },
scopeTagText:       { fontSize: 10, fontWeight: '500', color: '#C9A66B' },
fuente:             { fontSize: 10, color: '#C4826A' },
cardTitulo:         { fontSize: 13, fontWeight: '500', color: '#E8C5B0', lineHeight: 19, marginBottom: 8 },
cardFooter:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
tiempo:             { fontSize: 10, color: '#C4826A' },
aiBtn:              { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#C9A66B', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
aiBtnText:          { fontSize: 10, color: '#C9A66B', fontWeight: '500' },
backBtn:            { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12 },
backText:           { fontSize: 13, color: '#E8C5B0', fontWeight: '500' },
origTitle:          { margin: 12, backgroundColor: '#1E1519', borderRadius: 8, padding: 12, borderLeftWidth: 3, borderLeftColor: '#C9A66B' },
origTitleText:      { fontSize: 13, fontWeight: '500', color: '#E8C5B0', lineHeight: 20 },
secLabel:           { fontSize: 10, fontWeight: '500', color: '#C4826A', textTransform: 'uppercase', letterSpacing: 0.8, marginHorizontal: 12, marginBottom: 6, marginTop: 4 },
seccionRow:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 12, marginBottom: 6, marginTop: 4 },
contentBox:         { backgroundColor: '#1E1519', borderRadius: 10, margin: 12, padding: 12, borderWidth: 0.5, borderColor: '#7B2D3E55', minHeight: 80, alignItems: 'center' },
contentText:        { fontSize: 13, color: '#E8C5B0', lineHeight: 21, alignSelf: 'stretch' },
cargandoText:       { fontSize: 12, color: '#C4826A', marginTop: 8, marginBottom: 12 },
tonoRow:            { flexDirection: 'row', gap: 8, marginHorizontal: 12, marginBottom: 14 },
tonoChip:           { flex: 1, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#7B2D3E55', backgroundColor: '#1E1519', alignItems: 'center' },
tonoChipActivo:     { backgroundColor: '#7B2D3E', borderColor: '#7B2D3E' },
tonoChipText:       { fontSize: 12, color: '#C4826A' },
tonoChipTextActivo: { color: '#E8C5B0', fontWeight: '500' },
primaryBtn:         { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#C9A66B', borderRadius: 10, padding: 13, margin: 12 },
primaryBtnText:     { fontSize: 13, fontWeight: '500', color: '#0D0A0B' },
tonoBadge:          { backgroundColor: '#C9A66B', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 2 },
tonoBadgeText:      { fontSize: 10, fontWeight: '500', color: '#0D0A0B' },
shareGrid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 8, margin: 12 },
shareBtn:           { width: '47%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#7B2D3E55', backgroundColor: '#1E1519' },
shareFull:          { width: '100%' },
shareBtnText:       { fontSize: 12, fontWeight: '500' },
fuenteRow:          { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6, flexWrap: 'wrap' },
fuenteOrig:         { fontSize: 10, color: '#C4826A' },
fuenteLink:         { fontSize: 10, color: '#C9A66B', fontWeight: '500' },
blogBtn:            { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#7B2D3E', borderRadius: 10, padding: 13, margin: 12, marginBottom: 4 },
blogBtnText:        { fontSize: 13, fontWeight: '500', color: '#E8C5B0' },