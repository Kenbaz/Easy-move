import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  Easing,
} from "react-native-reanimated";

interface AnimatedItemProps {
  id: string;
  itemId: string;
  title: string;
  image: any;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onAnimationComplete?: () => void;
  isRemoving?: boolean;
}

const AnimatedItemComponent: React.FC<AnimatedItemProps> = ({
  id,
  itemId,
  title,
  image,
  startPosition,
  endPosition,
  onAnimationComplete,
  isRemoving = false,
}) => {
  const translateX = useSharedValue(startPosition.x);
  const translateY = useSharedValue(startPosition.y);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isRemoving) {
      // Animate back to original position
      opacity.value = withTiming(0, { duration: 300 });
      scale.value = withTiming(0.5, { duration: 300 });
      translateY.value = withSpring(startPosition.y - 50, {
        damping: 15,
        stiffness: 100,
      });

      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 300);
      }
    } else {
      // Drop animation
      scale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withSpring(0.8, { damping: 10, stiffness: 100 })
      );

      // Parabolic motion for more natural drop
      translateX.value = withTiming(endPosition.x, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      });

      translateY.value = withSequence(
        // First go up slightly
        withTiming(startPosition.y - 30, {
          duration: 150,
          easing: Easing.out(Easing.quad),
        }),

        // Then drop down with bounce
        withSpring(endPosition.y, {
          damping: 12,
          stiffness: 80,
          mass: 1.2,
          velocity: 5,
        })
      );

      // Fade in effect
      opacity.value = withSequence(
        withTiming(0.8, { duration: 100 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [isRemoving]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: "absolute",
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
      zIndex: 1000,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.itemContent}>
        <Image source={image} style={styles.image} resizeMode="cover" />
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 1000,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    gap: 8,
  },
  image: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  title: {
    fontSize: 10,
    fontWeight: "600",
    maxWidth: 80,
    color: "#333",
  },
});

export default AnimatedItemComponent;