import { View, Text, Image, ScrollView, TouchableHighlight, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


export default function Preview() {
    const { data } = useLocalSearchParams();

    const recipe = data ? JSON.parse(data as string) : null;

    if (!recipe) return null;

    return (
        <ScrollView style={{ padding: 20 }}>



            <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 20, textAlign: "center" }}>
                {recipe.name?.value ?? "Untitled Recipe"}
            </Text>

            {recipe.ingredients?.map((ing: any, i: number) => (
                <TouchableOpacity key={i} style={{ marginTop: 12, borderStyle: "solid", borderWidth: 1, borderColor: "#eee", padding: 12, borderRadius: 8 }}>
                    <Text>
                        {ing.quantity.value} {ing.unit.value} {ing.name.value}
                    </Text>
                    <Text style={{ fontSize: 12, opacity: 0.6 }}>
                        Confidence: {Math.round(ing.name.confidence * 100)}%
                    </Text>
                    {ing.extraDetail.value ? (
                        <Text style={{ fontSize: 12, opacity: 0.6 }}>
                            Extra Detail: {ing.extraDetail.value} (Confidence: {Math.round(ing.extraDetail.confidence * 100)}%)
                        </Text>
                    ) : null}
                    <Ionicons name="pencil" size={12} style={{ position: "absolute", right: 12, top: 12 }} color="black" />

                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}