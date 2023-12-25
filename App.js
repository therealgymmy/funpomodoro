import { StatusBar, StyleSheet, Text, View } from 'react-native';
import HomePage from './HomePage'

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <HomePage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333333', // Or any dark color of your choice
  },
});
