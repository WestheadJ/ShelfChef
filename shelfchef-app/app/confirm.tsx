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
            <View style={{ flexDirection: "row", alignContent: "center" }}><TouchableOpacity
                onPress={() => router.push({
                    pathname: "/capture",

                })}
                style={{
                    position: "absolute",
                    bottom: 25,

                    backgroundColor: "lightgray",
                    padding: 12,
                    left: 85,
                    borderRadius: 60
                }}
            >
                <Text>Go Back</Text>
            </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => router.push({
                        pathname: "/processing",
                        params: { photoUri }
                    })}
                    style={{
                        position: "absolute",
                        bottom: 25,
                        right: 78,
                        backgroundColor: "blue",
                        padding: 12,
                        borderRadius: 60,

                    }}
                >
                    <Text style={{ color: "white" }}>Confirm</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}