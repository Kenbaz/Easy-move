import React, { useEffect, useRef } from "react";
import { Text, Pressable, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { useAnimation } from "../context/AnimatedContext";
import { Colors } from "../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const { height: screenHeight } = Dimensions.get("window");

const ViewItemsButton: React.FC = () => {
  const { animatedItems, boxLayout } = useAnimation();
  const translateY = useSharedValue(150);
  const opacity = useSharedValue(0);
  const timeoutRef = useRef<number | null>(null);

  // Calculate if there are items in the box
  const hasItems = animatedItems.filter((item) => !item.isRemoving).length > 0;
  const totalItems = animatedItems.filter((item) => !item.isRemoving).length;

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (hasItems) {
      // Animate button up from below the screen immediately
      translateY.value = withSpring(-20, {
        damping: 20,
        stiffness: 150,
        mass: 1,
      });
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
    } else {
      console.log("Delaying button animation DOWN by 2 seconds");
      // Delay the button animation down
      timeoutRef.current = setTimeout(() => {
        console.log("Animating button DOWN");
        // Animate button down off the screen
        opacity.value = withTiming(0, {
          duration: 200,
          easing: Easing.in(Easing.quad),
        });
        translateY.value = withTiming(150, {
          duration: 400,
          easing: Easing.in(Easing.quad),
        });
      }, 500);
    }

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [hasItems, animatedItems.length]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  // Position the button at a fixed location relative to the screen bottom
  const buttonTop = boxLayout 
    ? Math.min(
        boxLayout.y + boxLayout.height + 30, // Closer to box when it's pushed up
        screenHeight - 85 // Ensure button is always visible with 120px from bottom
      )
    : screenHeight - 150;

  return (
    <Animated.View
      style={[styles.container, { top: buttonTop }, animatedStyle]}
      pointerEvents={hasItems ? "auto" : "none"}
    >
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => {
          console.log("View items pressed");
        }}
      >
        <LinearGradient
          colors={["#03AD14", "#008E05"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          locations={[0.0218, 1]}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            View all Items - {totalItems} {totalItems === 1 ? "item" : "items"}
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
    justifyContent: "center",
    alignContent: "center",
  },
  button: {
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 8,
    width: 378,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ViewItemsButton;
