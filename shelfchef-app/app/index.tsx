import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import { reset, getRecentRecipes, deleteRecipe } from "@/services/db/dbAPI"; // Added deleteRecipe
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from "@expo/vector-icons";
import AppButton from "@/components/ui/Button/AppButton";
import RecentRecipeCard from "@/components/ui/Recipe/RecentRecipeCard";

export default function Home() {
    const [recipes, setRecipes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch recipes from DB
    const fetchRecipes = async () => {
        try {
            const data = await getRecentRecipes(10);
            setRecipes(data);
            // If no recipes exist, automatically go to the camera
            if (data.length === 0) {
                router.replace("/capture?fromHome=true");
            }
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchRecipes();
        }, [])
    );

    // Delete Logic
    const handleDelete = (recipeID: number) => {
        Alert.alert("Delete Recipe", "Are you sure you want to remove this from your shelf?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    await deleteRecipe(recipeID); // Assuming this exists in your dbAPI
                    fetchRecipes(); // Refresh the list
                }
            },
        ]);
    };

    // The "Underneath" Delete Button
    const renderRightActions = (item: any) => {
        return (
            <TouchableOpacity
                onPress={() => handleDelete(item.recipeID)}
                style={styles.deleteButton}
                activeOpacity={0.7}
            >
                <Ionicons name="trash" size={24} color="white" />
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading recipes...</Text>
            </View>
        );
    }

    return (
        <GestureHandlerRootView style={styles.root}>
            <View style={styles.container}>
                {recipes.length === 0 ? (
                    <View style={styles.center}>
                        <Text>No recipes yet.</Text>
                        <AppButton
                            title="Scan Cookbook"
                            onPress={() => router.push("/capture?fromHome=true")}
                            style={styles.button}
                        />
                    </View>
                ) : (
                    <FlatList
                        data={recipes}
                        keyExtractor={(item) => item.recipeID.toString()}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => (
                            <Swipeable
                                renderRightActions={() => renderRightActions(item)}
                                containerStyle={styles.swipeableContainer}
                            >
                                <RecentRecipeCard
                                    item={item}
                                    onPress={() => router.push({ pathname: "/preview", params: item })}
                                />
                            </Swipeable>
                        )}
                    />
                )}

                {/* Bottom Buttons */}
                <View style={styles.bottomActions}>
                    <AppButton
                        title="Capture"
                        style={styles.footerButton}
                        onPress={() => router.push({ pathname: "/capture", params: { fromHome: true } })}
                    />

                    <AppButton
                        title="Reset DB"
                        style={styles.footerButton}
                        onPress={async () => { await reset(); setRecipes([]); router.push("/capture") }}
                    />
                </View>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: "#f8f8f8"
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    swipeableContainer: {
        backgroundColor: "#FF3B30", // The red tray under the card
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden', // This is the magic: clips the card's square edge
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    deleteButton: {
        width: 80,
        backgroundColor: "#FF3B30",
        justifyContent: "center",
        alignItems: "center",
    },
    deleteText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 4,
    },
    button: {
        marginTop: 20,
        padding: 15,
        backgroundColor: "#222",
        borderRadius: 12
    },
    listContent: {
        padding: 16
    },
    bottomActions: {
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingHorizontal: 16
    },
    footerButton: {
        backgroundColor: "black",
        minWidth: 100,
        alignItems: "center"
    }
});
