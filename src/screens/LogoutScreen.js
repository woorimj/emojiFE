// 앱시작페이지
import React from 'react';
// 반응형 레이아웃 조정을 위한 패키지, 화면 비율에따라서 조정함
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const LogoutScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <View style={{flex: 3, justifyContent: 'center'}}>
        {/* 로고영역
        <View style={styles.logo}>
          <Image source={null} style={{width: wp(55), resizeMode: 'contain'}} />
        </View> */}

        {/* 버튼영역 */}
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}>
            <Text>로그인</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={() => navigation.navigate('Register')}>
            <Text style={{color: 'white'}}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  logo: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',

    paddingBottom: wp(15),
  },
  button: {
    height: hp(8),
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(1.5),
  },
  registerBtn: {
    flex: 1,
    width: wp(75),
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loginBtn: {
    flex: 1,
    width: wp(75),
    borderRadius: 5,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
export default LogoutScreen;
