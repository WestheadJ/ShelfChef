import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";

type Props = {
    onPress: () => void;
    color?: string;
    backgroundColor?: string;
}

export default function BackButton({ onPress, color = "#333", backgroundColor = "#eee" }: Props) {

    const styles = StyleSheet.create({
        button: {
            position: "absolute",
            top: 5,
            left: 5,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: backgroundColor,
            alignItems: "center",
            justifyContent: "center",

            margin: 10

        },
        text: {
            fontWeight: "500",
            color
        }
    });

    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Ionicons name="arrow-back" size={24} color={color} />
        </TouchableOpacity>
    );


}
