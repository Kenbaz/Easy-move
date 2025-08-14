import ThemedView from "../../components/ThemedView";
import { StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Search, ChevronsDownUp } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import Box from "../../components/Box";

export default function ServicesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <ThemedView safeArea={true} className="border bg-white">
      <View className="bg-white h-[9.5%] items-center justify-center">
        <View className="border border-gray-100 flex-row px-5 gap-2 bg-gray-100 rounded-[50px] items-center mx-auto h-[50px] w-[366px]">
          <Search width={16} height={16} />
          <TextInput
            placeholder="Search for an item"
            className="h-full w-[94%]"
          />
        </View>
      </View>
      <View className="bg-gray-100 h-full">
        <View className="border h-[393px] gap-[23px] pt-5">
          <View className="flex-row mx-auto items-center justify-between w-[401px] border border-gray-100 h-[55px] rounded-[10px] bg-[#FFFFFF] px-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="bed-outline" size={24} />
              <Text className="font-semibold text-sm">Bedroom</Text>
            </View>
            <ChevronsDownUp width={13} height={13} />
          </View>
        </View>
        <Box />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  
});
