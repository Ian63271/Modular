import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
    return (
        <>
        <Stack.Screen options={{ headerTitle: "Oops! Not Found" }} />
        <View style={style.container}>
            <Link href="/index" style={style.button}>
                <Text style={style.buttonText}>Go to Home Page</Text>
            </Link>
        </View>
        </>
    );
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#25292e",
    },

    text: {
        fontSize: 20,
        color: "#ffffff",
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});