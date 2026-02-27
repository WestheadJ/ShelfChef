import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import ScannerOverlayBox from "@/components/ui/Camera/ScannerOverlayBox";

export default function Capture() {
    const cameraRef = useRef<CameraView | null>(null);

    const [permission, requestPermission] = useCameraPermissions();
    const [processing, setProcessing] = useState(false);



    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);



    // -------- CAPTURE --------
    const takePhoto = async () => {
        if (!cameraRef.current || processing) return;

        try {
            setProcessing(true);

            const photo = await cameraRef.current.takePictureAsync({
                quality: 1
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

    // -------- PERMISSION UI --------
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

    const handleFocus = async () => {
        if (!cameraRef.current) return;

        try {
            await cameraRef.current.forceUpdate();
        } catch (err) {
            console.log("Focus not supported on this device", err);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ flex: 1 }}
                    onPress={handleFocus}
                >
                    <CameraView
                        ref={cameraRef}
                        style={{ flex: 1 }}
                        facing="back"
                        autofocus="on"
                        active={true}
                        zoom={0}

                    />
                </TouchableOpacity>
            </View>

            <ScannerOverlayBox />

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
                        backgroundColor: "rgba(0,0,0,0.6)"
                    }}
                >
                    <ActivityIndicator size="large" color="white" />
                </View>
            )}
        </View>
    );
}