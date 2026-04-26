import { StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";

type Props = TextInputProps & {
    label: string;
    labelStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
};

export default function LabeledTextInput({
    label,
    labelStyle,
    containerStyle,
    inputStyle,
    ...inputProps
}: Props) {
    return (
        <View style={containerStyle}>
            <Text style={[styles.label, labelStyle]}>{label}</Text>
            <TextInput
                {...inputProps}
                style={[styles.input, inputStyle]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 8,
        color: "gray"
    },
    input: {
        fontSize: 18,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 8
    }
});
