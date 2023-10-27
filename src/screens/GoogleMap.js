import React, {useState, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function GoogleMap() {
  //selectedLocation : 선택된 장소의 좌표
  //setSelcetedLocation : 상태변수 업데이트
  const [selectedLocation, setSelectedLocation] = useState(null); // 추가: 선택된 장소의 좌표 상태
  const mapRef = useRef(null); //현재 컴포넌트에 대한 참조 생성
  const placesAutocompleteRef = useRef(null);
  const navigation = useNavigation();

  //검색 결과로 장소 이동
  const handlePlaceSelect = details => {
    const {location, name, formatted_address} = details.geometry;
    const newRegion = {
      //지도의 확대 축소
      latitude: location.lat,
      longitude: location.lng,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    };
    setSelectedLocation(newRegion); // 선택된 장소의 좌표 업데이트
    mapRef.current.animateToRegion(newRegion, 200);
    placesAutocompleteRef.current.setAddressText('');
    console.log(`Latitude: ${location.lat}, Longitude: ${location.lng}`);
  };

  return (
    <>
      <View style={{flex: 1}}>
        <GooglePlacesAutocomplete
          ref={placesAutocompleteRef}
          minLength={2}
          placeholder="장소검색"
          query={{
            key: '',
            language: 'ko',
            components: 'country:kr',
          }}
          e
          keyboardShouldPersistTaps={'handled'}
          fetchDetails={true}
          onPress={(data, details = null) => {
            handlePlaceSelect(details); // 장소 선택시 처리하는 함수 호출
            console.log(data);
            AsyncStorage.setItem('searchPlace', data.description);
            navigation.navigate('PostCreate');
          }}
          onFail={error => console.log(error)}
          onNotFound={() => console.log('no results')}
          keepResultsAfterBlur={true}
          enablePoweredByContainer={false}
          styles={style.search}
        />
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.5665,
            longitude: 126.978,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          ref={mapRef} // 맵 뷰에 ref 추가
        >
          {selectedLocation && ( // 선택된 장소가 있을 때 마커 표시
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title="your place" // 검색 결과의 이름으로 설정
              description="this is your place" // 검색 결과의 주소로 설정
            />
          )}
        </MapView>
      </View>
    </>
  );
}
const style = StyleSheet.create({
  search: {
    textInputContainer: {
      backgroundColor: 'grey',
      height: 30,
      color: 'black',
    },
    textInput: {
      height: 38,
      color: '#5d5d5d',
      fontSize: 16,
    },
    listView: {
      backgroundColor: "#ffffff",
      borderRadius: 10,
      paddingHorizontal: 10,
      elevation: 8,
      shadowColor: "#6164BB",
    },
    description: {
      fontSize: 15,
      fontFamily: "spoqaR",
      color: 'black',
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
  },
});

export default GoogleMap;