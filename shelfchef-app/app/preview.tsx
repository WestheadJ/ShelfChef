import { View, Text, Image, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";


export default function Preview() {
    const { data } = useLocalSearchParams();
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [recipeData, setRecipeData] = useState(data ? JSON.parse(data as string) : null);
    const [save, setSave] = useState(false);

    if (!recipeData) return null;

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
                            }}
                            {...(!isEditing && {
                                onPress: () => { setEditingIndex(i); setSave(false); }
                            })}
                        >
                            {isEditing ? (
                                <View>
                                    {/* Editing Viewport */}
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                        <Text>Quantity:</Text>
                                        <TextInput
                                            keyboardType="numeric"
                                            value={String(ing.quantity?.value ?? "")}
                                            onChangeText={(text) => {
                                                const updatedIngredients = [...recipeData.ingredients];
                                                updatedIngredients[i].quantity.value = text;
                                                setRecipeData({ ...recipeData, ingredients: updatedIngredients });
                                                setSave(true);
                                            }}
                                            style={{ width: 50, borderBottomWidth: 1, borderColor: "#ccc", padding: 4 }}
                                        />
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
                                        <Text>Unit:</Text>
                                        <TextInput
                                            value={ing.unit.value}
                                            onChangeText={(text) => {
                                                const updatedIngredients = [...recipeData.ingredients];
                                                updatedIngredients[i].unit.value = text;
                                                setRecipeData({ ...recipeData, ingredients: updatedIngredients });
                                                setSave(true);
                                                console.log("Updated unit:", text);

                                            }}
                                            style={{ width: 60, borderBottomWidth: 1, borderColor: "#ccc", padding: 4 }}
                                        />
                                    </View>
                                    <TextInput
                                        value={ing.name.value}
                                        onChangeText={(text) => {
                                            const updatedIngredients = [...recipeData.ingredients];
                                            updatedIngredients[i].name.value = text;
                                            setRecipeData({ ...recipeData, ingredients: updatedIngredients });
                                            setSave(true);

                                        }}
                                    />
                                    {ing.extraDetail.value ? (
                                        <View style={{ marginTop: 8 }}>
                                            <Text > Extra Detail:</Text>
                                            <TextInput
                                                value={ing.extraDetail.value}
                                                onChangeText={(text) => {
                                                    const updatedIngredients = [...recipeData.ingredients];
                                                    updatedIngredients[i].extraDetail.value = text;
                                                    setRecipeData({ ...recipeData, ingredients: updatedIngredients });
                                                    setSave(true);

                                                }}
                                                style={{ borderBottomWidth: 1, borderColor: "#ccc", padding: 4 }}
                                            />
                                        </View>

                                    ) : (<TouchableOpacity style={{ marginTop: 8 }} onPress={() => {
                                        const updatedIngredients = [...recipeData.ingredients];
                                        updatedIngredients[i].extraDetail.value = "Add extra detail here";
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


                                </View>) : (<View>
                                    <Text>
                                        {ing.quantity.value} {ing.unit.value} {ing.name.value}
                                    </Text>

                                    {ing.extraDetail.value ? (
                                        <><Text style={{ fontSize: 12, opacity: 0.6 }}>Extra Detail:</Text>
                                            <Text style={{ fontSize: 12, opacity: 0.6 }}>{ing.extraDetail.value}</Text>
                                        </>
                                    ) : null}
                                    {!save && <Ionicons name="pencil" size={12} style={{ position: "absolute", right: 4, top: 4, padding: 6, backgroundColor: "lightgray", borderRadius: 100 }} color="black" />}
                                </View>)
                            }
                        </Wrapper>
                    );
                })}
                <TouchableOpacity style={{ marginTop: 20, alignSelf: "center", backgroundColor: "black", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginBottom: 110 }} >
                    <Text style={{ color: "white" }}>Add an ingredient</Text>
                </TouchableOpacity>

            </ScrollView >
            <View style={{ position: "absolute", bottom: 20, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 20, paddingBottom: 20 }}>
                <TouchableOpacity style={{ backgroundColor: "black", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} >
                    <Text style={{ color: "white" }}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ backgroundColor: "black", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }} >
                    <Text style={{ color: "white" }}>Save Recipe</Text>
                </TouchableOpacity>

            </View>

        </View >
    );
}
