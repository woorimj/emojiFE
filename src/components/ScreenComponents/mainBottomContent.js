import React, {useState, useEffect} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import {uselsFocused} from '@react-navigation/native';

import Feather from "react-native-vector-icons/Feather";

function MainBottomContent() {
  const navigation = useNavigation();

  const [searchData, setSearchData] = useState([
    {
      id: 0,
      images: [],
      location: '',
      username: '',
    },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try{
          const res1 = await axios.get("http://localhost:8080/v1/images");
          const images = res1.data.result;
  
          // 이미지 uri에서 숫자(게시글 번호) 찾기
          const postNumbers = images.map(image => {
            const match = image.match(/\/(\d+)\//);
            return match ? match[1] : null;
          });
  
          // 중복 제거
          const uniquePostNumbers = [...new Set(postNumbers)];
          const firstImages = uniquePostNumbers.map(postNumber => {
            return images.find(image => image.includes(`/${postNumber}/`));
          });
  
          const updatedSearchData = [...searchData]; 
          updatedSearchData[0].images = firstImages; 
        
          const res2 = await axios.get('http://localhost:8080/v1/posts/');
          const posts = res2.data.result;
          
          const includeImagePostId = uniquePostNumbers.map(postNumber => {
            const matchPost = posts.find(post => String(post.postId) == postNumber)
            if(matchPost) {
              const tmpLocation = matchPost.location.length > 12 ? `${matchPost.location.substring(0, 12)}...` : matchPost.location;
              return tmpLocation;
            }
            else return "...";
          });
  
          updatedSearchData[0].location = includeImagePostId; 
  
          const includeImagePostUser = uniquePostNumbers.map(postNumber => {
            const matchPost = posts.find(post => String(post.postId) == postNumber)
            if(matchPost) {
              return matchPost.username;
            }
            else return "...";
          });
  
          updatedSearchData[0].username = includeImagePostUser; 
          setSearchData(updatedSearchData);
        }catch(error) {
          console.log("에러 발생 : ", error);
        }
      };
  
      fetchData();
    }, [])
  );

  return (
    <View>
      {searchData.map((data, index) => {
        return (
          <View key={data.id} style={styles.row}>
            {data.images.map((imageData, imgIndex) => {
              const currentLocation = data.location[imgIndex]; 
              const currentUsername = data.username[imgIndex];
              return (
                <View key={imgIndex} style={styles.content}>
                  <Text style = {styles.userNameText}>{currentUsername}</Text>
                  <TouchableOpacity
                      onPress={() => navigation.navigate('Detail', {
                        postId: imageData.match(/\/(\d+)\//)[1],
                      })}
                    style={[{width: 320}]}>
                    <Image source={{uri : imageData}} style={styles.image} />
                  </TouchableOpacity>
                  <View style={styles.imgBottomStyle}>
                    <Image
                      source={require('../../assest/images/post2.jpg')} // 프로필 사진
                      style={styles.profileImage}
                      resizeMode="cover"
                    />
                     <View style={styles.locationIconText}>
                      <Feather name="map-pin" size={15} color="black" marginRight={5}/>
                      <Text style={styles.imageText}>{currentLocation}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mainBtnStyle: {
    width: 150,
    height: 50,
    borderColor: '#C4C1CC',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 15,
    justifyContent: 'center',
  },
  mainBtnText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  mainBtnImage: {
    width: 35,
    height: 35,
    borderRadius: 30,
    marginLeft: 10,
  },
  mainBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  content: {
    marginBottom: 25,
  },
  imageText: {
    color:'black',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  imgBottomStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationIconText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userNameText: {
    color: 'black',
    fontSize: 17,
    marginBottom: 5,
    fontWeight: 'bold',
    marginLeft: 3,
  },
});

export default MainBottomContent;
