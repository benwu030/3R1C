import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Image } from "expo-image";
import icons from "@/constants/icons";
import {
  useLocalSearchParams,
  router,
  useFocusEffect,
  Link,
} from "expo-router";
import { getOutfitsByCollection } from "@/lib/CRUD/outfitCRUD";
import { useAppwrite } from "@/lib/useAppWrite";
import OutfitCard from "@/components/OutfitCard";
import { Outfit } from "@/constants/outfit";
import { ID } from "react-native-appwrite";
import CustomHeader from "@/components/CustomHeader";
import { deleteOutfitsFromCollection } from "@/lib/CRUD/outfitCRUD";
import { Alert } from "react-native";
const OutfitCollection = () => {
  const localParams = useLocalSearchParams<{
    outfitCollectionId: string;
    collectionName: string;
  }>();
  const {
    data: outfits,
    loading,
    refetch,
  } = useAppwrite({
    fn: (params) => getOutfitsByCollection(params.id),
    params: { id: localParams.outfitCollectionId },
  });
  const [totalNumberOutfits, setTotalNumberOutfits] = useState(0);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleAddOutfit = () => {
    const uid = ID.unique();
    router.push({
      pathname: `/outfit/[outfitId]`,
      params: {
        outfitId: uid,
        outfitName: "New Outfit",
        isNewOutfit: "true",
        collectionId: localParams.outfitCollectionId,
      },
    });
  };
  const handleOutfitPressed = (item: Outfit) => {
    const id = item.$id || "";
    const outfitName = item.title;

    if (isSelectMode) {
      setSelectedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      router.push({
        pathname: `/outfit/[outfitId]`,
        params: {
          outfitId: id,
          outfitName: outfitName,
          collectionId: localParams.outfitCollectionId,
        },
      });
    }
  };
  const handleDeleteSelected = () => {
    // Delete selected items

    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this outfit?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            // Add delete logic here
            deleteOutfitsFromCollection(
              selectedItems,
              localParams.outfitCollectionId
            ).then((result) => {
              if (!result) {
                Alert.alert("Error", "Failed to delete item");
                return;
              }
              Alert.alert("Success", "Outfit deleted successfully");
              refetch();
              // Reset selection
              setSelectedItems([]);
              setIsSelectMode(false);
            });
          },
          style: "destructive",
        },
      ]
    );
  };
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );
  useEffect(() => {
    setTotalNumberOutfits(outfits?.length ?? 0);
  }, [outfits]);
  return (
    <SafeAreaView className="bg-sand-dark flex-1">
      <CustomHeader
        title={localParams.collectionName}
        rightComponent={
          <View className="flex-row justify-end items-end py-2 px-5">
            {isSelectMode ? (
              <TouchableOpacity
                onPress={handleDeleteSelected}
                disabled={selectedItems.length === 0}
                className=""
              >
                <Image source={icons.deleteIcon} className="size-5" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleAddOutfit} className="">
                <Image source={icons.plus} className="size-6" />
              </TouchableOpacity>
            )}
          </View>
        }
      />
      <View className="flex-row justify-between items-center px-5 py-2">
        <Text className="text-base font-S-Regular">
          {totalNumberOutfits} Items
        </Text>
        {/* Select/Cancel Button */}
        <TouchableOpacity
          onPress={() => {
            setIsSelectMode(!isSelectMode);
            setSelectedItems([]);
          }}
          className=""
        >
          <Text className="font-S-Regular text-base text-right w-full">
            {isSelectMode ? "Cancel" : "Select"}
          </Text>
        </TouchableOpacity>
      </View>
      {/* fetch Collections Here*/}
      <View className="px-5 flex-1 py-2">
        {loading ? (
          <ActivityIndicator
            className="text-beige-darker mt-[16rem]"
            size="large"
          />
        ) : (
          <FlatList
            data={outfits}
            renderItem={({ item }: { item: Outfit }) => (
              <View key={item.$id} className="w-1/2 px-2">
                <OutfitCard
                  item={item}
                  onPress={() => handleOutfitPressed(item)}
                  isSelected={selectedItems.includes(item.$id || "")}
                  isSelectMode={isSelectMode}
                />
              </View>
            )}
            numColumns={2}
            contentContainerClassName="pb-20"
            columnWrapperStyle={{ marginHorizontal: 20, flexDirection: "row" }}
            showsVerticalScrollIndicator={false}
            horizontal={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OutfitCollection;
