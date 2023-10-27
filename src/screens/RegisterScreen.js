import React, { useEffect, useState } from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPwd, setCheckPwd] = useState("");
  const [userName, setUserName] = useState("");

  function register() {
    if(email.trim() == "") {
      Alert.alert("이메일 입력 확인", "이메일이 입력되지 않았습니다.");
    } else if(password.trim() == "") {
      Alert.alert("비밀번호 입력 확인", "비밀번호가 입력되지 않았습니다.");
    } else if (password != checkPwd ) {
      Alert.alert("비밀번호 불일치", "비밀번호가 일치하지 않습니다.");
    } else {
      axios.post("http://localhost:8080/v1/users/register",  
        {
          name : userName,
          username : userName,
          email: email,
          password: password
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(function(resp) {
          Alert.alert("회원가입 성공", "회원가입이 완료되었습니다.");
        }).catch(error => {
          console.error('API 요청 에러:', error);
        }) 
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.titleArea}>
          <Image source={null} style={{width: wp(30), resizeMode: 'contain'}} />
        </View>
        <View style={styles.TextArea}>
          <Text style={styles.Text}>회원가입</Text>
        </View>
      </View>

      <View style={styles.formArea}>
        <TextInput 
          style={styles.inputField} 
          placeholder={'이메일'}
          onChangeText={(email) => setEmail(email)} 
          value={email} 
          placeholderTextColor="#003f5c"/>
        <TextInput 
          style={styles.inputField} 
          placeholder={'비밀번호'}
          onChangeText={(password) => setPassword(password)} 
          value={password} 
          placeholderTextColor="#003f5c"
          secureTextEntry={true}/>
        <TextInput 
          style={styles.inputField} 
          placeholder={'비밀번호 확인'} 
          onChangeText={(checkPwd) => setCheckPwd(checkPwd)} 
          value={checkPwd} 
          placeholderTextColor="#003f5c"
          secureTextEntry={true}/>
        <TextInput 
          style={styles.inputField} 
          placeholder={'이름'}
          onChangeText={(userName) => setUserName(userName)} 
          value={userName} 
          placeholderTextColor="#003f5c"/>
      </View>

      {/* 소셜로그인 따로 .js파일 만들어서 해야하나..? */}
      {/* 카카로 소셜 로그인으로 바꾸기 */}
      <View style={{flex: 0.75}}>
        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.kakaoBtn}>
            <Text style={(styles.Text, {color: 'black'})}>카카오회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 구글 소셜 로그인으로 바꾸기 */}
      <View style={{flex: 0.75}}>
        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.googleBtn}>
            <Text style={(styles.Text, {color: 'black'})}>구글회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flex: 0.75}}>
        <View style={styles.btnArea}>
          <TouchableOpacity style={styles.btn} onPress={()=> register()}>
            <Text style={(styles.Text, {color: 'white'})}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flex: 2}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: wp(7),
    paddingRight: wp(7),
  },
  topArea: {
    flex: 1,
    paddingTop: wp(2),
  },
  titleArea: {
    flex: 0.7,
    justifyContent: 'center',
    paddingTop: wp(3),
  },
  TextArea: {
    flex: 0.3,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  Text: {
    fontSize: wp('6%'),
  },
  TextValidation: {
    fontSize: wp('4%'),
    color: 'red',
    paddingTop: wp(2),
  },

  formArea: {
    justifyContent: 'center',
    //paddingTop: wp(10),
    flex: 3,
  },

  inputField: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 7,
    width: '100%',
    height: hp(6),
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: wp(2),
    color: 'black',
  },

  btnArea: {
    height: hp(8),
    // backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp(1.5),
  },
  btn: {
    flex: 1,
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  kakaoBtn: {
    flex: 1,
    width: '100%',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFE034',
  },
  googleBtn: {
    flex: 1,
    width: '100%',
    borderRadius: 7,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default RegisterScreen;
