import StreetView from 'react-native-streetview';
import {StyleSheet, View} from 'react-native';

const StreetViewScreen = () => {
  
    return (
        <View style={styles.container}>
        <StreetView
          style={styles.streetView}
          allGesturesEnabled={true}
          coordinate={{
            'latitude': -33.852, // 위도
            'longitude': 151.211 // 경도
          }}
          pov={{
          tilt:parseFloat(0),
          bearing:parseFloat(0),
          zoom:parseInt(1)
          }}
        >
        </StreetView>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
    flex: 1
    },
    streetView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    },
});

export default StreetViewScreen;