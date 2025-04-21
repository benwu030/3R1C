import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import CalendarItem from "./OutfitPreview";
import { useAppwrite } from "@/lib/useAppWrite";
import { getOutfitCollectionsByDate } from "@/lib/CRUD/outfitCRUD";
import { ActivityIndicator } from "react-native";
import { OutfitCollection } from "@/constants/outfit";
import { useFocusEffect } from "expo-router";
import icons from "@/constants/icons";
import { router } from "expo-router";
import { Image } from "expo-image";
interface CalendarProps {
  currentDate?: Date;
}

const Calendar = ({ currentDate = new Date() }: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [currentDisplayDate, setCurrentDisplayDate] = useState(currentDate);
  const {
    data: collections,
    loading,
    refetch,
  } = useAppwrite({
    fn: (params) => getOutfitCollectionsByDate(new Date(params.date)),
    params: { date: selectedDate.toISOString() },
  });
  const getDisplayMonth = (date: Date) => {
    return date.toLocaleString("default", { month: "long" });
  };
  const getDisplayYear = (date: Date) => {
    return date.getFullYear();
  };
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (date: number) => {
    const newDate = new Date(
      Date.UTC(
        currentDisplayDate.getFullYear(),
        currentDisplayDate.getMonth(),
        date
      )
    );
    setSelectedDate(newDate);
  };

  const renderCalendarDays = (date: Date) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days = [];

    // Add empty spaces for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };
  const [calendarDays, setCalendarDays] = useState<(number | null)[]>(
    renderCalendarDays(selectedDate)
  );
  const loadMoreMonths = (direction: "next" | "prev") => {
    const monthOffset = direction === "next" ? 1 : -1;
    const newMonth = new Date(
      Date.UTC(
        currentDisplayDate.getFullYear(),
        currentDisplayDate.getMonth() + monthOffset,
        1
      )
    );
    setCalendarDays(renderCalendarDays(newMonth));
    setCurrentDisplayDate(newMonth);
    const isCurrentMonth =
      newMonth.getMonth() === new Date().getMonth() &&
      newMonth.getFullYear() === new Date().getFullYear();
    setSelectedDate(isCurrentMonth ? new Date() : newMonth);
  };

  //when scrolling end, isScrolling will be set to false via onMomentumScrollEnd
  //thus handleScroll will be update the calendar days once the user stops scrolling
  const [isScrolling, setIsScrolling] = useState(true);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY < 0 && !isScrolling) {
      loadMoreMonths("prev");
      setIsScrolling(true);
    } else if (offsetY > 0 && !isScrolling) {
      loadMoreMonths("next");
      setIsScrolling(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [selectedDate])
  );
  return (
    <View className="px-5  flex-col flex-1">
      <Text className="font-S-Bold text-3xl mb-4">
        {getDisplayYear(currentDisplayDate)}{" "}
        {getDisplayMonth(currentDisplayDate)}
      </Text>

      {/* Calendar Days  onMomentumScrollEnd will be called when the scroll stops*/}
      <View className="h-[250px]">
        <FlatList
          className="border-b border-grey-darker "
          data={calendarDays}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="flex-1"
          columnWrapperClassName=""
          horizontal={false}
          onScroll={handleScroll}
          onMomentumScrollEnd={() => setIsScrolling(false)}
          renderItem={({ item }) => {
            if (item === null) {
              return (
                <View
                  key={`empty-${item}`}
                  className="w-[14.28%] items-center p-1"
                />
              );
            }
            const isToday =
              item === new Date().getDate() &&
              currentDisplayDate.getMonth() === new Date().getMonth() &&
              currentDisplayDate.getFullYear() === new Date().getFullYear();

            const isSelected = selectedDate?.getDate() === item;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => handleDateSelect(item)}
                className={`
                                    w-[14.28%]
                                     items-center p-1
                                     rounded-xl
                                     ${isSelected ? "bg-beige-darker" : ""}
             
                                 `}
              >
                <Text
                  className={`
                                         text-lg
                                         text-center
                                         ${isToday ? "text-sand-deep font-S-Bold border-b " : ""}
                                         ${isSelected ? "text-sand-deep font-S-Bold text-white border-white" : "font-S-Regular"}
                                     `}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
          numColumns={7}
          keyExtractor={(_, index) => index.toString()}
          ListHeaderComponent={
            <View className="bg-sand-dark flex-row mb-4 border-b border-grey-darker">
              {weekDays.map((day) => (
                <View key={day} className="flex-1 items-center p-1">
                  <Text className="font-S-Bold">{day}</Text>
                </View>
              ))}
            </View>
          }
          stickyHeaderIndices={[0]}
        />
      </View>
      <View className="h-[32rem] mt-4">
        {loading ? (
          <ActivityIndicator
            size="large"
            className="text-beige-darker mt-[16rem]"
          />
        ) : !!collections?.length ? (
          <FlatList
            data={collections}
            renderItem={({ item }: { item: OutfitCollection }) => (
              <CalendarItem
                date={selectedDate}
                outfitCollection={item}
                key={item.$id}
              />
            )}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <View className="flex-row justify-center items-center  gap-10">
                <View className="flex-col justify-center items-center">
                  <TouchableOpacity
                    onPress={() => router.push("/OutfitPlanning/Collections")}
                    className=""
                  >
                    <Image
                      source={icons.folderAdd}
                      className="size-16"
                      tintColor={"#776E65"}
                    />
                  </TouchableOpacity>
                  <Text className="font-S-Regular text-sm ">
                    Browse your Collections
                  </Text>
                </View>

                <View className="flex-col justify-center items-center">
                  <TouchableOpacity
                    onPress={() => router.push("/OutfitPlanning/Outfits")}
                    className=""
                  >
                    <Image
                      source={icons.collectionsAdd}
                      className="size-16 "
                      tintColor={"#776E65"}
                    />
                  </TouchableOpacity>
                  <Text className="font-S-Regular text-sm ">
                    Browse your Outfits
                  </Text>
                </View>
              </View>
            }
          />
        ) : (
          <View>
            <CalendarItem date={selectedDate} />
            <View className="flex-row justify-center items-center  gap-10">
              <View className="flex-col justify-center items-center">
                <TouchableOpacity
                  onPress={() => router.push("/OutfitPlanning/Collections")}
                  className=""
                >
                  <Image
                    source={icons.folderAdd}
                    className="size-16"
                    tintColor={"#776E65"}
                  />
                </TouchableOpacity>
                <Text className="font-S-Regular text-sm ">
                  Browse your Collections
                </Text>
              </View>

              <View className="flex-col justify-center items-center">
                <TouchableOpacity
                  onPress={() => router.push("/OutfitPlanning/Outfits")}
                  className=""
                >
                  <Image
                    source={icons.collectionsAdd}
                    className="size-16 "
                    tintColor={"#776E65"}
                  />
                </TouchableOpacity>
                <Text className="font-S-Regular text-sm ">
                  Browse your Outfits
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Calendar;
