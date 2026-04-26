import { View, Image, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AppButton from "@/components/ui/Button/AppButton";

export default function Confirm() {
    const { photoUri } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Are the ingredients of the recipe in the photo?
            </Text>
            <Image
                source={{ uri: photoUri as string }}
                style={styles.image}
                resizeMode="contain"
            />
            <View style={styles.actionRow}><AppButton
                title="Go Back"
                variant="light"
                onPress={() => router.push({
                    pathname: "/capture",

                })}
                style={styles.backButton}
            />
                <AppButton
                    title="Confirm"
                    variant="accent"
                    onPress={() => router.push({
                        pathname: "/processing",
                        params: { photoUri }
                    })}
                    style={styles.confirmButton}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    title: {
        textAlign: "center",
        padding: 20,
        fontSize: 18
    },
    image: {
        flex: 1
    },
    actionRow: {
        flexDirection: "row",
        alignContent: "center"
    },
    backButton: {
        position: "absolute",
        bottom: 25,
        backgroundColor: "lightgray",
        left: 85,
        borderRadius: 60
    },
    confirmButton: {
        position: "absolute",
        bottom: 25,
        right: 78,
        backgroundColor: "blue",
        borderRadius: 60
    }
});
