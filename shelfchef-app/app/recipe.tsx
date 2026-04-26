import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useState } from "react";


export default function Home() {

    return (
        <View>
            <Text style={styles.title}>View Recipe</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: "bold",
        margin: 20
    }
});
