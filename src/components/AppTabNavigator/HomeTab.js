import * as React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import HomeScreen from '../../screens/HomeScreen';

function HomeTab({navigation}) {
  return (
    <View style={styles.container}>
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
});

export default HomeTab;
