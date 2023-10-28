import React, {useRef, useEffect} from 'react';

import UnityView from '@azesmway/react-native-unity';

import {Button, Dimensions, Platform, View} from 'react-native';

const {width, height} = Dimensions.get('window');

class Unity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
    };

    this.initComponent = () => {
      if (Platform.OS === 'android') {
        // resumeUnity();
      }
    };
  }

  componentDidMount() {
    this.initComponent();
  }

  render() {
    const {isVisible} = this.state;
    let unityElement;

    if (Platform.OS === 'android') {
      unityElement = (
        <UnityView style={{width: width, height: height, zIndex: 2}} />
      );
    } else {
      unityElement = (
        <UnityResponderView
          fullScreen={true}
          style={{width: width, height: height}}
        />
      );
    }

    return (
      <View>
        {!isVisible && (
          <Button
            title={'Press Start Unity Project'}
            onPress={() => {
              this.setState({isVisible: true});
            }}
          />
        )}
        {isVisible && (
          <>
            {unityElement}
            <View
              style={{
                position: 'absolute',
                top: 45,
                left: 20,
                zIndex: 20,
              }}>
              <Button
                title={'Close'}
                onPress={() => {
                  if (Platform.OS === 'android') {
                    UnityView.OnplayerQuit();
                  }
                  this.setState({isVisible: false});
                }}
                style={{color: '#fff'}}
              />
            </View>
          </>
        )}
      </View>
    );
  }
}

export default Unity;
