import { Text } from "react-native";
import { IngredientField } from "@/types/recipe";

type Props = {
    ingredient: any;
    field: IngredientField;
};

export function CardDetail({ ingredient, field }: Props) {
    return (
        <Text style={{ flexShrink: 1 }}>
            {ingredient[field].value}
            <Text style={{ fontSize: 8, opacity: 0.6 }}>
                {" "}
                {ingredient[field].confidence === 0 ? null : `[confidence: ${((ingredient[field].confidence || 0) * 100).toFixed(0)}%]`} {/* Show "unrecognized" if confidence is 0 */}
            </Text>
        </Text>
    );
}