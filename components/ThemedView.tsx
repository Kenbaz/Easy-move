import { View, ViewStyle } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ThemedViewProps extends Omit<React.ComponentProps<typeof View>, "style" | "children"> {
  children: React.ReactNode;
  style?: ViewStyle;
  safeArea?: boolean;
}

const ThemedView = ({ children, style, safeArea = false, ...props }: ThemedViewProps) => {

    if (!safeArea) return (
      <View
        style={[{ flex: 1 }, style]}
        {...props}
      >
        {children}
      </View>
    );

    const insets = useSafeAreaInsets();

    return (
        <View
            style={[{
                flex: 1,
                paddingTop: insets.top,
                paddingBottom: insets.bottom,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }, style]}
            {...props}
        >
            {children}
        </View>
    );  
};

export default ThemedView;
