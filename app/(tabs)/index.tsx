import Ionicons from "@expo/vector-icons/Ionicons";
import { useFacesInPhoto } from "@infinitered/react-native-mlkit-face-detection";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  CameraDevice,
  PhotoFile,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";

const PreviewImageWidth = 300;
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const camera = useRef<Camera>(null);
  const [clickedPhoto, setClickedPhoto] = useState<PhotoFile | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [currentCamera, setCurrentCamera] = useState<"back" | "front">("back");
  const device = useCameraDevice(currentCamera);
  const { hasPermission, requestPermission } = useCameraPermission();
  const { faces, clearFaces } = useFacesInPhoto(
    clickedPhoto ? `file://${clickedPhoto.path}` : ""
  );

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const onCapturePress = useCallback(async () => {
    try {
      if (camera?.current) {
        const photo = await camera.current.takePhoto();
        setClickedPhoto(photo);
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
    }
  }, []);

  const onCloseModal = useCallback(async () => {
    clearFaces();
    setClickedPhoto(null);
  }, []);

  const toggleFlash = useCallback(() => {
    setFlashEnabled((prev) => !prev);
  }, []);

  const toggleCameraLens = useCallback(() => {
    setCurrentCamera((prev) => (prev === "back" ? "front" : "back"));
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.centeredContainer}>
        <Text>Camera permission not granted</Text>
        <Button
          title="Authorize Permission"
          onPress={() => {
            requestPermission();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.flexContainer}>
        <View style={styles.cameraContainer}>
          <Camera
            isActive={hasPermission && !clickedPhoto}
            device={device as CameraDevice}
            ref={camera}
            photo
            torch={flashEnabled ? "on" : "off"}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity onPress={toggleFlash} activeOpacity={0.8}>
            <Ionicons
              color={flashEnabled ? "yellow" : "black"}
              name={"flash"}
              size={40}
            />
            <Text style={styles.actionTitle}>Flash</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCapturePress} activeOpacity={0.8}>
            <Ionicons color="black" name={"aperture-outline"} size={40} />
            <Text style={styles.actionTitle}>Capture</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleCameraLens} activeOpacity={0.8}>
            <Ionicons color="black" name={"arrow-undo"} size={40} />
            <Text style={styles.actionTitle}>Change</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {!!clickedPhoto && (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            styles.photoDisplayContainer,
            { top: insets.top },
          ]}
        >
          <ScrollView>
            <View
              style={{
                alignSelf: "center",
                position: "relative",
              }}
            >
              <Image
                style={{
                  ...styles.clickedPhoto,
                  aspectRatio: clickedPhoto.height / clickedPhoto.width || 1,
                }}
                source={{
                  uri: `file://${clickedPhoto.path}`,
                }}
              />
              {faces?.map?.((face, index) => {
                const scaleX = PreviewImageWidth / clickedPhoto.width;
                const scaleY = PreviewImageWidth / clickedPhoto.height;
                return (
                  <View
                    key={index}
                    style={[
                      styles.faceBox,
                      {
                        left: face.frame.origin.x * scaleX,
                        top: face.frame.origin.y * scaleY,
                        width: face.frame.size.x * scaleX,
                        height: face.frame.size.y * scaleY,
                      },
                    ]}
                  />
                );
              })}
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>Photo Data</Text>
              <View style={styles.infoContent}>
                {Object.entries(clickedPhoto).map(([key, value]) => (
                  <Text key={key}>
                    {key}: <Text>{value.toString()}</Text>
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>Facial Recognition Data</Text>
              <View style={styles.infoContent}>
                {faces?.length ? (
                  <Text>{JSON.stringify(faces)}</Text>
                ) : (
                  <Text>No Face Detected</Text>
                )}
              </View>
            </View>
          </ScrollView>
          <Button title="Close" onPress={onCloseModal} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  flexContainer: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    backgroundColor: "white",
  },
  captureButtonContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 48,
  },
  actionTitle: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  photoDisplayContainer: {
    padding: 16,
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  clickedPhoto: {
    width: PreviewImageWidth,
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: 16,
  },
  faceBox: {
    position: "absolute",
    borderColor: "red",
    borderWidth: 2,
    borderRadius: 4,
  },
  infoContainer: {
    borderWidth: 1,
    borderColor: "#111827",
    padding: 4,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoContent: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
