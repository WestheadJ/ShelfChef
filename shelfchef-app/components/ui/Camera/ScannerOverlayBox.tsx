import React from "react";
import { View, Text } from "react-native";

const cornerStyle = (
    vertical: "top" | "bottom",
    horizontal: "left" | "right",
) => ({
    position: "absolute",
    width: 40,
    height: 40,
    borderColor: "lightgray",
    borderTopWidth: vertical === "top" ? 5 : 0,
    borderBottomWidth: vertical === "bottom" ? 5 : 0,
    borderLeftWidth: horizontal === "left" ? 5 : 0,
    borderRightWidth: horizontal === "right" ? 5 : 0,
    [vertical]: 0,
    [horizontal]: 0,
});



export default function ScannerOverlayBox() {
    return (
        <View
            pointerEvents="none"
            style={{
                position: "absolute",
                top: "5%",
                left: "5%",
                width: "90%",
                height: "80%",
            }}
        >
            <Text style={{ color: "white", fontWeight: 500, alignSelf: "center", top: 30, maxWidth: "70%", textAlign: "center" }}>Make sure the recipe is in the box</Text>
            <View style={cornerStyle("top", "left")} />
            <View style={cornerStyle("top", "right")} />
            <View style={cornerStyle("bottom", "left")} />
            <View style={cornerStyle("bottom", "right")} />
        </View>
    );
}