import React, { useRef, useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet
} from "react-native";

import { CameraView, useCameraPermissions } from "expo-camera";
import { router, useLocalSearchParams } from "expo-router";
import ScannerOverlayBox from "@/components/ui/Camera/ScannerOverlayBox";
import AppButton from "@/components/ui/Button/AppButton";
import { setCapturedPhotoUri } from "@/services/capture/captureSession";

export default function Capture() {
    const cameraRef = useRef<CameraView | null>(null);

    const [permission, requestPermission] = useCameraPermissions();
    const [processing, setProcessing] = useState(false);
    const { fromHome: fromHomeParam } = useLocalSearchParams();
    const fromHome = fromHomeParam === "true";



    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission, requestPermission]);




    const takePhoto = async () => {
        if (!cameraRef.current || processing) return;

        try {
            setProcessing(true);

            const photo = await cameraRef.current.takePictureAsync({
                quality: 1
            });

            if (!photo?.uri) return;

            setCapturedPhotoUri(photo.uri);
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
            <View style={styles.centeredContainer}>
                <Text>Checking camera permissions…</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.centeredText}>
                    Camera permission is required to scan recipes.
                </Text>

                <AppButton
                    title="Grant Camera Permission"
                    onPress={requestPermission}
                    style={styles.permissionButton}
                />
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
        <View style={styles.container}>
            <View style={styles.cameraContainer}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.fullFlex}
                    onPress={handleFocus}
                >
                    <CameraView
                        ref={cameraRef}
                        style={styles.fullFlex}
                        facing="back"
                        autofocus="on"
                        active={true}
                        zoom={0}

                    />
                </TouchableOpacity>
            </View>

            <ScannerOverlayBox />

            {!processing && (
                <AppButton
                    title="Scan Page"
                    onPress={takePhoto}
                    style={styles.scanButton}
                    textStyle={styles.scanButtonText}
                />
            )}



            {processing && (
                <View
                    style={styles.processingOverlay}
                >
                    <ActivityIndicator size="large" color="white" />
                </View>
            )}

            {fromHome && (
                <AppButton title="Go Back" onPress={() => router.replace({
                    pathname: "/",
                })} style={styles.backButton} textStyle={styles.backButtonText}>
                </AppButton>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cameraContainer: {
        flex: 1
    },
    fullFlex: {
        flex: 1
    },
    centeredContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    permissionContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    centeredText: {
        textAlign: "center"
    },
    permissionButton: {
        marginTop: 20,
        backgroundColor: "#222",
        borderRadius: 10
    },
    scanButton: {
        position: "absolute",
        bottom: 20,
        right: 60,
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 60
    },
    scanButtonText: {
        fontWeight: "600",
        color: "black"
    },
    processingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)"
    },
    backButton: {
        position: "absolute",
        bottom: 20,
        left: 60,

        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 60
    },

    backButtonText: {
        color: "black",
        fontWeight: "600"
    }
});
