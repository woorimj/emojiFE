import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './AppTabNavigator/HomeTab';
import PostScreen from './AppTabNavigator/PostTab';
import LikesScreen from './AppTabNavigator/LikesTab';
import MypageScreen from './AppTabNavigator/MypageTab';
import Unity from '../screens/Unity';

import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const Tab = createBottomTabNavigator();

const TabNavi = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={20} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={Unity}
        options={{
          tabBarIcon: ({color, size}) => (
            <AntDesign name="search1" size={20} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <AntDesign name="pluscircleo" size={20} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Likes"
        component={LikesScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Feather name="bookmark" size={20} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="Mypage"
        component={MypageScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <EvilIcons name="user" size={30} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavi;
