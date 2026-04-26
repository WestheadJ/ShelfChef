import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
    value: string;
    onPress: () => void;
    label?: string;
    textStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    iconSize?: number;
};

export default function EditableValueRow({
    value,
    onPress,
    label,
    textStyle,
    containerStyle,
    iconSize = 16
}: Props) {
    return (
        <TouchableOpacity style={[styles.row, containerStyle]} onPress={onPress}>
            <Text style={[styles.value, textStyle]}>
                {label ? `${label}${value}` : value}
            </Text>
            <Ionicons name="pencil" size={iconSize} color="gray" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center"
    },
    value: {
        flex: 1
    }
});
