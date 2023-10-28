import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Image, Button, Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import UnityView from '@azesmway/react-native-unity';
import {enableScreens} from 'react-native-screens';
enableScreens();

import LogoutScreen from './screens/LogoutScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DetailPostScreen from './screens/DetailScreen';
import UpdateScreen from './screens/UpdateScreen';
import TabNav from './components/TabNav';
import UserInfoUpdateScreen from './screens/UserInfoUpdateScreen';
import GoogleMap from './screens/GoogleMap';
import PostCreateScreen from './screens/PostCreateScreen';
import GoogleMapUpdate from './screens/GoogleMapUpdate';
import CommentScreen from './screens/CommentScreen';
import PostImageScreen from './screens/PostImageScreen';
import Unity from './screens/Unity';

const Stack = createStackNavigator();

function BackBtn() {
  return (
    <Image
      source={require('./assest/images/backBtn.png')}
      style={{marginLeft: 5, width: 30, height: 30}}
    />
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Logout"
          component={LogoutScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: BackBtn,
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: BackBtn,
          }}
        />
        <Stack.Screen
          name="TabNav"
          component={TabNav}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerLeft: () => null,
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailPostScreen}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: BackBtn,
          }}
        />
        <Stack.Screen
          name="Update"
          component={UpdateScreen}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: BackBtn,
          }}
        />
        <Stack.Screen
          name="UserUpdate"
          component={UserInfoUpdateScreen}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: BackBtn,
          }}
        />
        <Stack.Screen
          name="GoogleMap"
          component={GoogleMap}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: BackBtn,
          }}
        />
        <Stack.Screen
          name="PostCreate"
          component={PostCreateScreen}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: BackBtn,
          }}
        />
        <Stack.Screen
          name="GoogleMapUpdate"
          component={GoogleMapUpdate}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: BackBtn,
          }}
        />
        <Stack.Screen
          name="CommentScreen"
          component={CommentScreen}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: BackBtn,
          }}
        />
        <Stack.Screen
          name="PostImageScreen"
          component={PostImageScreen}
          options={{
            title: '',
            headerBackTitleVisible: false,
            headerBackImage: BackBtn,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
