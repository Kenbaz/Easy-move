import ThemedView from "../components/ThemedView";
import { StyleSheet, Text, TextInput, View, ScrollView } from "react-native";

import { Search, ChevronsDownUp } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import ListItems from "../components/ListItems";
import ListItemsTwo from "../components/ListItemsTwo";
import { AnimationProvider, useAnimation } from "../context/AnimatedContext";
import AnimationOverlay from "../components/AnimationOverlay";

import { Image } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";
import { useRef } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

// Separate component that uses the hook
function BlankServicesContent() {
  const { setBoxLayout } = useAnimation();
  const boxRef = useRef<View>(null);
  const shakeAnimation = useSharedValue(0);
  const containerWidth = 357;

  const animatedBoxStyle = useAnimatedStyle(() => {
    const rotation = shakeAnimation.value * 2;
    const translateX = Math.sin(shakeAnimation.value * Math.PI * 4) * 2;

    return {
      transform: [{ translateX }, { rotate: `${rotation}deg` }],
    };
  });

  const handleLayout = () => {
    if (boxRef.current) {
      boxRef.current.measureInWindow((x, y, width, height) => {
        setBoxLayout({ x, y, width, height });
      });
    }
  };

  return (
    <ThemedView safeArea={true} className="border relative bg-white">
      <View className="bg-white h-[9.5%] items-center justify-center">
        <View className="border border-gray-100 flex-row px-5 gap-2 bg-gray-100 rounded-[50px] items-center mx-auto h-[50px] w-[366px]">
          <Search width={16} height={16} />
          <TextInput
            placeholder="Search for an item"
            className="h-full w-[94%]"
          />
        </View>
      </View>
      <View className="bg-gray-100 h-full">
        <View className="h-[393px] gap-[23px] pt-5">
          <View className="flex-row mx-auto items-center justify-between w-[401px] border border-gray-100 h-[55px] rounded-[10px] bg-[#FFFFFF] px-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="bed-outline" size={24} />
              <Text className="font-semibold text-sm">Bedroom</Text>
            </View>
            <ChevronsDownUp width={13} height={13} />
          </View>
          <View className="flex-1">
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={containerWidth + 15}
              decelerationRate="fast"
              contentContainerStyle={{
                paddingHorizontal: 15,
              }}
              style={{
                flex: 1,
              }}
            >
              {/* First Container */}
              <View style={styles.custom}>
                <View className="border flex-1 w-[357px] bg-[#FFFFFF] rounded-2xl gap-[10px] border-gray-100">
                  <ListItems />
                </View>
              </View>

              {/* Second Container */}
              <View>
                <View className="border flex-1 w-[357px] bg-[#FFFFFF] rounded-2xl gap-[10px] border-gray-100">
                  <ListItemsTwo />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
        <View style={[styles.custom2, animatedBoxStyle]}>
          {/* Radial gradient floor */}
          <View
            className="absolute -bottom-7 left-0 right-0"
            style={{ zIndex: 1 }}
          >
            <Svg height="54" width="100%" style={{ width: "100%" }}>
              <Defs>
                <RadialGradient id="radialGrad" cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor="#AEAEAE" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#F0F0F0" stopOpacity="1" />
                </RadialGradient>
              </Defs>
              <Ellipse
                cx="50%"
                cy="27"
                rx="50%"
                ry="27"
                fill="url(#radialGrad)"
              />
            </Svg>
          </View>

          {/* Back panel - lowest z-index */}
          <View
            className="absolute left-[121px] top-[5px]"
            style={{ zIndex: 2 }}
          >
            <Image
              source={require("../assets/images/Rectangle 5 (1).png")}
              className="w-[186px] h-[106px]"
            />
          </View>

          {/* Main box image - for measurement and base structure */}
          <View
            ref={boxRef}
            onLayout={handleLayout}
            style={{ zIndex: 7, width: 299, margin: "auto" }}
          >
            <Image
              source={require("../assets/images/Frame 44032.png")}
              className="mx-auto h-[180px] w-[299px]"
            />
          </View>

          {/* Front panels - highest z-index to appear on top */}
          <View
            className="absolute right-[65px] top-[19px]"
            style={{ zIndex: 5 }}
          >
            <Image source={require("../assets/images/Polygon 2.png")} />
          </View>
          <View
            className="absolute left-[62px] top-[17px]"
            style={{ zIndex: 5 }}
          >
            <Image source={require("../assets/images/Polygon 1.png")} />
          </View>
          <View
            className="absolute left-[98.9px] top-[4.5px]"
            style={{ zIndex: 5 }}
          >
            <Image source={require("../assets/images/Rectangle 3.png")} />
          </View>
          <View
            className="absolute right-[98.9px] top-[4.5px]"
            style={{ zIndex: 5 }}
          >
            <Image source={require("../assets/images/Rectangle 4.png")} />
          </View>
        </View>
      </View>

      {/* Animation Overlay - This renders all animated items */}
      <AnimationOverlay style={{ zIndex: 5 }} />
    </ThemedView>
  );
}

// Main component that provides the context
export default function BlankServicesScreen() {
  return (
    <AnimationProvider>
      <BlankServicesContent />
    </AnimationProvider>
  );
}

const styles = StyleSheet.create({
  custom: {
    marginRight: 15,
  },
  custom2: {
    top: 500,
    position: "absolute",
    left: 0,
    right: 0,
  },
});
