import {
  View,
  Text,
  SafeAreaView,
  Button,
  Platform,
  Alert,
  Linking,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useEffect, useReducer } from "react";
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
import { Image } from "expo-image";
import { Picker } from "@react-native-picker/picker";
import { IdmVtonImageUploader } from "@/lib/AI/ImageUploader";
import { OpenPoseCategoryType } from "@/lib/AI/ImageUploader";
import Checkbox from "expo-checkbox";
import PickGarment from "./IDMVTON/PickGarment";
import PickModel from "./IDMVTON/PickModel";
import Result from "./IDMVTON/Result";
import { useAppwrite } from "@/lib/useAppWrite";
import { fetchAllTryOnResults } from "@/lib/AI/TryOnResult";
// Define the initial state
// const initialState = {
//   modelImage: null as string | null,
//   modelMaskImage: null as string | null,
//   garmentImage: null as string | null,
//   generatedImageUri: null as string | null,
//   selectedTryOnModel: "",
//   idmVtonPrompt: "",
//   idmVtonMaskArea: "upper_body" as OpenPoseCategoryType,
//   isLoading: false,
//   autoMask: false,
// };

// Define the reducer function
// const reducer = (
//   state: typeof initialState,
//   action: { type: string; payload?: any }
// ) => {
//   switch (action.type) {
//     case "SET_MODEL_IMAGE":
//       return { ...state, modelImage: action.payload };
//     case "SET_GARMENT_IMAGE":
//       return { ...state, garmentImage: action.payload };
//     case "SET_GENERATED_IMAGE_URI":
//       return { ...state, generatedImageUri: action.payload };
//     case "SET_SELECTED_TRY_ON_MODEL":
//       return { ...state, selectedTryOnModel: action.payload };
//     case "SET_IDM_VTON_PROMPT":
//       return { ...state, idmVtonPrompt: action.payload };
//     case "SET_IDM_VTON_MASK_AREA":
//       return { ...state, idmVtonMaskArea: action.payload };
//     case "SET_IS_LOADING":
//       return { ...state, isLoading: action.payload };
//     case "SET_AUTO_MASK":
//       return { ...state, autoMask: action.payload };
//     case "SET_MODEL_MASK_IMAGE":
//       return { ...state, modelMaskImage: action.payload };
//     default:
//       return state;
//   }
// };

const TryOnHome = () => {
  // const [state, dispatch] = useReducer(reducer, initialState);
  // const [cameraPermissionStatus, requestPermission] = useCameraPermissions();
  // const params = useLocalSearchParams<{
  //   garmentImageFromClosetUri?: string;
  //   garmentImageFromClosetTitle?: string;
  //   modelImageUri?: string;
  //   modelMaskUri?: string;
  // }>();

  // useEffect(() => {
  //   if (params.garmentImageFromClosetUri) {
  //     dispatch({
  //       type: "SET_GARMENT_IMAGE",
  //       payload: params.garmentImageFromClosetUri,
  //     });
  //   }
  //   if (params.garmentImageFromClosetTitle) {
  //     dispatch({
  //       type: "SET_IDM_VTON_PROMPT",
  //       payload: params.garmentImageFromClosetTitle,
  //     });
  //   }
  //   if (params.modelImageUri) {
  //     console.log("Model image URI:", params.modelImageUri);
  //     dispatch({ type: "SET_MODEL_IMAGE", payload: params.modelImageUri });
  //   }
  //   if (params.modelMaskUri) {
  //     console.log("Model mask URI:", params.modelMaskUri);
  //     dispatch({ type: "SET_MODEL_MASK_IMAGE", payload: params.modelMaskUri });
  //   }
  // }, [
  //   params.garmentImageFromClosetUri,
  //   params.garmentImageFromClosetTitle,
  //   params.modelImageUri,
  //   params.modelMaskUri,
  // ]);

  // const pickImageFromGallery = async (type: "model" | "garment") => {
  //   let result = await launchImageLibraryAsync({
  //     mediaTypes: ["images"],
  //     quality: 1,
  //     // allowsEditing: true,
  //   });

  //   if (!result.canceled) {
  //     if (type === "model") {
  //       dispatch({ type: "SET_MODEL_IMAGE", payload: result.assets[0].uri });
  //     } else {
  //       dispatch({ type: "SET_GARMENT_IMAGE", payload: result.assets[0].uri });
  //     }
  //   }
  // };

  // const pickImageFromCamera = async (type: "model" | "garment") => {
  //   if (cameraPermissionStatus?.status !== PermissionStatus.GRANTED) {
  //     if (!cameraPermissionStatus?.canAskAgain) {
  //       Alert.alert(
  //         "Camera Permission Required",
  //         "Please enable camera access in your device settings to use this feature.",
  //         [
  //           { text: "Cancel", style: "cancel" },
  //           {
  //             text: "Open Settings",
  //             onPress: () => {
  //               if (Platform.OS === "ios") {
  //                 Linking.openURL("app-settings:");
  //               } else {
  //                 Linking.openSettings();
  //               }
  //             },
  //           },
  //         ]
  //       );
  //     }
  //     requestPermission();
  //     return;
  //   }
  //   let result = await launchCameraAsync({
  //     mediaTypes: ["images"],
  //     quality: 1,
  //     allowsEditing: true,
  //   });

  //   if (!result.canceled) {
  //     if (type === "model") {
  //       dispatch({ type: "SET_MODEL_IMAGE", payload: result.assets[0].uri });
  //     } else {
  //       dispatch({ type: "SET_GARMENT_IMAGE", payload: result.assets[0].uri });
  //     }
  //   }
  // };

  // const selectFromCloset = () => {
  //   router.push({
  //     pathname: "./TryOnCloset",
  //   });
  // };

  // const generateImage = async () => {
  //   if (!state.modelImage || !state.garmentImage) {
  //     Alert.alert("Please select both model and garment images");
  //     return;
  //   }
  //   if (!state.autoMask && !state.modelMaskImage) {
  //     Alert.alert("Please create a mask image by clicking the model image");
  //     return;
  //   }
  //   dispatch({ type: "SET_IS_LOADING", payload: true });
  //   const generatedUri = await IdmVtonImageUploader(
  //     state.garmentImage,
  //     state.modelImage,
  //     state.idmVtonPrompt,
  //     state.idmVtonMaskArea,
  //     state.modelMaskImage
  //   );
  //   dispatch({ type: "SET_IS_LOADING", payload: false });
  //   if (generatedUri === null) {
  //     Alert.alert(
  //       "Error",
  //       "Failed to generate image.\n Please try again later."
  //     );
  //     return;
  //   }
  //   dispatch({ type: "SET_GENERATED_IMAGE_URI", payload: generatedUri ?? "" });
  // };
  // const handleImageEditorResult = (editedUri: string) => {
  //   if (editedUri) {
  //     dispatch({ type: "SET_MODEL_IMAGE", payload: editedUri });
  //   }
  // };
  // const navigateToImageEditor = (imageUri: string) => {
  //   router.push({
  //     pathname: "/(root)/Utils/ImageEditor",
  //     params: { modelImageUri: imageUri },
  //   });
  // };

  const navigateToGenerateImageSteps = (model: string) => {
    router.navigate({
      pathname: model === "IDMVTON" ? "./IDMVTON" : "./GPT4o",
    });
  };
  const {
    data: tryOnResults,
    refetch,
    loading,
  } = useAppwrite({ fn: fetchAllTryOnResults });
  useEffect(() => {
    refetch();
  }, []);
  const TryOnButtonComponent = () => (
    <View className="">
      <Text className="font-S-Regular text-gray-700 my-2">
        Select a Try-On Model
      </Text>
      <View className="flex-row justify-begin items-center gap-5 w-full ">
        <TouchableOpacity
          className="py-2.5 px-4 bg-green-darker rounded my-2 flex-1"
          onPress={() => navigateToGenerateImageSteps("IDMVTON")}
        >
          <Text className="text-white font-S-Medium text-center">IDMVTON</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-2.5 px-4 bg-green-darker rounded my-2 flex-1"
          onPress={() => navigateToGenerateImageSteps("GPT4o")}
        >
          <Text className="text-white font-S-Medium text-center">GPT-4o</Text>
        </TouchableOpacity>
      </View>
      <Text className="font-S-Regular text-gray-700 my-2">
        Recent Try-On Results
      </Text>
    </View>
  );
  const navigateToViewImagePage = (imageUri: string) => {
    router.push({
      pathname: "/(root)/Utils/[imageURL]",
      params: { imageURL: imageUri },
    });
  };
  return (
    <SafeAreaView className="bg-sand-dark flex-1">
      <CustomHeader title="Try On" showBackButton={false} />
      <View className=" flex-1 px-5">
        <TryOnButtonComponent />

        <FlatList
          data={tryOnResults}
          renderItem={({ item }) => (
            <TouchableOpacity
              className=" mr-2"
              onPress={() => navigateToViewImagePage(item)}
            >
              <Image
                source={item}
                className="w-full h-[35rem]  m-5 ml-0 rounded-lg aspect-[3/4]"
                contentFit="contain"
              />
            </TouchableOpacity>
          )}
          className=""
          // numColumns={1}
          contentContainerClassName="h-full pb-20"
          // columnWrapperClassName="flex-row justify-between my-2 bg-black"
          showsVerticalScrollIndicator={false}
          horizontal={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default TryOnHome;
