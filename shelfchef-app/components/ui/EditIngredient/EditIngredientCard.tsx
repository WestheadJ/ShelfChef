import { Text, TextInput, View } from "react-native";
type IngredientField = "name" | "quantity" | "unit" | "extraDetail";
type Props = {
    ingredient: any;
    index: number;
    label: string;
    field: IngredientField;
    updateIngredient: (index: number, field: IngredientField, value: any) => void;
    style: any;
    keyboardType?: "default" | "numeric";
};


export function EditIngredientCard({
    ingredient,
    index,
    field,
    label,
    updateIngredient,
    style,
    keyboardType = "default"
}: Props) {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
            <Text>{label}</Text>
            <TextInput
                value={ingredient[field]?.value ?? ""}
                onChangeText={(text) => updateIngredient(index, field, text)}
                style={style}
                keyboardType={keyboardType}
            />
        </View>
    );
}