import { ReactNode } from "react";
import {
    GestureResponderEvent,
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from "react-native";

type Variant = "dark" | "danger" | "light" | "accent";

type Props = {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    variant?: Variant;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    activeOpacity?: number;
    children?: ReactNode;
};

export default function AppButton({
    title,
    onPress,
    variant = "dark",
    style,
    textStyle,
    activeOpacity = 0.8,
    children
}: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, variantStyles[variant], style]}
            activeOpacity={activeOpacity}
        >
            {children}
            <Text style={[styles.text, textVariantStyles[variant], textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontWeight: "500"
    }
});

const variantStyles = StyleSheet.create({
    dark: {
        backgroundColor: "black"
    },
    danger: {
        backgroundColor: "red"
    },
    light: {
        backgroundColor: "lightgray"
    },
    accent: {
        backgroundColor: "blue"
    }
});

const textVariantStyles = StyleSheet.create({
    dark: {
        color: "white"
    },
    danger: {
        color: "white"
    },
    light: {
        color: "black"
    },
    accent: {
        color: "white"
    }
});
