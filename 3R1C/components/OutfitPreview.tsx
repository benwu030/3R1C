import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Image } from "expo-image";
import { Link, router, useFocusEffect } from "expo-router";
import { OutfitCollection } from "@/constants/outfit";
import { getOutfitsByCollection } from "@/lib/CRUD/outfitCRUD";
import { useAppwrite } from "@/lib/useAppWrite";
import { Outfit } from "@/constants/outfit";
import OutfitCard from "@/components/OutfitCard";
import { useCallback } from "react";
import { ID } from "react-native-appwrite";
import { ActivityIndicator } from "react-native";
interface OutfitPreviewProps {
  date: Date;
  outfitCollection?: OutfitCollection;
}
const OutfitList = ({
  outfits,
  handleOutfitPressed,
}: {
  outfits: Outfit[];
  handleOutfitPressed: (outfit: Outfit) => void;
}) => (
  <FlatList
    data={outfits}
    renderItem={({ item }: { item: Outfit }) => (
      <View
        key={item.$id}
        className="w-30 h-30 rounded-lg border-2 border-gray-100"
      >
        <OutfitCard item={item} onPress={() => handleOutfitPressed(item)} />
      </View>
    )}
    contentContainerClassName="gap-2"
    horizontal
    showsHorizontalScrollIndicator={false}
  />
);

const AddOutfitButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity className="flex-1" onPress={onPress}>
    <View className="w-full h-full bg-gray-100 rounded-lg items-center justify-center">
      <Text className="font-S-Regular text-gray-400">Add an Outfit</Text>
    </View>
  </TouchableOpacity>
);

const CreateCollectionButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity className="flex-1" onPress={onPress}>
    <View className="w-full h-full bg-gray-100 rounded-lg items-center justify-center">
      <Text className="font-S-Regular text-gray-400">Create a collection</Text>
    </View>
  </TouchableOpacity>
);
const CalendarItem = ({ date, outfitCollection }: OutfitPreviewProps) => {
  const isNewCollection = outfitCollection === undefined;
  const {
    data: outfits,
    loading,
    refetch,
  } = useAppwrite({
    fn: (params) => getOutfitsByCollection(params.id),
    params: { id: outfitCollection?.$id ?? "" },
  });
  const handleOutfitPressed = (item: Outfit) => {
    const id = item.$id || "";
    const outfitName = item.title;
    router.push({
      pathname: `/outfit/[outfitId]`,
      params: {
        outfitId: id,
        outfitName: outfitName,
        collectionId: outfitCollection?.$id ?? "",
      },
    });
  };
  const handleAddOutfit = () => {
    router.push({
      pathname: "/AddOutfitCollection",
      params: { selectedDate: date.toISOString() },
    });
  };
  const handleCollectionPressed = (
    id: string,
    title: string = "Your Outfits"
  ) => {
    if (id !== "")
      router.push({
        pathname: `./collection/${id}`,
        params: { collectionName: title },
      });
    else {
      router.push("/AddOutfitCollection");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator size="small" className="text-beige-darker mt-5" />
      );
    }
    if (isNewCollection) {
      return <CreateCollectionButton onPress={handleAddOutfit} />;
    }

    if (!outfits?.length) {
      return (
        <AddOutfitButton
          onPress={() =>
            handleCollectionPressed(
              outfitCollection?.$id ?? "",
              outfitCollection?.title
            )
          }
        />
      );
    }

    return (
      <OutfitList outfits={outfits} handleOutfitPressed={handleOutfitPressed} />
    );
  };

  return (
    <View className="h-[150px] bg-oat rounded-lg m-4 p-4 shadow-md ">
      <View className="flex-row items-center justify-between">
        {!isNewCollection && (
          <TouchableOpacity
            onPress={() =>
              handleCollectionPressed(
                outfitCollection?.$id ?? "",
                outfitCollection?.title
              )
            }
          >
            <Text className="font-S-Bold text-xl mb-2 ">
              {outfitCollection?.title}
            </Text>
          </TouchableOpacity>
        )}

        <Text className="font-S-Bold text-xl mb-2">
          {date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}
        </Text>
      </View>
      <View className="flex-1">{renderContent()}</View>
    </View>
  );
};

export default CalendarItem;
