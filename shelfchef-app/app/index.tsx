import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import TextRecognition from "@react-native-ml-kit/text-recognition";

export default function Index() {
  const cameraRef = useRef<CameraView | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const takePhotoAndRunOCR = async () => {
    if (!cameraRef.current) return;

    try {
      setProcessing(true);

      // 1️⃣ Capture photo (this already creates a temp file)
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      // This URI is valid and readable by ML Kit
      setPhotoUri(photo.uri);

      // 2️⃣ Run on-device OCR directly on the temp file
      const result = await TextRecognition.recognize(photo.uri);

      console.log("OCR FULL RESULT:", result);
      console.log("OCR TEXT:", result.text);

      setOcrText(result.text || "No text detected");
    } catch (error) {
      console.error("OCR failed:", error);
      setOcrText("OCR failed");
    } finally {
      setProcessing(false);
    }
  };

  // ---- Permission states ----

  if (!permission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Checking camera permissions…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Camera permission required</Text>
        <TouchableOpacity onPress={requestPermission} style={{ marginTop: 10 }}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---- Main UI ----

  return (
    <View style={{ flex: 1 }}>
      {!photoUri ? (
        <>
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />

          <TouchableOpacity
            onPress={takePhotoAndRunOCR}
            style={{
              position: "absolute",
              bottom: 40,
              alignSelf: "center",
              backgroundColor: "white",
              padding: 18,
              borderRadius: 50,
            }}
          >
            <Text>{processing ? "Processing…" : "Scan Text"}</Text>
          </TouchableOpacity>

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
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </>
      ) : (
        <ScrollView style={{ padding: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            Captured Image
          </Text>

          <Image
            source={{ uri: photoUri }}
            style={{ width: "100%", height: 400, marginVertical: 15 }}
          />

          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            OCR Output
          </Text>

          <Text selectable style={{ marginTop: 10 }}>
            {ocrText}
          </Text>

          <TouchableOpacity
            onPress={() => {
              setPhotoUri(null);
              setOcrText("");
            }}
            style={{
              marginTop: 30,
              backgroundColor: "#eee",
              padding: 15,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text>Scan Another</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}