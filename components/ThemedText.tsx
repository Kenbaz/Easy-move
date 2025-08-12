import { Text as RNText, TextProps } from "react-native";

export function ThemedText({ style, ...props }: TextProps) {

  return (
    <RNText
      style={[
        {
          fontFamily: "Inter_400Regular",
        },
        style,
      ]}
      {...props}
    />
  );
}
