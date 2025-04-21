import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Image } from "expo-image";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { login } from "@/lib/AppWrite";
import { Redirect, router } from "expo-router";
import { useGlobalContext } from "@/lib/globalProvider";
const signIn = () => {
  const { refetch, loading, isLoggedIn, setIsOfflineMode, isOfflineMode } =
    useGlobalContext();
  if ((!loading && isLoggedIn) || isOfflineMode) return <Redirect href="/" />;
  const handleLogin = async () => {
    const result = await login();
    if (result) {
      refetch();
    } else {
      Alert.alert("Error", "Failed to login");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-oat-light justify-center items-center">
      <View className="w-11/12 max-w-md p-8 bg-white-almond rounded-2xl shadow-lg">
        <View className="items-center ">
          <Image
            source={images.icon}
            className="w-full h-48"
            contentFit="contain"
          />
        </View>
        <View className="absoulte bottom-8 items-center">
          <Text className="text-xl text-center font-S-Bold text-brick ">
            An App to Mitigate Clothing Waste
          </Text>
          <Text className="text-sm text-center font-S-Regular text-green-darker">
            Ben Wu / Supervised by Xu Dong
          </Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center justify-center bg-green rounded-full py-3"
          onPress={handleLogin}
        >
          <Image
            source={icons.google}
            className="w-6 h-6 mr-3"
            contentFit="contain"
          />
          <Text className="text-lg font-S-Bold text-white">
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default signIn;
