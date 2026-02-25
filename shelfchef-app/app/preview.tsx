import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { EditIngredientCard } from "@/components/ui/EditIngredient/EditIngredientCard";
import { CardDetail } from "@/components/ui/CardDetail"
import { router } from "expo-router";


export default function Preview() {
    const { data } = useLocalSearchParams();
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [recipeData, setRecipeData] = useState(data ? JSON.parse(data as string) : null);
    const [save, setSave] = useState(false);

    if (!recipeData) return null;

    const updateIngredient = (
        index: number,
        field: "name" | "quantity" | "unit" | "extraDetail",
        value: any
    ) => {
        const updatedIngredients = [...recipeData.ingredients];

        updatedIngredients[index] = {
            ...updatedIngredients[index],
            [field]: {
                ...updatedIngredients[index][field],
                value, confidence: 0
            }
        };

        setRecipeData({
            ...recipeData,
            ingredients: updatedIngredients
        });

        setSave(true);
    };

    return (
        <View>
            <ScrollView style={{ padding: 20, marginBottom: 10 }}>

                <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 20, textAlign: "center" }}>
                    {recipeData.name?.value ?? "Untitled Recipe"}
                </Text>

                {recipeData.ingredients?.map((ing: any, i: number) => {
                    let isEditing = i === editingIndex;
                    const Wrapper: any = isEditing ? View : TouchableOpacity;

                    return (
                        <Wrapper
                            key={i}
                            style={{
                                marginTop: 12,
                                borderStyle: "solid",
                                borderWidth: 1,
                                borderColor: isEditing ? "blue" : "#eee",
                                padding: 12,
                                borderRadius: 8
                                , flexDirection: "column",
                                width: "100%"
                            }}
                            {...(!isEditing && {
                                onPress: () => { setEditingIndex(i); setSave(false); }
                            })}
                        >
                            {isEditing ? (
                                <View>
                                    {/* Editing Viewport */}
                                    <EditIngredientCard ingredient={ing} index={i} label={"Quantity:"} field={"quantity"} updateIngredient={updateIngredient} style={{ width: 50, borderBottomWidth: 1, borderColor: "#ccc", padding: 4 }} keyboardType="numeric" />
                                    <EditIngredientCard ingredient={ing} index={i} label={"Unit:"} field={"unit"} updateIngredient={updateIngredient} style={{ width: 90, borderBottomWidth: 1, borderColor: "#ccc", padding: 4 }} />
                                    <EditIngredientCard ingredient={ing} index={i} label={"Name:"} field={"name"} updateIngredient={updateIngredient} style={{ flex: 1, borderBottomWidth: 1, borderColor: "#ccc", padding: 4 }} />
                                    {ing.extraDetail.value ? (
                                        <EditIngredientCard ingredient={ing} index={i} label={"Extra Detail:"} field={"extraDetail"} updateIngredient={updateIngredient} style={{ flex: 1, borderBottomWidth: 1, borderColor: "#ccc", padding: 4 }} />

                                    ) : (<TouchableOpacity style={{ marginTop: 8 }} onPress={() => {
                                        const updatedIngredients = [...recipeData.ingredients];
                                        updatedIngredients[i].extraDetail.value = "";
                                        setRecipeData({ ...recipeData, ingredients: updatedIngredients });
                                        setSave(true);
                                    }}>
                                        <Text style={{ color: "blue" }}>Add Extra Detail</Text>
                                    </TouchableOpacity>)}
                                    {!save ? <TouchableOpacity style={{ position: "absolute", right: 4, top: 4, backgroundColor: "lightgray", padding: 2, borderRadius: 100 }} onPress={() => {
                                        setEditingIndex(null);
                                        setSave(false);
                                    }}><Ionicons name="close" size={18} color="black" /></TouchableOpacity> :
                                        <TouchableOpacity onPress={() => {
                                            setEditingIndex(null);
                                            setSave(false);
                                        }} style={{ backgroundColor: "lightblue", padding: 8, borderRadius: 4 }}><Text>Add Ingredient</Text></TouchableOpacity>}


                                </View>) : (<View
                                    style={{
                                        gap: 6,
                                        alignItems: "flex-start"
                                    }}
                                >
                                    {ing.quantity?.value && (
                                        <CardDetail ingredient={ing} field="quantity" />
                                    )}

                                    {ing.unit?.value && (
                                        <CardDetail ingredient={ing} field="unit" />
                                    )}

                                    {ing.name?.value && (

                                        <CardDetail ingredient={ing} field="name" />

                                    )}

                                    {ing.extraDetail?.value && (
                                        <CardDetail ingredient={ing} field="extraDetail" />
                                    )
                                    }
                                </View>)
                            }
                        </Wrapper >
                    );
                })}
                <TouchableOpacity style={{ marginTop: 20, alignSelf: "center", backgroundColor: "black", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginBottom: 110 }} >
                    <Text style={{ color: "white" }}>Add an ingredient</Text>
                </TouchableOpacity>

            </ScrollView >
            <View style={{ position: "absolute", bottom: 2, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 20, paddingBottom: 20 }}>
                <TouchableOpacity style={{ backgroundColor: "red", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, opacity: 0.9 }} onPress={() => { setEditingIndex(null); setSave(false); setRecipeData(null); router.push("/capture") }} >
                    <Text style={{ color: "white" }}>Cancel</Text>
                </TouchableOpacity>



                <TouchableOpacity style={{ backgroundColor: "black", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, opacity: 0.9 }} >
                    <Text style={{ color: "white" }}>Save Recipe</Text>
                </TouchableOpacity>

            </View>

        </View >
    );
}
