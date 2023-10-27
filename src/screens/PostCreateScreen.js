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

const PostCreateScreen = () => {

  const [searchPlace, setSearchPlace] = useState('');

  // 위치 검색
  const getSearchPlace = async () => {
    try {
      const getPlace = await AsyncStorage.getItem('searchPlace') || '';
      console.log('검색 장소 확인');
      console.log(getPlace);
      setSearchPlace(getPlace);
      if (searchPlace == null) { console.log('Search Place not found');}
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  const navigation = useNavigation();

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

  //이모지
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const handleEmotionSelect = emotion => {
    setSelectedEmotion(emotion);
  };

  //글 작성
  const [postText, setPostText] = useState('');

  const handlePostTextChange = text => {
    setPostText(text);
  };

  //공개,비공개 선택
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };

  const [token, setToken] = useState('');

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token') || '';
      console.log('토큰 확인');
      console.log(storedToken);
      setToken(storedToken);
      if (token == null) { console.log('Token not found');}
      getSearchPlace();
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  useEffect(() => {
    getToken();
   }, [])

  function uploadPost() {
    if(postText.trim() == "") {
      Alert.alert("게시글 입력 확인", "게시글은 필수 입력 사항입니다.");
    } else {
      axios.post("http://localhost:8080/v1/posts",
        {
          location: searchPlace,
          emotion: selectedEmotion,
          record: postText,
          is_opened : 1
        }, {
          headers: {
            'Authorization' : `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then(function(resp) {
          console.log('게시글 등록 성공!');
          console.log(resp.data.result.postId);
          navigation.navigate('PostImageScreen', {
            postId: resp.data.result.postId,
          });
        }).catch(error => {
          console.error('API 요청 에러:', error);
        })
    }
  }

  function goGoogleMap() {
    navigation.navigate('GoogleMap');
  }


  return (
    <View style={styles.container}>
      {/* 검색한 장소를 업로드 버튼 클릭 시 가져오고 있기 때문에 바로 출력이 안 됨 -> 어떻게 해결할 수 있을지.. */}
      {/* <Text style={styles.searchLocationText}>🚩 {searchPlace}</Text>  */}
      <ScrollView style={styles.scrollComponent}>
      <TouchableOpacity 
            style={styles.placeBtn}
            onPress={()=>goGoogleMap()}>
            <View style={styles.mapComponent}>
              <Feather name="map-pin" size={15} color="black" />
              <Text style={styles.componentText}>  위치 검색</Text>
            </View>
      </TouchableOpacity>
        <View style={styles.component}>
          <View style={styles.emotionContainer}>
            <TouchableOpacity
              style={[
                styles.emotionIcon,
                selectedEmotion === 'happy' && styles.selectedEmotion,
              ]}
              onPress={() => handleEmotionSelect(1)}>
              <Image source={require('../assest/images/happy.png')} style={{ width: '100%', height: '100%', resizeMode: 'cover' }}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.emotionIcon,
                selectedEmotion === 'sad' && styles.selectedEmotion,
              ]}
              onPress={() => handleEmotionSelect(2)}>
              <Image source={require('../assest/images/sad.png')} style={{ width: '100%', height: '100%', resizeMode: 'cover' }}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.emotionIcon,
                selectedEmotion === 'angry' && styles.selectedEmotion,
              ]}
              onPress={() => handleEmotionSelect(3)}>
              <Image source={require('../assest/images/angry.png')} style={{ width: '100%', height: '100%', resizeMode: 'cover' }}/>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.component}>
          <Text style={styles.componentText}>글 작성 ({postText.length}/1000)</Text>
          <TextInput
            multiline
            placeholder="공간에서의 경험이나 정보, 감정을 작성해주세요!"
            placeholderTextColor="#d3d3d3" 
            value={postText}
            onChangeText={handlePostTextChange}
            maxLength={1000}
            style={styles.postTextInput}
          />
        </View>
        <View style={styles.component}>
          <View style={styles.checkBoxContainer}>
            <Text style={{fontSize: 16, color:"black"}}>비공개 설정</Text>
            <CheckBox
              value={isChecked}
              onValueChange={handleCheckBoxChange}
              style={styles.checkBox}
            />
          </View>
          <TouchableOpacity 
            style={styles.uploadBtn}
            onPress={()=>uploadPost()}>
            <Text style={styles.uploadBtnText}>이미지 업로드</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, //전체의 공간을 차지한다는 의미
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingHorizontal: wp(7),
    paddingTop: hp(1),
  },
  scrollComponent: {
    marginTop: hp(3),
  },
  mapComponent: { // 위치 검색 아이콘 + 텍스트 스타일 설정
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  placeBtn: { // 위치 검색 버튼 클릭 스타일 설정
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    width: 150,
    marginRight: 10,
  },
  component: { // 글작성, 비공개 설정 컴포넌트 스타일 설정
    marginTop: 3,
    paddingBottom: hp(2),
  },
  componentText: { // 위치 검색 텍스트 색상 설정
    color: 'black',
  },
  emotionContainer: { // 감정 평가 컨테이너 스타일 설정
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    height: 80,
    borderColor: '#C4C1CC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  emotionIcon: { // 감정 평가 세부 이모지 스타일 설정
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedEmotion: {
    backgroundColor: '#FFD700', // 선택된 이모지의 배경색 변경
  },
  postTextInput: { // 글 작성 스타일 설정
    height: 150,
    borderColor: '#C4C1CC',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    color: 'black',
  },
  checkBoxContainer: { // 비공개 설정 체크박스 스타일 설정
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginTop: 10,
  },
  checkbox: {
    
  },
  // 글 작성 업로드 버튼스타일
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
});

export default PostCreateScreen;
