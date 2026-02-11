import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CineVault</Text>
      <Text style={styles.subtitle}>App is running 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#f5c518",
    fontSize: 32,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 16,
  },
});
