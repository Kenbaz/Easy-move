import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
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
      // Animate back to original position when removing
      scale.value = withTiming(0.9, { duration: 400 });

      // Move back to starting position
      translateX.value = withTiming(startPosition.x, {
        duration: 500,
        easing: Easing.in(Easing.quad),
      });

      translateY.value = withTiming(startPosition.y, {
        duration: 500,
        easing: Easing.in(Easing.quad),
      });

      // Rotate back to original orientation
      rotation.value = withTiming(0, {
        duration: 400,
        easing: Easing.in(Easing.quad),
      });

      // Fade out at the end
      opacity.value = withDelay(
        400,
        withTiming(0, {
          duration: 300,
        })
      );

      if (onAnimationComplete) {
        setTimeout(onAnimationComplete, 500);
      }
    } else {
      // Drop animation - removed upward bounce
      scale.value = withSequence(
        withTiming(0.8, { duration: 150 }),
        withSpring(0.55, { damping: 10, stiffness: 100 })
      );

      // Horizontal movement
      translateX.value = withTiming(endPosition.x, {
        duration: 700,
        easing: Easing.out(Easing.quad),
      });

      // Direct drop down without bounce up
      translateY.value = withSpring(endPosition.y, {
        damping: 15,
        stiffness: 60,
        mass: 1.5,
        velocity: 0,
      });

      // Random rotation for varied final positions (vertical, slanted, etc.)
      const finalRotation = Math.random() * 180 - 90; // -90 to 90 degrees for full range
      rotation.value = withTiming(finalRotation, {
        duration: 700,
        easing: Easing.out(Easing.quad),
      });

      // Fade in effect
      opacity.value = withSequence(
        withTiming(0.9, { duration: 100 }),
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
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    gap: 10,
    minWidth: 200,
  },
  image: {
    width: 36,
    height: 36,
    borderRadius: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    maxWidth: 100,
    color: "#333",
  },
});

export default AnimatedItemComponent