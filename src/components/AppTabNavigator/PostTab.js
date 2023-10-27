import * as React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import PostCreateScreen from '../../screens/PostCreateScreen';
// import DetailScreen from '../../screens/DetailScreen';

function BackBtn({navigation}) {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        source={require('../../assest/images/backBtn.png')}
        style={{marginLeft: 20, width: 30, height: 30}}
      />
    </TouchableOpacity>
  );
}

function PostTab({navigation}) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      // title: '글작성',
      headerLeft: () => <BackBtn navigation={navigation} />, // 뒤로가기 버튼 추가
    });
  });
  return <PostCreateScreen />;
}

export default PostTab;
