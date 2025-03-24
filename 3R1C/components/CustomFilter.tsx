import { View, Text, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import { Image } from "expo-image";
import icons from "@/constants/icons";
import { MenuView, MenuAction } from "@react-native-menu/menu";
interface FilterProps {
  title: string;
  onFilter?: (event?: any) => void;
  filterOptions: MenuAction[];
}

const CustomFilter = ({ onFilter, filterOptions, title }: FilterProps) => {
  return (
    <MenuView
      title={title}
      onPressAction={({ nativeEvent }) => {
        onFilter && onFilter(nativeEvent.event);
      }}
      actions={filterOptions}
    >
      <TouchableOpacity>
        <Image source={icons.filter} className="size-6" />
      </TouchableOpacity>
    </MenuView>
  );
};

export default CustomFilter;
