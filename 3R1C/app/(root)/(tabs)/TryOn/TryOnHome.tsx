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
import { checkAbsoultePath } from "@/lib/LocalStoreManager";

const TryOnHome = () => {

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
      params: { imageURL: checkAbsoultePath(imageUri) },
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
              onPress={() => navigateToViewImagePage(checkAbsoultePath(item))}
            >
              <Image
                source={checkAbsoultePath(item)}
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
