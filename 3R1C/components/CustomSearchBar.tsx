import { Image } from "expo-image";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import icons from "@/constants/icons";
import { useDebouncedCallback } from "use-debounce";
interface CustomSearchBarProps {
  placeholder?: string;
  onSearch?: (text: string) => void;
  value?: string;
  style?: object;
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
  placeholder = "Search...",
  onSearch,
  value: initialValue = "",
  style,
}) => {
  const [searchText, setSearchText] = useState(initialValue);
  const debouncedSearch = useDebouncedCallback((text: string) => {
    if (onSearch) {
      onSearch(text);
    }
  }, 500);

  const handleSearch = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  const handleClear = () => {
    setSearchText("");
    if (onSearch) {
      onSearch("");
    }
  };

  return (
    <View className="w-full p-2 px-5">
      <View className="flex-row items-center bg-sand rounded-lg p-3 shadow-sm">
        <Image source={icons.search} className="size-7" />
        <TextInput
          placeholder={placeholder}
          value={searchText}
          onChangeText={handleSearch}
          onBlur={() => handleSearch(searchText)}
          onSubmitEditing={() => handleSearch(searchText)}
          clearButtonMode="never"
          className="flex-1 h-full text-sm font-S-Regular"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} className="p-1">
            <Image source={icons.close} className="size-4" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomSearchBar;
