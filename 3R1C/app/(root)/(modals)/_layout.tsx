import { Stack } from "expo-router";
import ModalTitle from "@/components/ModalTitle";

const HeaderTitleComponent = (props: any) => <ModalTitle {...props} />;

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="AddClothes"
        options={{
          headerStyle: {
            backgroundColor: "#776E65",
          },
          title: "Add Clothes",
          headerTitle: HeaderTitleComponent,
        }}
      />
      <Stack.Screen
        name="AddOutfitCollection"
        options={{
          headerStyle: {
            backgroundColor: "#776E65",
          },
          title: "Add Outfit Collection",
          headerTitle: HeaderTitleComponent,
        }}
      />
    </Stack>
  );
}
