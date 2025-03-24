import { View, Text, SafeAreaView, Button, Platform } from "react-native";
import { useEffect, useState } from "react";
import CustomHeader from "@/components/CustomHeader";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import TryOnCustomButton from "@/components/TryOnCustomButton";
import {
  useCameraPermissions,
  PermissionStatus,
  launchCameraAsync,
  launchImageLibraryAsync,
} from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import icons from "@/constants/icons";
import { Alert, Linking } from "react-native";
import { Image } from "expo-image";
import { Picker } from "@react-native-picker/picker";
const TryOnHome = () => {
  const [modelImage, setModelImage] = useState<string | null>(null);
  const [garmentImage, setGarmentImage] = useState<string | null>(null);
  const [cameraPermissionStatus, requestPermission] = useCameraPermissions();
  const [selectedTryOnModel, setSelectedTryOnModel] = useState();
  const [idmVtonPrompt, setIdmVtonPrompt] = useState("");
  const params = useLocalSearchParams<{ garmentImageFromClosetUri?: string }>();
  useEffect(() => {
    if (params.garmentImageFromClosetUri) {
      setGarmentImage(params.garmentImageFromClosetUri);
    }
  }, [params.garmentImageFromClosetUri]);
  const pickImageFromGallery = async (type: "model" | "garment") => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      if (type === "model") {
        setModelImage(result.assets[0].uri);
      } else {
        setGarmentImage(result.assets[0].uri);
      }
    }
  };

  const pickImageFromCamera = async (type: "model" | "garment") => {
    if (cameraPermissionStatus?.status !== PermissionStatus.GRANTED) {
      if (!cameraPermissionStatus?.canAskAgain) {
        // If the user denied the permission and if the permission can't be asked again
        // navigate them to settings

        Alert.alert(
          "Camera Permission Required",
          "Please enable camera access in your device settings to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
      }
      requestPermission();
      return;
    }
    let result = await launchCameraAsync({
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      if (type === "model") {
        setModelImage(result.assets[0].uri);
      } else {
        setGarmentImage(result.assets[0].uri);
      }
    }
  };
  const selectFromCloset = () => {
    router.push({
      pathname: "./TryOnCloset",
    });
  };
  const ModelButtons = () => {
    return (
      <View className="flex-row justify-center  items-center gap-20 mt-5">
        <TryOnCustomButton
          imageUri={icons.image}
          title="Image"
          onPress={() => pickImageFromGallery("model")}
        />
        <TryOnCustomButton
          imageUri={icons.camera}
          title="Camera"
          onPress={() => pickImageFromCamera("model")}
        />
      </View>
    );
  };

  const GarmentButtons = () => {
    return (
      <View className="flex-row justify-center  items-center gap-20 mt-5">
        <TryOnCustomButton
          imageUri={icons.image}
          title="Image"
          onPress={() => pickImageFromGallery("garment")}
        />
        <TryOnCustomButton
          imageUri={icons.camera}
          title="Camera"
          onPress={() => pickImageFromCamera("garment")}
        />
        <TryOnCustomButton
          imageUri={icons.closet}
          title="Closet"
          onPress={() => selectFromCloset()}
        />
      </View>
    );
  };
  return (
    <SafeAreaView className="bg-sand-dark flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="px-5"
        contentContainerClassName="pb-20"
      >
        <CustomHeader title="Try On" showBackButton={false} />
        <View>
          <View>
            <Text className="font-S-Regular text-gray-700">Model</Text>
            {modelImage ? (
              <View>
                <Image
                  source={modelImage}
                  className=" h-[15rem]"
                  contentFit="contain"
                />
                <ModelButtons />
              </View>
            ) : (
              <ModelButtons />
            )}
          </View>
          <View className="mt-2">
            <Text className="font-S-Regular text-gray-700">Clothes</Text>
            {garmentImage ? (
              <View>
                <Image
                  source={garmentImage}
                  className=" h-[15rem]"
                  contentFit="contain"
                />
                <GarmentButtons />
              </View>
            ) : (
              <GarmentButtons />
            )}
          </View>
        </View>
        <View className="mt-5">
          <Text className="font-S-Regular text-gray-700">
            Select a Try-On Model
          </Text>
          <Picker
            selectedValue={selectedTryOnModel}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedTryOnModel(itemValue)
            }
            itemStyle={{ backgroundColor: "transparent" }}
          >
            <Picker.Item
              color="black"
              label="TryOnDiffusion"
              value="tryondiffusion"
            />
            <Picker.Item
              color="black"
              label="StableVITON"
              value="stableviton"
            />
            <Picker.Item color="black" label="IDM-VTON" value="idmvton" />
          </Picker>
        </View>
        {selectedTryOnModel === "idmvton" && (
          <TextInput
            placeholder="Please enter a prompt*"
            value={idmVtonPrompt}
            onChangeText={setIdmVtonPrompt}
            placeholderTextColor={"#776E65"}
            className="font-S-Regular border-b border-gray-300 mb-4 py-2 mt-2"
          />
        )}
        <View className="mt-5">
          <Text className="font-S-Regular text-gray-700">Result</Text>
          <View className="flex-col items-center justify-center bg-white-dark aspect-[4/5] rounded-lg">
            <Text className="font-S-Regular text-gray-700">
              Upload image to see result
            </Text>
            <Button title="Generate"></Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TryOnHome;
