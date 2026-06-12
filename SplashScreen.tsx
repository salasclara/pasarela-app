import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const SIZE = Math.min(width * 0.6, 220);

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish());
  }, []);

  const r = SIZE / 2;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity, transform: [{ scale }] }]}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <G transform={`translate(${r}, ${r})`}>
            <Circle cx="0" cy="0" r={r - 2} fill="#0D0A0B" />
            <Circle cx="0" cy="0" r={r - 10} fill="#0D0A0B" stroke="#C9A66B" strokeWidth="2" />
            <Circle cx="0" cy="0" r={r - 16} fill="#0D0A0B" stroke="#7B2D3E" strokeWidth="0.5" />
            <SvgText
              x="0" y="4"
              textAnchor="middle"
              fontSize={r * 0.72}
              fontWeight="700"
              fill="#C9A66B"
              fontFamily="serif"
            >PS</SvgText>
            <SvgText
              x="0" y={r * 0.52}
              textAnchor="middle"
              fontSize={r * 0.1}
              fill="#E8C5B0"
              fontFamily="serif"
              letterSpacing="1"
            >Pasarela Studio</SvgText>
          </G>
        </Svg>
        <Text style={styles.nombre}>Pasarela Studio Internacional</Text>
        <Text style={styles.slogan}>Donde el talento se convierte en arte</Text>
        <Text style={styles.cobertura}>Moda · Belleza · Talento · Dallas TX</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0A0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  nombre: {
    fontSize: 16,
    color: '#E8C5B0',
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 8,
    textAlign: 'center',
  },
  slogan: {
    fontSize: 13,
    color: '#C9A66B',
    fontStyle: 'italic',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  cobertura: {
    fontSize: 11,
    color: '#C4826A',
    letterSpacing: 2,
  },
});