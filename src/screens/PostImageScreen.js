import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation } from '@react-navigation/native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";

const PostImageScreen = ({route}) => {

  const navigation = useNavigation();

  const postId = route.params.postId; // 작성한 게시글 아이디 받기

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

  const [token, setToken] = useState('');

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token') || '';
      console.log('토큰 확인');
      console.log(storedToken);
      setToken(storedToken);
      if (token == null) { console.log('Token not found');}
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  useEffect(() => {
    getToken();
   }, [])

  function uploadImage() {
    console.log(selectedPhotos);

    const formData = new FormData();
    selectedPhotos.forEach((image, index) => {
        formData.append('files', {
          uri: image.path,
          type: image.mime,
          name: `photo_${index}.${image.mime.split('/')[1]}`,
        });
    });

    axios.post(`http://localhost:8080/v1/posts/${postId}/images`, formData,
    {
      headers: {
        'Authorization' : `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    }).then(function(resp) {
        console.log('게시글 등록 성공!');
        Alert.alert("게시글 등록 성공!", "게시글이 성공적으로 등록되었습니다.");
        navigation.navigate('TabNav');
    }).catch(error => {
        console.error('API 요청 에러:', error);
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
            style={styles.photoBtn}
            onPress={handlePhotoUpload}>
              <View style={styles.photoComponent}>
                <AntDesign name="plus" size={60} color="#a0a0a0" />
                <Text style={styles.componentText}>사진은 최대 5장까지 가능합니다!</Text>
              </View>
        </TouchableOpacity>
        <View style={styles.component}>
          <TouchableOpacity 
            style={styles.uploadBtn}
            onPress={()=>uploadImage()}>
            <Text style={styles.uploadBtnText}>여행기록 업로드</Text>
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
    paddingHorizontal: wp(7),
    paddingTop: hp(5),
    justifyContent: 'space-between',
  },
  component: { 
    marginTop: 3,
    paddingBottom: hp(2),
  },
  photoComponent: { // 사진 추가 아이콘 + 텍스트 스타일 설정
    flexDirection: 'column',
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
  },
  photoBtn: { // 사진 등록 버튼 클릭 스타일 설정
    borderColor: '#C4C1CC',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    height: 350,
    marginRight: 10,
    marginBottom: 70,
  },
  componentText: { // 사진 추가 텍스트 색상 설정
    color: '#808080',
  },
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
    fontWeight: 'bold',
  },
});

export default PostImageScreen;
