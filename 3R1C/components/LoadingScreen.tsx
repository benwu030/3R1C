import React from "react";
import { ActivityIndicator, SafeAreaView } from "react-native";
const LoadingScreen = () => {
  return (
    <SafeAreaView className="bg-white h-full flex justify-center items-center">
      <ActivityIndicator className="text-amber-400 " size="large" />
    </SafeAreaView>
  );
};

export default LoadingScreen;
