import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Colors } from "../constants/Colors";

interface ButtonProps
  extends Omit<React.ComponentProps<typeof Pressable>, "style" | "children"> {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Button({ style, children, ...props}: ButtonProps) {
    return (
      <Pressable
        style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}
        {...props}
      >
        {children}
      </Pressable>
    );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: "40%",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.8,
  },
});