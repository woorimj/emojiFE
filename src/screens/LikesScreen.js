import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Feather from "react-native-vector-icons/Feather";
import { Grayscale } from 'react-native-image-filter-kit';

const LikesScreen = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState('');
  const [isLiked, setIsLiked] = useState([]);

  const [searchData, setSearchData] = useState([
    {
      id: 0,
      images: [],
    },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('token') || '';
          console.log('토큰 확인 : ');
          console.log(storedToken);
          setToken(storedToken);
    
          // 토큰이 비어있지 않은 경우에만 서버 요청을 보냄
          if (storedToken !== '') {
            const res1 = await axios.get('http://localhost:8080/v1/posts', {
              headers: {
                'Authorization' : 'Bearer ' + token,
                'Content-Type': 'application/json'
              }
            });
            const posts = res1.data.result;
            console.log(posts);
            setIsLiked(posts.filter(post => post.likeNum == 1));
            console.log(isLiked);
  
            const res2 = await axios.get("http://localhost:8080/v1/images");
            const images = res2.data.result;
  
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
            setSearchData(updatedSearchData);
  
            console.log(searchData);
          }
        } catch (error) {
          console.error('에러 발생:', error);
        }
      };
    
      fetchData(); // fetchData 함수 호출
    }, [])
  );

  return (
    <FlatList
      data={isLiked}
      renderItem={({item, i}) => {
        const matchingImage = searchData[0].images.find(imageUrl =>
          imageUrl.includes(`/${item.postId}/`)
        );

      return (
          <TouchableOpacity
            onPress={() => navigation.navigate('Detail', {
              postId: item.postId,
            })}
          >
          <View style={styles.container} key={i}>
            <ImageBackground
              source={matchingImage ? {uri: matchingImage} : require('../assest/images/likesBasicImage.jpg')}
              style={styles.containerBackGround}
              blurRadius={5}
              borderRadius={12}
            >
              <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: 10,}}>
                <View style={styles.imageContentText}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.itemNameText}>{item.username}</Text>
                    <Text style={styles.itemContentText}>{item.createdAt}</Text>
                  </View>
                  <View style={styles.locationComponent}>
                    <Feather name="map-pin" size={15} color="white"/>
                    <Text style={styles.locationText}>{item.location}</Text>
                  </View>
                  <Text style={styles.itemContentText}>{item.record}</Text>
                </View>
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      );
    }}
  />
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 12,
    height: 130,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 18.95,
    elevation: 5,
    zIndex: 1,
    borderRadius: 10,
  },
  containerBackGround: {
    flex:1,
  },
  imageContentText: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  itemNameText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  itemContentText: {
    color: 'white',
  }, 
  locationText: {
    color: 'white',
    marginLeft: 5,
  },
  locationComponent: { 
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default LikesScreen;
