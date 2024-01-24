import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../Screen/Login/Login';
import Dashboard from '../Screen/Dashboard/Dashboard';
import DrawerNavigator from './DrawerNavigator';
import SelectClass from '../Screen/Digital Content/SelectClass';
import SelectSubject from '../Screen/Digital Content/SelectSubject';
import DigitalContent from '../Screen/Digital Content/DigitalContent';
import Animations from '../Screen/Digital Content/Animations';
import Ebooks from '../Screen/Digital Content/Ebooks';
import ViewBook from '../Screen/Digital Content/ViewBook';
import Answerkey from '../Screen/Digital Content/Answerkey';
import Signup from '../Screen/Signup/Signup';
import ChangePassword from '../Screen/Profile/ChangePassword';
import PunchScreen from '../Screen/Report/PunchScreen';
import ReportSubmit from '../Screen/Report/ReportSubmit';
import ViewOrder from '../Screen/OrderPlace/ViewOrder';
import ViewConfirmOrder from '../Screen/OrderPlace/ViewConfirmOrder';
import AddOrder from '../Screen/OrderPlace/AddOrder';
import AddSchool from '../Screen/ManageSchool/AddSchool';
import EditSchool from '../Screen/ManageSchool/EditSchool';



const AppNavigator = () => {



  const Stack = createNativeStackNavigator();


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="landing" component={DrawerNavigator} />
        <Stack.Screen name="SelectClass" component={SelectClass} />
        <Stack.Screen name="SelectSubject" component={SelectSubject} />
        <Stack.Screen name="DigitalContent" component={DigitalContent} />
        <Stack.Screen name="Animations" component={Animations} />
        <Stack.Screen name="Ebooks" component={Ebooks} />
        <Stack.Screen name="ViewBook" component={ViewBook} />
        <Stack.Screen name="Answerkey" component={Answerkey} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="PunchScreen" component={PunchScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ReportSubmit" component={ReportSubmit} />
        <Stack.Screen name="ViewOrder" component={ViewOrder} />
        <Stack.Screen name="ViewConfirmOrder" component={ViewConfirmOrder} />
        <Stack.Screen name="AddOrder" component={AddOrder} />
        <Stack.Screen name="AddSchool" component={AddSchool} />
        <Stack.Screen name="EditSchool" component={EditSchool} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator