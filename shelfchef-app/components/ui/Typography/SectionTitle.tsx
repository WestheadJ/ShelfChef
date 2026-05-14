import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

type Props = {
    title: string;
    style?: StyleProp<TextStyle>;
    textAlign?: "left" | "center" | "right";
};

export default function SectionTitle({
    title,
    style,
    textAlign = "left",
}: Props) {
    return (
        <Text
            style={[
                styles.title,
                { textAlign },
                style,
            ]}
        >
            {title}
        </Text>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
});