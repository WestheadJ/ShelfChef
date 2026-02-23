import { View, ActivityIndicator, Text } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import TextRecognition from "@react-native-ml-kit/text-recognition";
import { parseRecipeOCR, } from "@/services/api";




export default function Processing() {
    const { photoUri } = useLocalSearchParams();
    const [processing, setProcessing] = useState(0);

    useEffect(() => {
        async function run() {
            try {

                setProcessing(1);
                const result = await TextRecognition.recognize(photoUri as string);

                const recipe = await parseRecipeOCR(result.text);

                router.replace({
                    pathname: "/preview",
                    params: { data: JSON.stringify(recipe), photoUri }
                });

            } catch (e) {
                return setProcessing(2);
            }
        }

        run();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
                </>
            )}
        </View>
    );
}