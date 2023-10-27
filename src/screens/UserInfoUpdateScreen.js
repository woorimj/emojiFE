import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  CheckBox,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import base64 from 'base-64';

const UserInfoUpdateScreen = () => {
    const [token, setToken] = useState('');

    const [userName, setUserName] = useState('');

    const handleUserNameChange = text => {
      setUserName(text);
    };

    const [introduce, setIntroduce] = useState('');

    const handleIntroduceChange = text => {
      setIntroduce(text);
    };

    const [userId, setUserId] = useState('');

    const handleUserIdChange = text => {
      setUserId(text);
    };

    const getDecodetoken = (token) => {
      let payload = token.substring(token.indexOf('.')+1,token.lastIndexOf('.'));
      let dec = JSON.parse(base64.decode(payload));
      handleUserIdChange(dec.userId);
      handleUserNameChange(dec.username);
      console.log(userId);
      console.log(userName);

      axios.get('http://localhost:8080/v1/users/info/' + userName, 
            {
              headers: {
                'Authorization' : 'Bearer ' + token,
                'Content-Type': 'application/json'
              }
            })
            .then((res) => {
                setIntroduce(res.data.result.introduce);
            })
            .catch((err)=>{
                console.log(err)
            })
    }

    const getToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token') || '';
        console.log('토큰 확인');
        console.log(storedToken);
        setToken(storedToken);
        if (token == null) { console.log('Token not found');}
        getDecodetoken(storedToken);
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    useEffect(() => {
        getToken();
    }, [])

  //사진 받아오기
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const handlePhotoUpload = async () => {
    try {
      const images = await ImagePicker.openPicker({
        multiple: true,
        maxFiles: 5,
        mediaType: 'photo',
      });
      setSelectedPhotos(images);
    } catch (error) {
      console.log(error);
    }
  };

  function uploadUserInfo() {
    if(userName.trim() == "") {
      Alert.alert("사용자 이름 확인", "사용자 이름은 필수 입력 사항입니다.");
    } else {
      axios.patch("http://localhost:8080/v1/users/modify/" + userId,  
        {
          username: userName,
          introduce: introduce,
        }, {
          headers: {
            'Authorization' : 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        }).then(function(resp) {
          Alert.alert("정보 변경 성공!", "사용자 정보가 성공적으로 변경되었습니다.");
        }).catch(error => {
          console.error('API 요청 에러:', error);
        }) 
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.TitleText}>프로필 설정</Text>
        <View style={styles.profileComponent}>
          <View style={styles.profileImageContainer}>
            <Image
              src={
                'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
              } // 프로필이미지 등록
              style={styles.profileImage}
            />
          </View>
          <View style={styles.component}>
            <TouchableOpacity onPress={handlePhotoUpload}>
              <Text style={styles.TextStyle}>사진을 선택하세요</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.component}>
          <Text style={styles.TextStyle}>사용자 이름</Text>
          <TextInput
            onChangeText={handleUserNameChange}
            style={styles.postTextInput}
            value={userName}
          />
        </View>
        <View style={styles.component}>
          <Text style={styles.TextStyle}>소개 글</Text>
          <TextInput
            onChangeText={handleIntroduceChange}
            style={styles.postTextInput}
            value={introduce}
          />
        </View>
      </ScrollView>
      <View style={styles.component}>
        <TouchableOpacity 
          style={styles.uploadBtn}  
          onPress={()=>uploadUserInfo()}>
          <Text style={styles.uploadBtnText}>프로필 업데이트</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: hp(3),
  },
  component: {
    paddingBottom: hp(2),
    marginBottom: hp(3),
  },
  TitleText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 40,
    paddingBottom: 10,
    borderColor: '#C4C1CC',
    borderBottomWidth: 1,
  },
  profileComponent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // 원형으로 만들기 위해 반지름 값을 뷰의 절반 크기로 설정
    overflow: 'hidden', // 이미지를 뷰 경계 내에 강제로 보여주기 위해 overflow 속성 추가
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  // 버튼스타일
  uploadBtn: {
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  uploadBtnText: {
    color: 'white',
    fontSize: 16,
  },
  postTextInput: {
    borderColor: '#D89196',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    color: 'black',
  },
  TextStyle: {
    color: 'black',
    fontWeight: 'bold',
  }
});

export default UserInfoUpdateScreen;