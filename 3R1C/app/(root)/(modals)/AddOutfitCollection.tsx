import React from "react";
import CreateOutfitCollectionModal from "@/components/CreateOutfitCollectionModal";
import { useGlobalContext } from "@/lib/globalProvider";
import { View } from "react-native";
import { useLocalSearchParams } from "expo-router";
export default function AddClothes() {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ selectedDate: string }>();
  return (
    <View className="bg-sand-white flex-auto">
      <CreateOutfitCollectionModal
        userID={user?.$id ?? ""}
        selectedDate={
          params.selectedDate ? new Date(params.selectedDate) : new Date()
        }
      />
    </View>
  );
}
