import { View, Image, TouchableOpacity, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function Confirm() {
    const { photoUri } = useLocalSearchParams();

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <Text style={{ textAlign: "center", padding: 20, fontSize: 18 }}>
                Are the ingredients of the recipe in the photo?
            </Text>
            <Image
                source={{ uri: photoUri as string }}
                style={{ flex: 1 }}
                resizeMode="contain"
            />

            <TouchableOpacity
                onPress={() => router.push({
                    pathname: "/processing",
                    params: { photoUri }
                })}
                style={{
                    position: "absolute",
                    bottom: 15,
                    alignSelf: "center",
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 60
                }}
            >
                <Text>Confirm and Process</Text>
            </TouchableOpacity>
        </View>
    );
}