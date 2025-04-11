import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import CustomHeader from "@/components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { GestureView } from "@/components/GestureView";
import icons from "@/constants/icons";
import { checkAbsoultePath } from "@/lib/LocalStoreManager";
//TODO: replace sharing with expo-share-intent
import * as Sharing from "expo-sharing";
const ShareButtonComponent = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} className="">
      <Image source={icons.share} className="w-6 h-6" contentFit="contain" />
    </TouchableOpacity>
  );
};
const ViewImagePage = () => {
  const localParams = useLocalSearchParams<{
    imageURL: string;
  }>();
  const [image, setImage] = useState<string | null>(null);
  useEffect(() => {
    console.log("Image URL:", localParams.imageURL);
    if (localParams.imageURL) {
      setImage(localParams.imageURL);
    }
  }, [localParams.imageURL]);

  const shareButtonPressed = async () => {
    const shareAble = await Sharing.isAvailableAsync();
    if (!shareAble) {
      return Alert.alert("Sharing is not available on this device");
    }
    await Sharing.shareAsync(image ?? "");
  };
  return (
    <SafeAreaView className="flex-1 bg-sand-dark">
      <CustomHeader
        title="Try-On Result"
        rightComponent={<ShareButtonComponent onPress={shareButtonPressed} />}
      />
      <GestureView enabledGestures={["pan", "pinch"]} isActive>
        <Image
          source={checkAbsoultePath(image ?? "")}
          className="w-full h-full  4 left-0"
          contentFit="contain"
        />
      </GestureView>
    </SafeAreaView>
  );
};

export default ViewImagePage;
