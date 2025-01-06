import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TextInput } from 'react-native-gesture-handler';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetccUserId, fetchToken } from '../../Helpers/fetchDetails';
import api from '../../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHistory } from '../../Reducer/slices/SaveOrderHistory';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';

const { width, height } = Dimensions.get('window');
interface HeaderProps {
  bg?: any;
  title?: any;
  leftIcon?: any;
  rightIcon?: any;
  onLeftPress?: any;
  onRightPress?: any;
  ViewCardItem?: any;
  SearchBarchangeText?: any;
  SearchPlaceHolder?:any;
  DashboardProps?: any;
}

const Header: React.FC<HeaderProps> = ({
  bg,
  title,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  ViewCardItem,
  SearchBarchangeText,
  SearchPlaceHolder,
  DashboardProps,
}) => {
  const [ItemLength, setItemLength] = useState(0);
  const [isChecking, setIsChecking] = useState(false); // Throttle flag
  const navigation = useNavigation();

  const getBookHistory = async () => {
    const HistoryData = await getHistory();
    setItemLength(HistoryData.length);
  };

  //Added flag functionality to throttle UserProfileChecker and limit api calls
  const UserProfileChecker = async () => {
    console.log('UserProfileChecker');

    try {
      setIsChecking(true); // Set flag to indicate check in progress

      // Fetch token from AsyncStorage
      const token: any = await fetchToken();
      const userId: any = await fetccUserId();

      if (token || userId) {
        // Make API request to get user profile
        const response = await api.get_user(token, userId);
        const userData = response.data;

        // Check if user status is active
        if (userData.status === 1) {
          // Do nothing if user is active
          console.log('User is active');
        } else {
          console.log('User is inactive');
          // Clear AsyncStorage
          await AsyncStorage.clear();

          // Navigate user to login screen
          const resetAction = CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          navigation.dispatch(resetAction);

          // Show message to user
          Alert.alert(
            'Your account is inactive. Please contact admin.',
          );
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Handle error gracefully (e.g., show error message to user)
    } finally {
      setIsChecking(false); // Reset flag after check is complete
    }
  };

  useFocusEffect(
    useCallback(() => {
      getBookHistory();

      // Throttle UserProfileChecker to execute at most once every 30 seconds
      const throttleTimeout = setTimeout(() => {
        if (!isChecking) {
          UserProfileChecker();
        }
      }, 30000);

      return () => clearTimeout(throttleTimeout); // Cleanup timeout on component unmount or re-render
    }, [ViewCardItem, ItemLength]),
  );

  return (
    <SafeAreaView>
      <View style={[styles.header, { backgroundColor: bg }]}>
        <Icon
          name={leftIcon}
          size={30}
          color={'white'}
          onPress={onLeftPress}
          style={{ marginRight: 'auto' }}
        />
        {title ? <Text style={styles.title}>{title}</Text> : ''}

        {SearchBarchangeText ? (
          <TextInput
            placeholder={SearchPlaceHolder}
            placeholderTextColor={'#787a7c'}
            style={styles.searchInput}
            onChangeText={value => SearchBarchangeText(value)}
            autoFocus={true}
          />
        ) : (
          ''
        )}

        <Icon
          name={rightIcon}
          size={30}
          color={'white'}
          onPress={onRightPress}
          style={{ marginLeft: 'auto' }}
        />
        {ViewCardItem ? (
          <TouchableOpacity onPress={ViewCardItem}>
            {/* <Text
              style={{
                color: 'white',
                fontSize: responsiveFontSize(2),
                fontWeight: '500',
              }}>
              Booked Orders: {totalItemCount} */}
            {/* //changes from ItemLength to totalItemCount */}
            {/* </Text> */}
            <Icon
              name={'shopping-cart'}
              size={35}
              color={'white'}
              onPress={onRightPress}
              style={{ marginLeft: 'auto', marginRight: responsiveWidth(2) }}
            />
            <Text style={styles.itemCount}>{ItemLength}</Text>
          </TouchableOpacity>
        ) : (
          ''
        )}
        {DashboardProps ? (
          <TouchableOpacity onPress={DashboardProps}>
            <MaterialIcons name="dashboard" size={30} color={'white'} />
          </TouchableOpacity>
        ) : (
          ''
        )}
      </View>
    </SafeAreaView>
  );
};

export default Header;


const styles = StyleSheet.create({
  header: {
    width: width,
    height: 60,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: responsiveFontSize(2.5),
    color: 'white',
    fontWeight: 'bold',
  },
  searchInput: {
    width: '85%',
    marginLeft: 10,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    color: '#000',
  },
  itemCount: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    borderRadius: 50,
    color: 'white',
    width: 20,
    height: 20,
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
  },
});
