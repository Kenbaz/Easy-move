import { useEffect } from "react";
import { View } from "react-native";
import { Image } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";
import { useAnimation } from "../context/AnimatedContext";
import { useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";


export default function Box() {
    const { setBoxLayout, animatedItems } = useAnimation();
    const boxRef = useRef<View>(null);
    const shakeAnimation = useSharedValue(0);

    // Trigger shake animation when items are added
    const tiggerShake = () => {
        shakeAnimation.value = withSequence(
            withTiming(1, { duration: 50 }),
            withSpring(0, { damping: 8, stiffness: 400 })
        );
    };

    const animatedBoxStyle = useAnimatedStyle(() => {
        const rotation = shakeAnimation.value * 2;
        const translateX = Math.sin(shakeAnimation.value * Math.PI * 4) * 2;

        return {
            transform: [
                { translateX },
                { rotate: `${rotation}deg` }
            ]
        };
    });

    const handleLayout = () => {
        if (boxRef.current) {
            boxRef.current.measureInWindow((x, y, width, height) => {
                setBoxLayout({ x, y, width, height });
            });
        }
    };

    // watch for new items and trigger shake
    useEffect(() => {
        if (animatedItems.length > 0) {
            tiggerShake();
        }
    }, [animatedItems.length]);


    return (
      <Animated.View style={[{ position: "relative" }, animatedBoxStyle]}>
        {/* Radial gradient floor */}
        <View className="absolute -bottom-7 left-0 right-0 z-0">
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

        {/* Box components */}
        <View className="absolute right-[65px] top-[19px] z-[1]">
          <Image source={require("../assets/images/Polygon 2.png")} />
        </View>
        <View className="absolute left-[62px] top-[17px] z-[1]">
          <Image source={require("../assets/images/Polygon 1.png")} />
        </View>
        <View className="absolute left-[98.9px] top-[4.5px] z-[1]">
          <Image source={require("../assets/images/Rectangle 3.png")} />
        </View>
        <View className="absolute right-[98.9px] top-[4.5px] z-[1]">
          <Image source={require("../assets/images/Rectangle 4.png")} />
        </View>
        <View className="absolute left-[121px] top-[5px]">
          <Image
            source={require("../assets/images/Rectangle 5 (1).png")}
            className="w-[186px] h-[106px]"
          />
        </View>

        {/* Main box image with measurement */}
        <View ref={boxRef} onLayout={handleLayout}>
          <Image
            source={require("../assets/images/Frame 44032.png")}
            className="mx-auto h-[180px] w-[299px] z-[5]"
          />
        </View>

        {/* Container for collected items (visual representation) */}
        <View
          className="absolute inset-0 z-[3]"
          pointerEvents="none"
          style={{ top: 40, left: 140, right: 140, bottom: 60 }}
        >
          {/* Visual items will stack here through the animation system */}
        </View>
      </Animated.View>
    );
}
