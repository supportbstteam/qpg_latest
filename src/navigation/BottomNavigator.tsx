import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Image, StyleSheet, View} from 'react-native';
import Profile from '../Screen/Profile/Profile';
import Attendance from '../Screen/Attendance/Attendance';
import Dashboard from '../Screen/Dashboard/Dashboard';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="visits"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {height: 70},
        tabBarLabelStyle: {fontSize: 15, marginVertical: 5, color: 'blue'},
      }}>
            <Tab.Screen
        name="visits"
        component={Dashboard}
        options={{
          tabBarLabel: 'Visits',
          tabBarIcon: tabInfo => {
            return (
              <View
                style={[
                  styles.circle,
                  {backgroundColor: tabInfo.focused ? 'blue' : 'white'},
                ]}>
                <Image
                  source={require('../assets/images/visits.png')}
                  style={[
                    styles.icon,
                    {tintColor: tabInfo.focused ? 'white' : 'blue'},
                  ]}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="checkin"
        component={Profile}
        options={{
          tabBarLabel: 'Check-In',
          tabBarIcon: tabInfo => {
            return (
              <View
                style={[
                  styles.circle,
                  {backgroundColor: tabInfo.focused ? 'blue' : 'white'},
                ]}>
                <Image
                  source={require('../assets/images/check-in.png')}
                  style={[
                    styles.icon,
                    {tintColor: tabInfo.focused ? 'white' : 'blue'},
                  ]}
                />
              </View>
            );
          },
        }}
      />
  
      <Tab.Screen
        name="pin"
        component={Attendance}
        options={{
          tabBarLabel: 'Pin',
          tabBarIcon: tabInfo => {
            return (
              <View
                style={[
                  styles.circle,
                  {backgroundColor: tabInfo.focused ? 'blue' : 'white'},
                ]}>
                <Image
                  source={require('../assets/images/pin.png')}
                  style={[
                    styles.icon,
                    {tintColor: tabInfo.focused ? 'white' : 'blue'},
                  ]}
                />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default BottomTabNavigator;
