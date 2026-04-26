
import React, { useEffect } from 'react';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';


interface ParticleProps {
  x: number;
  y: number;
  color: string;
  size: number;
  onComplete: () => void;
}

const ExplosionParticle: React.FC<ParticleProps> = ({ x, y, color, size, onComplete }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);


  const angle = Math.random() * Math.PI * 2; 
  const dist = size * (2 + Math.random() * 3); 
  const targetX = Math.cos(angle) * dist;
  const targetY = Math.sin(angle) * dist;

  useEffect(() => {

    translateX.value = withTiming(targetX, { duration: 400, easing: Easing.out(Easing.quad) });
    translateY.value = withTiming(targetY, { duration: 400, easing: Easing.out(Easing.quad) });
    scale.value = withTiming(0.2, { duration: 400 }); 
    opacity.value = withTiming(0, { duration: 400 }, (finished) => {
   
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x - 5, 
          top: y - 5,
          width: 10, 
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          zIndex: 100, 
        },
        animatedStyle,
      ]}
    />
  );
};

export default ExplosionParticle;