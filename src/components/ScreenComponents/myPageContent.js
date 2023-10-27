import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';

const MyPageContent = props => {
  const searchData = [
    {
      id: 0,
      images: [
        require('../../assest/images/post1.jpg'),
        require('../../assest/images/post2.jpg'),
        require('../../assest/images/post3.jpg'),
      ],
    },
  ];

  return (
    <View>
      {searchData.map((data, index) => {
        return (
          <View
            key={data.id}
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {data.images.map((imageData, imgIndex) => {
              return (
                <TouchableOpacity
                  key={imgIndex}
                  // 여긴 다시 생각해보기!!
                  //   onPressIn={() => props.data(imageData)}
                  //   onPressOut={() => props.data(null)}
                  style={{paddingBottom: 2, width: '33%'}}>
                  <Image source={imageData} style={styles.image} />
                </TouchableOpacity>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
  },
});

export default MyPageContent;
