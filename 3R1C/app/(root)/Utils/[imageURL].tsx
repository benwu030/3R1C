import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import CustomHeader from "@/components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { GestureView } from "@/components/GestureView";

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
  const shareButtonPressed = () => {};
  return (
    <SafeAreaView className="flex-1 bg-sand-dark">
      <CustomHeader title="Try-On Result" />
      <GestureView enabledGestures={["pan", "pinch"]} isActive>
        <Image
          source={image}
          className="w-full h-full relative"
          contentFit="contain"
        />
      </GestureView>
    </SafeAreaView>
  );
};

export default ViewImagePage;
