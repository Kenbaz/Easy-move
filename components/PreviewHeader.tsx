import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAnimation } from "../context/AnimatedContext";
import { ChevronDown } from "lucide-react-native";

const PreviewHeader: React.FC = () => {
  const { animatedItems, previewMode, stopPreview } = useAnimation();
  const headerY = useSharedValue(-80);

  // Get unique item types that are in the box
  const uniqueItems = animatedItems
    .filter((item) => !item.isRemoving)
    .reduce(
      (acc, item) => {
        if (!acc.find((i) => i.itemId === item.itemId)) {
          acc.push(item);
        }
        return acc;
      },
      [] as typeof animatedItems
    );

  const total = uniqueItems.length;

  useEffect(() => {
    if (previewMode) {
      headerY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    } else {
      headerY.value = withTiming(-80, {
        duration: 300,
        easing: Easing.in(Easing.cubic),
      });
    }
  }, [previewMode]);

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: headerY.value }],
  }));

  if (!previewMode) return null;

  return (
    <View style={styles.root}>
      <Animated.View className="bg-white" style={[styles.header, headerStyle]}>
        <Pressable onPress={stopPreview} hitSlop={10} style={styles.headerLeft}>
          <ChevronDown width={24} height={24} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>Your added items</Text>
        <Text style={styles.headerRight}>
          {total} {total === 1 ? "item" : "items"}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 35,
    left: 0,
    right: 0,
    zIndex: 12,
  },
  header: {
    height: 80,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  headerLeft: {
    position: "absolute",
    left: 16,
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#232323",
  },
  headerRight: {
    position: "absolute",
    right: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#232323",
  },
});

export default PreviewHeader;
