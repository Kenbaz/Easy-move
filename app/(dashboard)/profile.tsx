import ThemedView from '../../components/ThemedView';
import { StyleSheet, Text, useColorScheme } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function ProfileScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <ThemedView style={styles.container}>
            <Text style={[styles.textStyle, { color: theme.text }]}>Welcome to the Profile Screen!</Text>
        </ThemedView>
    )
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        borderColor: "black",
        borderWidth: 1,
    },
    textStyle: {
        fontWeight: "bold"
    }
});