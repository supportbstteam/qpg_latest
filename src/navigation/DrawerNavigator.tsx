import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import Animated, { Easing, withSpring, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Feather';
import BottomNavigator from './BottomNavigator';
import CustomDrawNavigator from './CustomDrawNavigator';
import Dashboard from '../Screen/Dashboard/Dashboard';
import Profile from '../Screen/Profile/Profile';
import Contectus from '../Screen/Contect us/Contectus';
import About from '../Screen/About/About';
import Terms from '../Screen/Terms/Terms';
import PrivacyPlicy from '../Screen/PrivacyPolicy/PrivacyPlicy';
import Help from '../Screen/Help/Help';
import ShareApp from '../Screen/ShareApp/ShareApp';
import AddOrder from '../Screen/OrderPlace/AddOrder';
import AddSchool from '../Screen/ManageSchool/AddSchool';
import ConfirmOrderHistory from '../Screen/OrderPlace/ConfirmOrderHistory';
import { useSelector } from 'react-redux';
import SchoolList from '../Screen/ManageSchool/SchoolList';
// Import your other components and styles here



const Drawer = createDrawerNavigator();



const DrawerNavigator = () => {
  const userData = useSelector((state: any) => state.user.userData)
  const userRole = userData ? userData.role_id : 0;
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          // Customize the drawer style if needed
        },
        drawerActiveTintColor: 'white', // Set the selected (active) text color
        drawerActiveBackgroundColor: 'blue', // Set the selected (active) background color
        drawerInactiveTintColor: 'white', // Set the inactive text color
        drawerInactiveBackgroundColor: 'rgba(0, 0, 255, 0.6)',
      }}
      drawerContent={props => <CustomDrawNavigator {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          drawerIcon: ({ focused, color, size }) => (
         <Icon name='home' color={"#ffffff"} size={30}/>
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Icon name='user' color={"#ffffff"} size={30}/>
          ),
        }}
      />

      {userRole !== 3 && userRole !== 4 ? (
        <>



          <Drawer.Screen
            name="Manage School"
            component={SchoolList}
            options={{
              drawerIcon: ({ focused, color, size }) => (
                <Icon name='plus-circle' color={"#ffffff"} size={30}/>
              ),
            }}
          />

          <Drawer.Screen
            name="Manage Order"
            component={ConfirmOrderHistory}
            options={{
              drawerIcon: ({ focused, color, size }) => (
                <Icon name='clock' color={"#ffffff"} size={30}/>
              ),
            }}
          />
        </>
      ) : null}




      <Drawer.Screen
        name="About Us"
        component={About}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Icon name='info' color={"#ffffff"} size={30}/>  
          ),
        }}
      />

      <Drawer.Screen
        name="Director Message"
        component={Terms}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Icon name='message-circle' color={"#ffffff"} size={30}/>  
          ),
        }}
      />



      <Drawer.Screen
        name="Contact Us"
        component={Contectus}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Icon name='phone' color={"#ffffff"} size={30}/>  
          ),
        }}
      />
      <Drawer.Screen
        name="Privacy Policy"
        component={PrivacyPlicy}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Icon name='book' color={"#ffffff"} size={30}/>  
          ),
        }}
      />


      <Drawer.Screen
        name="Help"
        component={Help}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Icon name='help-circle' color={"#ffffff"} size={30}/>  
          ),
        }}
      />

      <Drawer.Screen
        name="ShareApp"
        component={ShareApp}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Icon name='share' color={"#ffffff"} size={30}/>  
          ),
        }}
      />
    </Drawer.Navigator>

  );
};

export default DrawerNavigator;
