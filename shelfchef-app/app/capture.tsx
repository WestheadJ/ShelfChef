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

        if (!cameraRef.current) return;
    const [zoom] = useState(0.5); // OCR-friendly default zoom

    // Small helper delay for stabilization
    const delay = (ms: number) =>
        new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Capture quality gate (simple heuristic version)
     * Currently only uses stabilization delay.
     * Can be upgraded later with blur detection.
     */
    const waitForCameraStability = async () => {
        await delay(300);
        return true;
    };

    const takePhoto = async () => {
        if (!cameraRef.current || processing) return;

        try {
            setProcessing(true);

            const stable = await waitForCameraStability();
            if (!stable) return;

            const photo = await cameraRef.current.takePictureAsync({
                quality: 1,
                skipProcessing: false,
            });

            if (!photo?.uri) return;

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

    // Permission request
    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    // Permission loading state
    if (!permission) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Checking camera permissions…</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 20
            }}>
                <Text style={{ textAlign: "center" }}>
                    Camera permission is required to scan pages.
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
                    <Text style={{ color: "white" }}>
                        Grant Camera Permission
                    </Text>
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
                zoom={0}
            />

            {/* Capture Button */}
            {!processing && (
                <TouchableOpacity
                    onPress={takePhoto}
                    style={{
                        position: "absolute",
                        bottom: 20,
                        alignSelf: "center",
                        backgroundColor: "white",
                        padding: 20,
                        borderRadius: 60
                    }}
                >
                    <Text style={{ fontWeight: "600" }}>
                        Scan Page
                    </Text>
                </TouchableOpacity>
            )}

            {/* Processing Overlay */}
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
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >
                    <ActivityIndicator size="large" color="white" />
                </View>
            )}
        </View>
    );
}