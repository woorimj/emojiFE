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
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";

const UpdateScreen = ({route}) => {
  const navigation = useNavigation();
  const postId = route.params.postId;
  const [location, setLocation] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [record, setRecord] = useState('');
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
    axios.get('http://localhost:8080/v1/posts/' + postId)
        .then((res) => {
          setLocation(res.data.result.location);
          setRecord(res.data.result.record);
        })
        .catch((err)=>{
            console.log(err)
        })
   }, [])

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

  const handleEmotionSelect = emotion => {
    setSelectedEmotion(emotion);
  };

  const handlePostTextChange = text => {
    setRecord(text);
  };

  //공개,비공개 선택
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckBoxChange = () => {
    setIsChecked(!isChecked);
  };

  // 위치 검색
  const getSearchPlace = async () => {
    try {
      const getPlace = await AsyncStorage.getItem('searchPlace') || '';
      console.log('검색 장소 확인');
      console.log(getPlace);
      setLocation(getPlace);
      if (getPlace == null) { console.log('Search Place not found');}
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  };

  function uploadPost() {
    console.log("postId : " + postId);
    if(location.trim() == "") {
      Alert.alert("위치 입력 확인", "장소는 필수 입력 사항입니다.");
    } else if(record.trim() == "") {
      Alert.alert("게시글 입력 확인", "게시글은 필수 입력 사항입니다.");
    } else {
      axios.patch("http://localhost:8080/v1/posts/"+postId,  
        {
          location: location,
          emotion: selectedEmotion,
          record: record
        }, {
          headers: {
            'Authorization' : 'Bearer ' + token,
            'Content-Type': 'application/json'
          }
        }).then(function(resp) {
          console.log('게시글 수정 성공!');
          Alert.alert("게시글 수정 성공!", "게시글이 성공적으로 수정되었습니다.");
          navigation.navigate('TabNav');
        }).catch(error => {
          Alert.alert("게시글 수정 실패!", "수정 버튼을 한번 더 클릭해주세요!");
          console.error('API 요청 에러:', error);
        }) 
    }
  }

  function goGoogleMap() {
    navigation.navigate('GoogleMapUpdate',  {postId: postId,});
  }

  return (
    <View style={styles.container}>
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
          <Text>3가지 감정이모지 박스</Text>
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
          <Text style={styles.componentText}>글 작성 ({record.length}/1000)</Text>
          <TextInput
            multiline
            placeholder="공간에서의 경험이나 정보, 감정을 작성해주세요!"
            placeholderTextColor="#d3d3d3" 
            value={record}
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
            <Text style={styles.uploadBtnText}>게시글 수정</Text>
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
  photoComponent: { // 사진 추가 아이콘 + 텍스트 스타일 설정
    flexDirection: 'column',
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
  },
  placeBtn: { // 위치 검색 버튼 클릭 스타일 설정
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    width: 150,
    marginRight: 10,
  },
  photoBtn: { // 사진 등록 버튼 클릭 스타일 설정
    borderColor: '#C4C1CC',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: 130,
    height: 160,
    marginRight: 10,
    marginBottom: 5,
  },
  component: { // 글작성, 비공개 설정 컴포넌트 스타일 설정
    marginTop: 3,
    paddingBottom: hp(2),
  },
  componentText: { // 위치 검색, 사진 추가 텍스트 색상 설정
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
    borderRadius: 30,
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

export default UpdateScreen;
