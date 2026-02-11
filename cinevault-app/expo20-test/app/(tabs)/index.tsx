import MovieCard from "../../../components/MovieCard";

import { View, Text, StyleSheet, ScrollView } from "react-native";



export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>🎬 CineVault</Text>
        <Text style={styles.subtitle}>
          Discover movies. Save favorites. Explore cinema.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Rated</Text>
        <View style={styles.placeholder} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  hero: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    marginTop: 8,
    color: "#aaa",
    textAlign: "center",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 12,
  },
  placeholder: {
    height: 140,
    backgroundColor: "#111",
    borderRadius: 12,
  },
});
