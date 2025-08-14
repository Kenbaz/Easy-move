import ThemedView from "../components/ThemedView";
import { StyleSheet, Text, TextInput, View, ScrollView } from "react-native";

import { Search, ChevronsDownUp } from "lucide-react-native";
import { Ionicons } from "@expo/vector-icons";
import Box from "../components/Box";
import ListItems from "../components/ListItems";
import ListItemsTwo from "../components/ListItemsTwo";
import { AnimationProvider } from "../context/AnimatedContext";
import AnimationOverlay from "../components/AnimationOverlay";

export default function BlankServicesScreen() {
  const containerWidth = 357;

  return (
    <AnimationProvider>
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
          <View className="h-[393px] gap-[23px] pt-5">
            <View className="flex-row mx-auto items-center justify-between w-[401px] border border-gray-100 h-[55px] rounded-[10px] bg-[#FFFFFF] px-4">
              <View className="flex-row items-center gap-2">
                <Ionicons name="bed-outline" size={24} />
                <Text className="font-semibold text-sm">Bedroom</Text>
              </View>
              <ChevronsDownUp width={13} height={13} />
            </View>
            <View className="flex-1">
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={containerWidth + 15}
                decelerationRate="fast"
                contentContainerStyle={{
                  paddingHorizontal: 15,
                }}
                style={{
                  flex: 1,
                }}
              >
                {/* First Container */}
                <View style={styles.custom}>
                  <View className="border flex-1 w-[357px] bg-[#FFFFFF] rounded-2xl gap-[10px] border-gray-100">
                    <ListItems />
                  </View>
                </View>

                {/* Second Container */}
                <View>
                  <View className="border flex-1 w-[357px] bg-[#FFFFFF] rounded-2xl gap-[10px] border-gray-100">
                    <ListItemsTwo />
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
          <View style={styles.custom2}>
            <Box />
          </View>
        </View>

        {/* Animation Overlay - This renders all animated items */}
        <AnimationOverlay />
      </ThemedView>
    </AnimationProvider>
  );
}

const styles = StyleSheet.create({
  custom: {
    marginRight: 15,
  },
  custom2: {
    marginTop: "20%",
  },
});
