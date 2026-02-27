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

    const [zoom, setZoom] = useState(0)
    const [lenses, setLenses] = useState(["default"])
    const [selectedLense, setSelectedLense] = useState("default")

    const setCameras = async () => {
        if (!cameraRef.current) return;
        try {
            const cameras = await cameraRef.current.getAvailableLensesAsync();
            let arr: string[] = []
            cameras.map((i) => { arr.push(i) })
            setLenses(arr)
            setSelectedLense(lenses[0])
        } catch (error) {
            console.error("Error fetching cameras:", error);
        }
    }


    useEffect(() => {
        setCameras()
    }, [])

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
                zoom={zoom}
                selectedLens={selectedLense}
            />

            <View style={{ position: "absolute", bottom: 100, alignSelf: "center", flexDirection: "row", gap: 10, }}>


                {lenses.map((item: string, key: number) => {
                    return (
                        <TouchableOpacity
                            style={{ width: 35, height: 35, justifyContent: "center", borderRadius: 100, backgroundColor: "white", opacity: 0.6 }} key={key}
                            onPress={() => { setSelectedLense(lenses[key]) }}
                        >
                            <Text style={{ textAlign: "center" }}>{key.toString()}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>

            {
                !processing && <TouchableOpacity
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
                        {processing ? "Processing…" : "Scan Page"}
                    </Text>
                </TouchableOpacity>
            }

            {
                processing && (
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
                )
            }
        </View >
    );
}