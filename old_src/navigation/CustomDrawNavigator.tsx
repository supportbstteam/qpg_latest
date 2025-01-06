import {
  View,
  SafeAreaView,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import api, {Image_Base_Url} from '../API/api';
import {setUser} from '../Reducer/slices/userSlice';
import {useSelector} from 'react-redux';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Loader from '../Component/Common_Component/Loader';
import {fetchToken} from '../Helpers/fetchDetails';

interface customeprops {
  navigation: any;
}

interface userData {
  name: string;
  email: string;
  image: string;
}
const CustomDrawNavigator: React.FC<customeprops> = props => {
  const userData = useSelector((state: any) => state.user.userData);
  const profileImage = userData ? userData.profile_pic : '';
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    console.log(userData);
  }, []);

  const logout = async () => {
    const timerStatus = await AsyncStorage.getItem('checkTimer');
    if (timerStatus === 'true') {
      Alert.alert('First punchOut ');
      return false;
    }

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {
          text: 'Yes',
          onPress: async () => {
            setIsLoading(true);
            const token = await fetchToken();
            if (token) {
              try {
                const response = await api.logout(token);

                if (response.data.success === true) {
                  await AsyncStorage.removeItem('token');
                  await AsyncStorage.removeItem('userId');
                  const resetAction = CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Login'}],
                  });
                  props.navigation.dispatch(resetAction);
                }
              } catch (error) {
                console.log('Logout error:', error);
              }
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{backgroundColor: 'white'}}>
        <TouchableOpacity
          style={styles.userView}
          onPress={() => {
            props.navigation.navigate('Profile');
            props.navigation.closeDrawer();
          }}>
          {profileImage ? (
            <Image
              source={{uri: `${Image_Base_Url}/${profileImage}`}}
              style={styles.userViewImg}
            />
          ) : (
            <Image
              source={require('../assets/images/profile.png')}
              style={styles.userViewImg}
            />
          )}

          <Text style={styles.userViewText}>
            {userData ? userData.name : ''}
          </Text>
        </TouchableOpacity>
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <TouchableOpacity style={styles.footer} onPress={logout}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={require('../assets/images/logout.png')}
            style={{
              width: responsiveHeight(3.3), // Adjust the width as needed
              height: responsiveHeight(3.3), // Adjust the height as needed
              tintColor: 'white', // Tint color based on focus
            }}
          />
          <Text style={styles.logtext}>Log Out</Text>
        </View>
      </TouchableOpacity>
      <Loader loading={isLoading} />
    </SafeAreaView>
  );
};

export default CustomDrawNavigator;

const styles = StyleSheet.create({
  userView: {
    width: '100%',
    height: 100,
    borderBottomLeftRadius: 300,
    borderBottomRightRadius: 300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    gap: 5,
    marginBottom: 20,
  },
  userViewImg: {
    resizeMode: 'contain',
    width: responsiveHeight(8),
    height: responsiveHeight(8),
    borderRadius: responsiveWidth(8),
  },
  userViewText: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: 'white',
  },
  footer: {
    // position: "absolute",
    // right: 0,
    // left: 0,
    marginTop: 15,
    bottom: responsiveHeight(1.2),
    backgroundColor: 'blue',
    padding: responsiveHeight(1.9),
    marginHorizontal: 9,
    borderRadius: 5,
  },
  logtext: {
    fontSize: responsiveFontSize(2),

    color: 'white',
    marginLeft: responsiveHeight(1.4),
  },
});
