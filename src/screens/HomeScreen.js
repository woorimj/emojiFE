import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import 'react-native-gesture-handler';
import SearchBox from '../components/ScreenComponents/searchBox';
import MainTopContent from '../components/ScreenComponents/mainTopContent';
import MainBottomContent from '../components/ScreenComponents/mainBottomContent';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <SearchBox />
      <ScrollView style={styles.bottomContent}>
        <MainBottomContent />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomContent: {
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
