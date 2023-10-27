import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Image, StyleSheet, ScrollView,} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const MainTopContent = props => {
  const navigation = useNavigation();

  const [searchData, setSearchData] = useState([
    {
      id: 0,
      images: [],
    },
  ]);

  useEffect(() => {
    axios.get("http://localhost:8080/v1/images")
      .then(function(resp) {
        const images = resp.data.result;
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
      }).catch(error => {
        console.error('API 요청 에러:', error);
      })
  }, [])

  return (
    <View style={styles.container}>
      {/* 가로 스크롤이 안됨 */}
      <ScrollView horizontal={true} style={styles.scrollComponent}>
      {searchData.map((data, index) => {
        return (
          <View key={data.id}>
            {data.images.map((imageData, imgIndex) => {
              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Detail', {
                    postId: imageData.match(/\/(\d+)\//)[1],
                  })}
                  key={imgIndex}
                  style={styles.content}>
                  <Image source={{uri : imageData}} style={styles.image} />
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
     </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    flexDirection: 'column',
  },
  scrollComponent: {
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
  },
  content: {
    paddingBottom: 2,
    width: 200, 
    margin: 5,
  },
  image: {
    width: '100%',
    height: 200,
  },
});

export default MainTopContent;
