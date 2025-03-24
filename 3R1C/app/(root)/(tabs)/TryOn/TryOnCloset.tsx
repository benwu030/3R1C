import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useLocalSearchParams,
  Link,
  router,
  useFocusEffect,
} from "expo-router";
import icons from "@/constants/icons";
import ClothesCard from "@/components/ClothesCard";
import Filters from "@/components/Filters";
import { useAppwrite } from "@/lib/useAppWrite";
import { deleteClotheById, getClothesWithFilter } from "@/lib/CRUD/clotheCRUD";
import { MainCategoriesFilter } from "@/components/CategoriesFilter";
import { CATEGORIES } from "@/constants/data";
import CustomHeader from "@/components/CustomHeader";
//columnwraooer -> row
//contentContainer over content area
const TryOnCloset = () => {
  const params = useLocalSearchParams<{ mainCategoryfilter?: string }>();
  const [isSelectMode, setIsSelectMode] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string>();
  const {
    data: clothes,
    loading,
    refetch,
  } = useAppwrite({ fn: getClothesWithFilter });

  const [totalNumberClothes, setTotalNumberClothes] = useState(0);
  const handleCardPressed = (id: string) => {
    if (isSelectMode) {
      setSelectedItem(id);
    }
  };

  useEffect(() => {
    setTotalNumberClothes(clothes?.length ?? 0);
  }, [clothes]);

  useFocusEffect(
    useCallback(() => {
      refetch({ mainCategoryfilter: params.mainCategoryfilter ?? "All" });
    }, [params.mainCategoryfilter])
  );
  const confirmSelection = () => {
    setIsSelectMode(false);
    //get image from closet
    const selectedClothe = clothes?.find(
      (clothe) => clothe.$id === selectedItem
    );
    if (!selectedClothe) {
      return;
    }

    router.back();
    router.setParams({
      garmentImageFromClosetUri: selectedClothe.localImageURL,
    });
  };
  return (
    <SafeAreaView className="bg-sand-dark flex-1">
      <CustomHeader title="Try On" />
      <View className="flex-row justify-between items-center px-5 py-2 mb-2">
        <Text className="text-base font-S-Regular">
          {totalNumberClothes} Items
        </Text>
        <TouchableOpacity
          onPress={() => {
            confirmSelection();
          }}
          className=""
        >
          <Text className="font-S-Regular text-base text-right w-full">
            Confirm
          </Text>
        </TouchableOpacity>
      </View>

      <View className="px-5">
        <MainCategoriesFilter Categories={CATEGORIES} />
      </View>
      {loading ? (
        <ActivityIndicator
          className="text-beige-darker mt-[16rem]"
          size="large"
        />
      ) : (
        <FlatList
          data={clothes}
          renderItem={({ item }: { item: any }) => (
            <View className="w-1/2 px-2">
              <ClothesCard
                key={item.$id}
                item={item}
                isSelected={selectedItem === item.$id}
                isSelectMode={isSelectMode}
                onPress={() => handleCardPressed(item.$id!)}
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
    </SafeAreaView>
  );
};

export default TryOnCloset;
