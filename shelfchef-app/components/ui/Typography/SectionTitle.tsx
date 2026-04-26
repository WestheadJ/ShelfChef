import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

type Props = {
    title: string;
    style?: StyleProp<TextStyle>;
};

export default function SectionTitle({ title, style }: Props) {
    return <Text style={[styles.title, style]}>{title}</Text>;
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "bold"
    }
});
