import * as React from 'react';
import {View, StyleSheet} from 'react-native';

import MypageScreen from '../../screens/MypageScreen';

function MypageTab({navigation}) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      // title: 'Mypage',
    });
  });
  return (
    <View style={styles.container}>
      <MypageScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20, // 상단 패딩 추가
  },
});

export default MypageTab;
