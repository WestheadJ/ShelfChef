import { View, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import SectionTitle from "@/components/ui/Typography/SectionTitle";
import BackButton from "@/components/ui/Button/BackButton";

export default function ViewRecipe() {
    const { data }: any = useLocalSearchParams();

    const recipeData = JSON.parse(data);

    console.log("Viewing recipe with data:", recipeData.recipeName);
    return (
        <View>
            <BackButton onPress={() => { router.dismissAll(); router.replace("/") }} />
            <SectionTitle title={recipeData.recipeName || "Untitled Recipe"} textAlign="center" />
        </View>
    )
}