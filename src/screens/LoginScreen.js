import React, {useEffect, useState} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import 'react-native-gesture-handler';

import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import axios from 'axios';


function LogoutScreen({navigation}) {  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  function login() {
    if (email.trim() == '') {
      Alert.alert('이메일 입력 확인', '이메일이 입력되지 않았습니다.');
    } else if (password.trim() == '') {
      Alert.alert('비밀번호 입력 확인', '비밀번호가 입력되지 않았습니다.');
    } else {
      axios
        .post(
          'http://localhost:8080/v1/users/login',
          {
            email: email,
            password: password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .then(function (resp) {
          console.log(resp.data.result.token);
          AsyncStorage.setItem('token', resp.data.result.token);
          navigation.navigate('TabNav');
        }).catch(error => {
          console.error('API 요청 에러:', error);
        });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.titleArea}>
          <Image source={require('../assest/images/emojipot_logo.png')} style={{width: 400, height: 300, resizeMode: 'contain'}} />
        </View>
      </View>

      <View style={styles.formArea}>
        <TextInput
          style={styles.idForm}
          placeholder={'이메일'}
          placeholderTextColor="#003f5c"
          onChangeText={email => setEmail(email)}
          value={email}
        />
        <TextInput
          style={styles.pwForm}
          placeholder={'비밀번호'}
          placeholderTextColor="#003f5c"
          onChangeText={password => setPassword(password)}
          value={password}

          secureTextEntry={true}
          />

      </View>

      <View style={{flex: 0.75}}>
        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.btn} onPress={() => login()}>
            <Text style={(styles.Text, {color: 'white'})}>로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 3}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  topArea: {
    flex: 1,
    paddingTop: wp(2),
  },
  titleArea: {
    flex: 0.7,
    justifyContent: 'center',
    paddingTop: wp(3),
    textAlign: 'center',
  },
  TextArea: {
    flex: 0.3,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  Text: {
    fontSize: wp('6%'),
    color:'black',
  },
  TextValidation: {
    fontSize: wp('4%'),
    color: 'red',
    paddingTop: wp(2),
  },

  formArea: {
    justifyContent: 'center',
    // paddingTop: wp(10),
    flex: 1.5,
    paddingLeft: wp(7),
    paddingRight: wp(7),
  },

  idForm: {
    borderWidth: 2,
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
  },

  pwForm: {
    borderWidth: 2,
    borderTopWidth: 1,
    borderColor: 'black',
    borderBottomRightRadius: 7,
    borderBottomLeftRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
  },

  btnArea: {
    height: hp(8),
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(1.5),
    paddingLeft: wp(7),
    paddingRight: wp(7),
  },
  btn: {
    flex: 1,
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
export default LogoutScreen;
