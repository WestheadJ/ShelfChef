import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { parseRecipeOCR, } from "@/services/api";
import { capture } from "@/constants/constant";
import AppButton from "@/components/ui/Button/AppButton";




export default function Processing() {
    let { photoUri } = useLocalSearchParams();
    const [processing, setProcessing] = useState(0);



    useEffect(() => {
        async function run() {
            try {
                router.replace({
                    pathname: "/preview",
                    // params: { data: JSON.stringify(recipe), photoUri }
                    params: { data: JSON.stringify(capture), photoUri }
                });

            } catch (e) {
                return setProcessing(2);
            }
        }

        run();
    }, []);

    return (
        <View style={styles.container}>
            {/* <ActivityIndicator size="large" />
            <Text>Processing recipe…</Text> */}
            {processing === 1 && (
                <>
                    <ActivityIndicator size="large" />
                    <Text>Processing recipe…</Text>
                </>
            )}
            {processing === 2 && (
                <>
                    <Text>There was an error processing the recipe.</Text>
                    <AppButton title="Go Back" variant="light" onPress={() => router.back()} style={styles.backButton} />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    backButton: {
        marginTop: 20,
        backgroundColor: "lightgray",
        borderRadius: 5
    }
});
