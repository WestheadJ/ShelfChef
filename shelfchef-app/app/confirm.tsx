import { View, Image, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AppButton from "@/components/ui/Button/AppButton";
import { getCapturedPhotoUri } from "@/services/capture/captureSession";

export default function Confirm() {
    const { photoUri } = useLocalSearchParams();
    const resolvedPhotoUri =
        getCapturedPhotoUri() ??
        (Array.isArray(photoUri) ? photoUri[0] : photoUri) ??
        null;

    if (!resolvedPhotoUri) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Could not load the captured photo.</Text>
                <View style={styles.missingPhotoActions}>
                    <AppButton
                        title="Back To Camera"
                        onPress={() => router.replace("/capture")}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Are the ingredients of the recipe in the photo?
            </Text>
            <Image
                source={{ uri: resolvedPhotoUri }}
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
                        params: { photoUri: resolvedPhotoUri }
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
    missingPhotoActions: {
        paddingHorizontal: 20,
        paddingBottom: 40
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
