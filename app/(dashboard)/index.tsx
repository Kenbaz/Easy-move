import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import { Link } from "expo-router";
import ThemedView from "../../components/ThemedView";
import { Bell, ChevronsUpDown } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import ContinueButton from "../../components/ContinueBtn"
import { BlurView } from "expo-blur";

const Home = () => {
    return (
      <ThemedView safeArea={true} className="relative bg-white">
        <View className="px-[20px] h-[9.5%] flex-row justify-between items-center">
          <View className="flex-row items-center gap-1">
            <Text className="text-[1.25rem] font-bold">EasyMove</Text>
            <Image
              source={require("../../assets/images/hugeicons_truck-delivery.png")}
              className="w-[24px] h-[24px]"
            />
          </View>
          <Bell />
        </View>
        <View className="h-[50%]">
          <Image
            source={require("../../assets/images/image.png")}
            className="h-full"
          />
        </View>
        <View className="h-[16%] absolute top-[58%] left-0 right-0">
          <LinearGradient
            colors={["rgba(255,255,255,0)", "#FFFFFF"]}
            locations={[0, 0.2596]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.gradient}
          />
        </View>
        <BlurView
          intensity={20}
          className="w-[95%] h-[36vh] absolute mx-auto left-[2.5%] right-0 top-[53.9%] rounded-t-[20px]"
        >
          <View
            className="w-full h-full gap-[20px] p-[16px] rounded-t-[20px]"
            style={styles.shadow}
          >
            <Text className="font-semibold text-xl leading-[100%] text-[#232323] text-center">
              Where are you moving from and to?
            </Text>
            <View>
              <View className="flex gap-[8px]">
                <Text className="font-medium text-sm">Pick up</Text>
                <View className="h-[5vh] pr-[5px] pl-5 border border-[#E5E5E5] rounded-[10px]  flex-row justify-between items-center py-[5px]">
                  <TextInput placeholder="Enter pick up address" />
                  <View className="flex-row rounded-[10px] items-center gap-[6px] px-[10px] bg-[#F0F0F0] h-[4vh]">
                    <Text className="font-medium text-[12px]">
                      Select floor
                    </Text>
                    <ChevronsUpDown width={18} height={18} />
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View className="flex gap-[8px]">
                <Text className="font-medium text-sm">Drop off</Text>
                <View className="h-[5vh] pr-[5px] pl-5 border border-[#E5E5E5] rounded-[10px]  flex-row justify-between items-center py-[5px]">
                  <TextInput placeholder="Enter drop off address" />
                  <View className="flex-row rounded-[10px] items-center gap-[6px] px-[10px] bg-[#F0F0F0] h-[4vh]">
                    <Text className="font-medium text-[12px]">
                      Select floor
                    </Text>
                    <ChevronsUpDown width={18} height={18} />
                  </View>
                </View>
              </View>
            </View>
            <ContinueButton />
          </View>
        </BlurView>
      </ThemedView>
    );
};

export default Home;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    // position: "absolute",
  },
  shadow: {
    backgroundColor: "rgba(255, 255, 255, 0.89)", // Semi-transparent white
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  },
});