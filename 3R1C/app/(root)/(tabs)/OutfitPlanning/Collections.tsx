import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import icons from "@/constants/icons";
import { Image } from "expo-image";
import { router, Link, useFocusEffect } from "expo-router";
import {
  deleteOutfitCollection,
  getOutfitCollections,
} from "@/lib/CRUD/outfitCRUD";
import { useAppwrite } from "@/lib/useAppWrite";
import OutfitCollectionCard from "@/components/OutfitCollectionCard";
import CustomHeader from "@/components/CustomHeader";
import { OutfitCollection } from "@/constants/outfit";
const OutfitCollections = () => {
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [totalNumberCollections, setTotalNumberCollections] = useState(0);
  const handleCollectionPressed = (
    id: string,
    title: string = "Your Outfits"
  ) => {
    if (isSelectMode) {
      setSelectedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      router.push({
        pathname: `./collection/${id}`,
        params: { collectionName: title },
      });
    }
  };
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteSelected = async () => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete these outfits?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            // Add delete logic here
            try {
              setIsDeleting(true);

              for (const id of selectedItems) {
                await deleteOutfitCollection(id);
              }

              refetch();
              // Reset selection
              setSelectedItems([]);
              setIsSelectMode(false);
            } catch (error) {
              Alert.alert("Error", "Failed to delete item");
              return;
            } finally {
              setIsDeleting(false);
            }
          },
          style: "destructive",
        },
      ]
    );
  };
  const {
    data: collections,
    loading,
    refetch,
  } = useAppwrite({ fn: getOutfitCollections });
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );
  useEffect(() => {
    setTotalNumberCollections(collections?.length ?? 0);
  }, [collections]);
  return (
    <SafeAreaView className="bg-sand-dark flex-1">
      <CustomHeader
        title="Your Collections"
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
              <Link href="/AddOutfitCollection" className="">
                <Image source={icons.plus} className="size-6" />
              </Link>
            )}
          </View>
        }
      />
      <View className="flex-row justify-between items-center px-5 py-2">
        <Text className="text-base font-S-Regular">
          {totalNumberCollections} Items
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
      <View className="px-5 py-2 flex-1">
        {loading ? (
          <ActivityIndicator
            className="text-beige-darker mt-[16rem]"
            size="large"
          />
        ) : (
          <FlatList
            data={collections}
            renderItem={({ item }: { item: OutfitCollection }) => (
              <View className="w-1/2 px-2">
                <OutfitCollectionCard
                  key={item.$id}
                  item={item}
                  onPress={() => handleCollectionPressed(item.$id!, item.title)}
                  isSelected={selectedItems.includes(item.$id!)}
                  isSelectMode={isSelectMode}
                />
              </View>
            )}
            numColumns={2}
            contentContainerClassName="pb-20 mt-2"
            columnWrapperStyle={{ marginHorizontal: 20, flexDirection: "row" }}
            showsVerticalScrollIndicator={false}
            horizontal={false}
          />
        )}
      </View>

      {/* Overlay loading indicator */}
      {isDeleting && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 items-center justify-center h-full">
          <ActivityIndicator className="text-beige-darker" size="large" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default OutfitCollections;
