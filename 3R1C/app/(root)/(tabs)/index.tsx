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
import CustomSearchBar from "@/components/CustomSearchBar";
import CustomFilter from "@/components/CustomFilter";
import { MenuAction } from "@react-native-menu/menu";
//columnwraooer -> row
//contentContainer over content area

const filterOptions: MenuAction[] = [
  {
    id: "price_asc",
    title: "Purchase Price",
    image: "arrow.up.square.fill",
    subtitle: "(Ascending)",
    imageColor: "#777",
  },
  {
    id: "price_desc",
    title: "Purchase Price",
    subtitle: "(Descending)",
    image: "arrow.down.square.fill",
    imageColor: "#777",
  },
  {
    id: "purchasedate_asc",
    title: "Purchase Date ",
    subtitle: "(Ascending)",
    image: "arrow.up.square.fill",
    imageColor: "#777",
  },
  {
    id: "purchasedate_desc",
    title: "Purchase Date",
    subtitle: "(Descending)",
    image: "arrow.down.square.fill",
    imageColor: "#777",
  },
  {
    id: "createdate_asc",
    title: "Create Date",
    subtitle: "(Ascending)",
    image: "arrow.up.square.fill",
    imageColor: "#777",
  },
  {
    id: "createdate_desc",
    title: "Create Date",
    subtitle: "(Descending)",
    image: "arrow.down.square.fill",
    imageColor: "#777",
  },
];
const Index = () => {
  const params = useLocalSearchParams<{
    mainCategoryfilter: string;
    searchText: string;
    sortByText: string;
  }>();
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const {
    data: clothes,
    loading,
    refetch,
  } = useAppwrite({ fn: getClothesWithFilter });
  const handleDeleteSelected = () => {
    // Delete selected items

    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete these clothes?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Delete selected items
              for (const id of selectedItems) {
                await deleteClotheById(id, id);
              }
              // Reset selection
              setSelectedItems([]);
              setIsSelectMode(false);
              // Refetch data
              refetch({
                mainCategoryfilter: params.mainCategoryfilter ?? "All",
              });
            } catch (error) {
              console.error("Error deleting clothes", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };
  const [totalNumberClothes, setTotalNumberClothes] = useState(0);
  const handleCardPressed = (id: string) => {
    if (isSelectMode) {
      setSelectedItems((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      router.push(`/details/${id}`);
    }
  };
  const searchClothes = (searchText: string) => {
    // Update search params in URL
    router.setParams({
      searchText: searchText,
    });
  };
  const onFilter = (sortByText: string) => {
    router.setParams({
      sortByText: sortByText || "createdate_asc",
    });
  };
  useEffect(() => {
    setTotalNumberClothes(clothes?.length ?? 0);
  }, [clothes]);

  useFocusEffect(
    useCallback(() => {
      refetch({
        searchText: params.searchText,
        mainCategoryfilter: params.mainCategoryfilter,
        sortByText: params.sortByText,
      });
    }, [params.mainCategoryfilter, params.searchText, params.sortByText])
  );
  return (
    <SafeAreaView className="bg-sand-dark flex-1">
      <CustomHeader
        title="Your Closet"
        showBackButton={false}
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
              <Link href="/AddClothes" className="">
                <Image source={icons.plus} className="size-6" />
              </Link>
            )}
          </View>
        }
      />
      <View className="flex-row justify-between items-center px-5 ">
        <Text className="text-base font-S-Regular">
          {totalNumberClothes} Items
        </Text>
        {/* Select/Cancel Button */}
        <View className="flex-row items-center gap-2">
          {!!params.sortByText && (
            <Text className="text-sm font-S-Regular">
              {filterOptions.find((menu) => menu.id === params.sortByText)
                ?.title || ""}
              {params.sortByText.split("_")[1] === "asc"
                ? " (Ascending)"
                : " (Descending)"}
            </Text>
          )}
          <CustomFilter
            title="Sort By"
            filterOptions={filterOptions}
            onFilter={onFilter}
          />
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
      </View>
      <CustomSearchBar onSearch={searchClothes} />

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
            <View className="w-1/2 px-2" key={item.$id}>
              <ClothesCard
                item={item}
                isSelected={selectedItems.includes(item.$id || "")}
                isSelectMode={isSelectMode}
                onPress={() => handleCardPressed(item.$id)}
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

export default Index;
