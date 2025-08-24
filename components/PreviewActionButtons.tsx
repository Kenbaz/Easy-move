import React, { useEffect } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAnimation } from "../context/AnimatedContext";

const PreviewActionButtons: React.FC = () => {
  const { previewMode, stopPreview } = useAnimation();
  const translateY = useSharedValue(150);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (previewMode) {
      // Slide up and fade in
      translateY.value = withTiming(-50, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
    } else {
      // Slide down and fade out
      translateY.value = withTiming(150, {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      });
      opacity.value = withTiming(0, {
        duration: 200,
        easing: Easing.in(Easing.quad),
      });
    }
  }, [previewMode]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!previewMode) return null;

  return (
    <Animated.View className="bg-white" style={[styles.container, animatedStyle]}>
      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.actionBtn, styles.secondary]}
          onPress={stopPreview}
        >
          <Text style={styles.secondaryText}>Continue packing</Text>
        </Pressable>

        <Pressable style={[styles.actionBtn, styles.primary]}>
          <Text style={styles.primaryText}>Go to payment</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: -55,
    paddingHorizontal: 11,
    paddingTop: 20,
    gap: 14,
    height: 128,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 11,
  },
  actionBtn: {
    height: 50,
    borderRadius: 10,
    width: 193,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  primary: {
    backgroundColor: "#03AD14",
  },
  primaryText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  secondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E7",
  },
  secondaryText: {
    color: "#232323",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default PreviewActionButtons;
