import { TextInput, ViewStyle } from "react-native";
import React from "react";

interface ThemedTextinputProps extends Omit<React.ComponentProps<typeof TextInput>, "style" | "children"> {
    children?: React.ReactNode;
    style?: ViewStyle;
}

const ThemedTextInput = ({ children, style, ...props }: ThemedTextinputProps) => {

    return (
        <TextInput
            style={[{
                borderRadius: 6,
                padding: 10
            }, style]}
            {...props}
        >
            {children}
        </TextInput>
    );
};

export default ThemedTextInput;
