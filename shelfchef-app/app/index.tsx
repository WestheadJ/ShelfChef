import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";


export default function Home() {


    const recipes: any[] = []; // development placeholder

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {recipes.length === 0 && (
                <>
                    <Text>No recipes yet</Text>

                    <TouchableOpacity
                        onPress={() => router.push("/capture?fromHome=true")}
                        style={{
                            marginTop: 20,
                            padding: 15,
                            backgroundColor: "#222",
                            borderRadius: 12
                        }}
                    >
                        <Text style={{ color: "white" }}>Scan Cookbook</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}