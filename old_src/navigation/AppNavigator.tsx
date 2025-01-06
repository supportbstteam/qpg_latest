import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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
import ReportDetails from '../Screen/Report/ReportDetails';
import ForgotPasswordScreen from '../Screen/Login/ForgetPassword';
import ResetPassword from '../Screen/Login/ResetPassword';
import ViewSample from '../Screen/ManageSample/ViewSample';
import RequestSample from '../Screen/ManageSample/RequestSample';
import Accounts from '../Screen/Accounts/Accounts';
import ReportView from '../Screen/Report/ReportView';
import AddExpenses from '../Screen/Manage Expenses/AddExpenses';
import EditExpenses from '../Screen/Manage Expenses/EditExpenses';
import TeamDetails from '../Screen/ManageTeam/TeamDetails';


const AppNavigator = () => {

  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
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
        <Stack.Screen name="ReportDetails" component={ReportDetails} />
        <Stack.Screen name="ForgetPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="View Sample" component={ViewSample} />
        <Stack.Screen name="Accounts" component={Accounts} />
        {/* <Stack.Screen name="Request Sample" component={RequestSample} /> */}
        <Stack.Screen name="ReportView" component={ReportView} />
        <Stack.Screen name="AddExpenses" component={AddExpenses} />
        <Stack.Screen name="EditExpenses" component={EditExpenses} />
        <Stack.Screen name="TeamDetails" component={TeamDetails} />
     
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
