import React from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function ContinueButton() {
  return (
    <Pressable style={styles.shadow}>
      <LinearGradient
        colors={["#03AD14", "#008E05"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        locations={[0.0218, 1]}
        style={styles.button}
      >
        <Text style={styles.text}>Continue</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    borderRadius: 10,
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    color: "#fff",
    fontWeight: 600,
    fontSize: 16,
  },
});
