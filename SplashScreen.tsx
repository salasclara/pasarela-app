import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Line, Text as SvgText } from 'react-native-svg';

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
            <Circle cx="0" cy="0" r={r - 2} fill="#0c0b0a" />
            <Circle cx="0" cy="0" r={r - 10} fill="#0c0b0a" stroke="#c9973a" strokeWidth="2" />
            <Circle cx="0" cy="0" r={r - 16} fill="#0c0b0a" stroke="#c9973a" strokeWidth="0.5" />
            <SvgText
              x="0" y="4"
              textAnchor="middle"
              fontSize={r * 0.72}
              fontWeight="700"
              fill="#c9973a"
              fontFamily="serif"
            >RM</SvgText>
            <Line x1={-r * 0.65} y1={r * 0.28} x2={r * 0.65} y2={r * 0.28} stroke="#c9973a" strokeWidth="1.5" />
            <Line x1={-r * 0.65} y1={r * 0.33} x2={r * 0.65} y2={r * 0.33} stroke="#1a5276" strokeWidth="1" />
            <SvgText
              x="0" y={r * 0.52}
              textAnchor="middle"
              fontSize={r * 0.1}
              fill="#f6f3ee"
              fontFamily="serif"
              letterSpacing="1"
            >Rocimar Morales</SvgText>
          </G>
        </Svg>
        <Text style={styles.slogan}>La voz de la zona petrolera</Text>
        <Text style={styles.cobertura}>Cabimas · Venezuela · Internacional</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0b0a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  slogan: {
    fontSize: 14,
    color: '#c9973a',
    fontWeight: '500',
    letterSpacing: 1,
    marginTop: 8,
  },
  cobertura: {
    fontSize: 11,
    color: '#6b6560',
    letterSpacing: 2,
  },
});