import { Text, View } from "react-native";
import { IngredientField } from "@/types/recipe";

type Props = {
    ingredient: any;
    field: IngredientField;
};

export function CardDetail({ ingredient, field }: Props) {
    const item = ingredient[field];
    if (!item) return null;  // guard against missing fields

    const confidence = item.confidence;
    const confidenceLabel = confidence && confidence > 0
        ? `[confidence: ${(confidence * 100).toFixed(0)}%]`
        : "";

    return (
        <View style={{ flexShrink: 1 }}>
            <Text>{String(item.value ?? "")}</Text>
            <Text style={{ fontSize: 8, opacity: 0.6 }}>{confidenceLabel}</Text>
        </View>
    );
}