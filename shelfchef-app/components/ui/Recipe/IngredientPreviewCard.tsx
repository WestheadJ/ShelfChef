import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CardDetail } from "@/components/ui/EditIngredient/CardDetail";

type Props = {
    ingredient: any;
    onPress: () => void;
};

export default function IngredientPreviewCard({ ingredient, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View>
                {!!ingredient.quantity?.value && <CardDetail ingredient={ingredient} field="quantity" />}
                {!!ingredient.unit?.value && <CardDetail ingredient={ingredient} field="unit" />}
                {!!ingredient.name?.value && <CardDetail ingredient={ingredient} field="name" />}
                {!!ingredient.extraDetail?.value && <CardDetail ingredient={ingredient} field="extraDetail" />}
            </View>
            <Ionicons name="pencil" size={18} color="gray" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 12,
        borderWidth: 1,
        borderColor: "#eee",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between"
    }
});
