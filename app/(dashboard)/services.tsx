import ThemedView from "../../components/ThemedView";
import { StyleSheet, Text, TextInput, useColorScheme, View } from "react-native";
import { Colors } from "../../constants/Colors";

export default function ServicesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  return (
    <ThemedView safeArea={true} className="border bg-white">
      <View className="bg-white h-[9.5%] items-center justify-center">
        
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  
});
