import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";

export default function Capture() {
    const cameraRef = useRef<CameraView | null>(null);

    const [permission, requestPermission] = useCameraPermissions();
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission, requestPermission]);

    const takePhoto = async () => {
        if (!cameraRef.current) return;

        try {
            setProcessing(true);

            const photo = await cameraRef.current.takePictureAsync({
                quality: 1
            });

            if (!photo?.uri) return;

            // Navigate to confirm screen
            router.push({
                pathname: "/confirm",
                params: {
                    photoUri: photo.uri
                }
            });

        } catch (error) {
            console.error("Capture error:", error);
        } finally {
            setProcessing(false);
        }
    };

    // Permission loading
    if (!permission) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Checking camera permissions…</Text>
            </View>
        );
    }

    // Permission denied state
    if (!permission.granted) {
        return (
            <View style={{
                flex: 0.9,
                justifyContent: "center",
                alignItems: "center",
                padding: 20
            }}>
                <Text style={{ textAlign: "center" }}>
                    Camera permission is required to scan recipes.
                </Text>

                <TouchableOpacity
                    onPress={requestPermission}
                    style={{
                        marginTop: 20,
                        backgroundColor: "#222",
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderRadius: 10
                    }}
                >
                    <Text style={{ color: "white" }}>Grant Camera Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing="back"
                autofocus="on"
                active={true}
            />

            {!processing && <TouchableOpacity
                onPress={takePhoto}
                style={{
                    position: "absolute",
                    bottom: 50,
                    alignSelf: "center",
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 60
                }}
            >
                <Text style={{ fontWeight: "600" }}>
                    {processing ? "Processing…" : "Scan Page"}
                </Text>
            </TouchableOpacity>}

            {processing && (
                <View
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(93, 93, 93, 0.79)"
                    }}
                >
                    <ActivityIndicator size="large" color="white" />
                </View>
            )}
        </View>
    );
}