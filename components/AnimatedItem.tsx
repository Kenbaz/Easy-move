import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { useAnimation } from "../context/AnimatedContext";
import { Trash2, PlusCircle } from "lucide-react-native";

const { width: screenWidth } = Dimensions.get("window");

interface AnimatedItemProps {
  id: string;
  itemId: string;
  title: string;
  image: any;
  startPosition: { x: number; y: number };
  endPosition: { x: number; y: number };
  onAnimationComplete?: () => void;
  isRemoving?: boolean;

  // Preview props
  previewMode?: boolean;
  bulkOffsetY?: number;
  lineupPosition?: { x: number; y: number };
  previewIndex?: number;
  totalPreviewItems?: number;
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
  previewMode = false,
  lineupPosition,
  previewIndex = 0,
  totalPreviewItems = 1,
}) => {
  const translateX = useSharedValue(startPosition.x);
  const translateY = useSharedValue(startPosition.y);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);

  const {
    addAnimatedItem,
    removeAnimatedItem,
    getItemCount,
  } = useAnimation();
  const count = getItemCount(itemId);

  const phaseTimeoutRef = useRef<number | null>(null);

  // Existing add/remove animation
  useEffect(() => {
    if (isRemoving) {
      scale.value = withTiming(0.9, { duration: 400 });
      translateX.value = withTiming(startPosition.x, {
        duration: 500,
        easing: Easing.in(Easing.quad),
      });
      translateY.value = withTiming(startPosition.y, {
        duration: 500,
        easing: Easing.in(Easing.quad),
      });
      rotation.value = withTiming(0, {
        duration: 400,
        easing: Easing.in(Easing.quad),
      });
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
      // Initial drop into box
      scale.value = withSequence(
        withTiming(0.8, { duration: 150 }),
        withSpring(0.55, { damping: 10, stiffness: 100 })
      );
      translateX.value = withTiming(endPosition.x, {
        duration: 700,
        easing: Easing.out(Easing.quad),
      });
      translateY.value = withSpring(endPosition.y, {
        damping: 15,
        stiffness: 60,
        mass: 1.5,
        velocity: 0,
      });
      const finalRotation = Math.random() * 180 - 90;
      rotation.value = withTiming(finalRotation, {
        duration: 700,
        easing: Easing.out(Easing.quad),
      });
      opacity.value = withSequence(
        withTiming(0.9, { duration: 100 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [isRemoving]);

  // Preview animation - position items in unified list
 useEffect(() => {
   if (isRemoving) return;

   if (previewMode) {
     // Calculate position for unified preview list
     const ITEM_HEIGHT = 60;
     const ITEM_WIDTH = screenWidth - 40;
     const TOP_OFFSET = 140;

     const targetX = (screenWidth - ITEM_WIDTH) / 2.2;
     const targetY = TOP_OFFSET + previewIndex * ITEM_HEIGHT;

     translateX.value = withTiming(targetX, {
       duration: 600,
       easing: Easing.out(Easing.cubic),
     });

     translateY.value = withTiming(targetY, {
       duration: 600,
       easing: Easing.out(Easing.cubic),
     });

     scale.value = withTiming(1, {
       duration: 600,
       easing: Easing.out(Easing.cubic),
     });

     rotation.value = withTiming(0, {
       duration: 600,
       easing: Easing.out(Easing.cubic),
     });
   } else if (
     translateX.value !== endPosition.x ||
     translateY.value !== endPosition.y
   ) {
     // Only animate back to box if we're actually returning from preview mode
     // AND the item has been moved from its box position
     translateX.value = withTiming(endPosition.x, {
       duration: 600,
       easing: Easing.out(Easing.cubic),
     });

     translateY.value = withSpring(endPosition.y, {
       damping: 15,
       stiffness: 60,
       mass: 1.5,
       velocity: 0,
     });

     scale.value = withTiming(0.55, {
       duration: 600,
       easing: Easing.out(Easing.cubic),
     });

     const finalRotation = Math.random() * 180 - 90;
     rotation.value = withTiming(finalRotation, {
       duration: 600,
       easing: Easing.out(Easing.cubic),
     });
   }
 }, [previewMode, previewIndex]);

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

  const handleAdd = () => {
    const origin = lineupPosition || endPosition;
    addAnimatedItem({
      itemId,
      title,
      image,
      startPosition: { x: origin.x, y: origin.y },
    });
  };

  const handleRemove = () => {
    if (count > 0) {
      removeAnimatedItem(itemId);
    }
  };

  // Determine border radius based on position in preview
  const getPreviewStyles = () => {
    if (!previewMode) return {};

    const isFirst = previewIndex === 0;
    const isLast = previewIndex === totalPreviewItems - 1;
    const isSingle = totalPreviewItems === 1;

    let borderRadius = {};

    if (isSingle) {
      borderRadius = { borderRadius: 10 };
    } else if (isFirst) {
      borderRadius = { borderTopLeftRadius: 10, borderTopRightRadius: 10 };
    } else if (isLast) {
      borderRadius = {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      };
    }

    return {
      width: screenWidth - 40,
      ...borderRadius,
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    };
  };

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      pointerEvents={previewMode ? "auto" : "none"}
    >
      <View
        style={[
          styles.itemContent,
          previewMode && styles.previewItemContent,
          getPreviewStyles(),
        ]}
      >
        <Image source={image} style={styles.image} resizeMode="cover" />
        <Text
          style={[styles.title, previewMode && styles.previewTitle]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {previewMode && (
          <View style={styles.controls}>
            <Pressable
              onPress={handleRemove}
              style={styles.iconBtn}
              hitSlop={8}
            >
              <Trash2 width={20} height={20} />
            </Pressable>
            <Text style={styles.countText}>{count}</Text>
            <Pressable onPress={handleAdd} style={styles.iconBtn} hitSlop={8}>
              <PlusCircle width={20} height={20} />
            </Pressable>
          </View>
        )}
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
  previewItemContent: {
    // Override styles for preview mode
    minWidth: undefined, // Remove minWidth constraint
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 0,
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
  previewTitle: {
    maxWidth: undefined, // Remove width constraint in preview
    flex: 1, // Allow title to expand in preview mode
  },
  controls: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  countText: {
    minWidth: 20,
    textAlign: "center",
    fontWeight: "700",
    color: "#232323",
  },
});

export default AnimatedItemComponent;
