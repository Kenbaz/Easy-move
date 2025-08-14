import React from "react";
import { View, StyleSheet } from "react-native";
import { useAnimation } from "../context/AnimatedContext";
import AnimatedItemComponent from "./AnimatedItem";

const AnimationOverlay: React.FC = () => {
  const { animatedItems } = useAnimation();

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {animatedItems.map((item) => (
        <AnimatedItemComponent key={item.id} {...item} />
      ))}
    </View>
  );
};

export default AnimationOverlay;
