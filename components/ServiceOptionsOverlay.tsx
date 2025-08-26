import React, { useEffect } from "react";
import { View, Text, Pressable, Dimensions, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler"
import { Bed, Bath, Refrigerator, Table, Sofa, LampDesk, ChevronRight, Home, Trees, Users} from "lucide-react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window")
const OVERLAY_HEIGHT = SCREEN_HEIGHT * 0.75; // 75% of screen height
const CLOSE_THRESHOLD = 100;

interface ServiceOptionsOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}


const ServiceOptionsOverlay: React.FC<ServiceOptionsOverlayProps> = ({ isVisible, onClose, children }) => { 
    const translateY = useSharedValue(OVERLAY_HEIGHT);
    const opacity = useSharedValue(0);
    const context = useSharedValue({ startY: 0 });

    useEffect(() => {
        if (isVisible) {
            opacity.value = withTiming(1, { duration: 300 });
            translateY.value = withSpring(SCREEN_HEIGHT - OVERLAY_HEIGHT, {
                damping: 20,
                stiffness: 90,
            });
        } else {
            opacity.value = withTiming(0, { duration: 200 });
            translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
        }
    }, [isVisible]);

    const panGesture = Gesture.Pan()
    .onStart(() => {
        context.value = { startY: translateY.value };
    })
    .onUpdate((event) => {
        const newTranslateY = context.value.startY + event.translationY;
        // Prevent dragging above intended position
        if (newTranslateY >= SCREEN_HEIGHT - OVERLAY_HEIGHT) { 
            translateY.value = newTranslateY;
        }
    })
    .onEnd((event) => {
        const shouldClose = event.translationY > CLOSE_THRESHOLD || event.velocityY > 500;
        
        if (shouldClose) { 
            runOnJS(onClose)();
        } else {
            translateY.value = withSpring(SCREEN_HEIGHT - OVERLAY_HEIGHT, {
                damping: 20,
                stiffness: 90,
            });
        }
    });

    const overlayStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const backdropStyle = useAnimatedStyle(() => {
      const backdropOpacity = interpolate(
        translateY.value,
        [SCREEN_HEIGHT - OVERLAY_HEIGHT, SCREEN_HEIGHT],
        [0.5, 0],
        Extrapolate.CLAMP
      );
      return {
        opacity: opacity.value * backdropOpacity,
      };
    });

    if (!isVisible && opacity.value === 0) return null;

    return (
      <GestureHandlerRootView
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        {/* Backdrop */}
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "black",
            },
            backdropStyle,
          ]}
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        {/* Overlay Content */}
        <Animated.View
          className="bg-gray-100"
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              height: OVERLAY_HEIGHT,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 10,
              paddingBottom: 30,
              gap: 5,
              paddingHorizontal: 16,
              elevation: 5,
            },
            overlayStyle,
          ]}
        >
          {/* Drag Handle */}
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={{
                width: "100%",
                height: 70,
                justifyContent: "center",
                alignItems: "center",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <View
                className="bg-gray-400"
                style={{
                  width: 71,
                  height: 8,
                  borderRadius: 9,
                  marginBottom: 10,
                }}
              />
              <Text
                className="py-4"
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#1F2937",
                }}
              >
                Choose category
              </Text>
            </Animated.View>
          </GestureDetector>

          {/* Content */}
          <View
            className="bg-white h-[495px]"
            style={{
              borderRadius: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.05,
              shadowRadius: 20,
              elevation: 4,
            }}
          >
            {children || (
              <View
                style={{
                  flex: 1,
                }}
              >
                <View className="flex-row items-center justify-between border-b border-gray-100 px-[16px] h-[55px]">
                  <View className="flex-row items-center gap-[6px]">
                    <Bed width={24} height={24} color="#000" />
                    <Text className="text-sm font-semibold">Bedroom</Text>
                  </View>
                  <ChevronRight width={20} height={20} color="#B0B0B0" />
                </View>
                <View className="flex-row items-center justify-between border-b border-gray-100 px-[16px] h-[55px]">
                  <View className="flex-row items-center gap-[6px]">
                    <Sofa width={24} height={24} color="#000" />
                    <Text className="text-sm font-semibold">Living Room</Text>
                  </View>
                  <ChevronRight width={20} height={20} color="#B0B0B0" />
                </View>
                <View className="flex-row items-center justify-between border-b border-gray-100 px-[16px] h-[55px]">
                  <View className="flex-row items-center gap-[6px]">
                    <Table width={24} height={24} color="#000" />
                    <Text className="text-sm font-semibold">Dinning</Text>
                  </View>
                  <ChevronRight width={20} height={20} color="#B0B0B0" />
                </View>
                <View className="flex-row items-center justify-between border-b border-gray-100 px-[16px] h-[55px]">
                  <View className="flex-row items-center gap-[6px]">
                    <Refrigerator width={24} height={24} color="#000" />
                    <Text className="text-sm font-semibold">Kitchen</Text>
                  </View>
                  <ChevronRight width={20} height={20} color="#B0B0B0" />
                </View>
                <View className="flex-row items-center justify-between border-b border-gray-100 px-[16px] h-[55px]">
                  <View className="flex-row items-center gap-[6px]">
                    <Bath width={24} height={24} color="#000" />
                    <Text className="text-sm font-semibold">Bathroom</Text>
                  </View>
                  <ChevronRight width={20} height={20} color="#B0B0B0" />
                </View>
                <View className="flex-row items-center justify-between border-b border-gray-100 px-[16px] h-[55px]">
                  <View className="flex-row items-center gap-[6px]">
                    <Trees width={24} height={24} color="#000" />
                    <Text className="text-sm font-semibold">Garden</Text>
                  </View>
                  <ChevronRight width={20} height={20} color="#B0B0B0" />
                </View>
                <View className="flex-row items-center justify-between border-b border-gray-100 px-[16px] h-[55px]">
                  <View className="flex-row items-center gap-[6px]">
                    <Home width={24} height={24} color="#000" />
                    <Text className="text-sm font-semibold">Garage</Text>
                  </View>
                  <ChevronRight width={20} height={20} color="#B0B0B0" />
                </View>
                <View className="flex-row items-center justify-between border-b border-gray-100 px-[16px] h-[55px]">
                  <View className="flex-row items-center gap-[6px]">
                    <LampDesk width={24} height={24} color="#000" />
                    <Text className="text-sm font-semibold">Office</Text>
                  </View>
                  <ChevronRight width={20} height={20} color="#B0B0B0" />
                </View>
                <View className="flex-row items-center justify-between border-b border-gray-100 px-[16px] h-[55px]">
                  <View className="flex-row items-center gap-[6px]">
                    <Users width={24} height={24} color="#000" />
                    <Text className="text-sm font-semibold">
                      How many movers
                    </Text>
                  </View>
                  <ChevronRight width={20} height={20} color="#B0B0B0" />
                </View>
              </View>
            )}
          </View>
          <Pressable style={styles.shadow} onPress={onClose}>
            <LinearGradient
              colors={["#03AD14", "#008E05"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              locations={[0.0218, 1]}
              style={styles.button}
            >
              <Text style={styles.text}>Continue</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </GestureHandlerRootView>
    );
};


const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    borderRadius: 10,
    marginTop: 10
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    color: "#fff",
    fontWeight: 600,
    fontSize: 16,
  },
});

export default ServiceOptionsOverlay;