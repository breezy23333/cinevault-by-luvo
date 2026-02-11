import { View, Text, Image, StyleSheet } from "react-native";

type Props = {
  title: string;
  poster: string;
};

export default function MovieCard({ title, poster }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: poster }} style={styles.image} />
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#111",
  },
  title: {
    marginTop: 6,
    color: "#fff",
    fontSize: 12,
  },
});
