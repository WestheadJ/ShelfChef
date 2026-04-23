import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useState } from "react";


export default function Home() {

    return (
        <View >
            <Text style={{ fontSize: 24, fontWeight: "bold", margin: 20 }}>View Recipe</Text>
        </View>
    );
}

