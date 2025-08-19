import React from "react";
import { View, StyleSheet } from "react-native";
import { useAnimation } from "../context/AnimatedContext";
import AnimatedItemComponent from "./AnimatedItem";

interface Props {
  style?: any;
}

const AnimationOverlay: React.FC<Props> = ({ style }) => {
  const { animatedItems } = useAnimation();

  return (
    <View style={{ zIndex: 1, backgroundColor: 'red', position: 'absolute', ...style }} pointerEvents="none">
      {animatedItems.map((item) => (
        <AnimatedItemComponent
          key={item.id}
          {...item}
          isRemoving={item.isRemoving || false}
        />
      ))}
    </View>
  );
};

export default AnimationOverlay;
