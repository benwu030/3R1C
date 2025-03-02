import { View, Text } from "react-native";
import React from "react";

interface HeaderTitleProps {
  children?: string;
  tintColor?: string;
}

const ModalTitle = (props: HeaderTitleProps) => {
  return (
    <Text className="font-S-Bold text-grey text-2xl text-center">
      {props.children}
    </Text>
  );
};

export default ModalTitle;
