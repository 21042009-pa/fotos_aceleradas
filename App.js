import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import CameraScreen from "./fotos_aceleradas";

export default function App() {
  return (
    <View style={styles.container}>
      <CameraScreen />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
