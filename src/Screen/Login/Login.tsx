import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
  Linking,
} from 'react-native';
import styles from './Styles';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import api from '../../API/api';
import {AxiosError} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AgreeCheckbox from '../../Component/Common_Component/AgreeCheckbox';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../Component/Common_Component/Loader';
import CutomWarning from '../../Component/Common_Component/CutomWarning';
import {setUser} from '../../Reducer/slices/userSlice';
import {fetccUserId, fetchToken} from '../../Helpers/fetchDetails';
import Toast from 'react-native-toast-message';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {resetURL, setURL} from '../../Reducer/slices/resetURL';
interface loginprops {
  navigation: any;
}

const Login: React.FC<loginprops> = props => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // here required error
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [token, setToken] = useState('');
  // const [userId, setuserId] = useState('');
  const [remember, setIsRemember] = React.useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const deepLinkUrl = useSelector((state: any) => state?.resetURL?.deepLinkUrl);

  const handleLink = async (link: any) => {
    const userId = await fetccUserId();
    console.log('userId', userId, 'link ', link);
    if (userId) return;
    const expirationTime = parseInt(link.url.split('expiration=')[1], 10);
    const emailID = link.url.split('email%3D')[1];

    if (isNaN(expirationTime) || expirationTime < Date.now()) {
      console.log('Link has expired, navigate to the Login screen');
      props.navigation.navigate('Login');
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Link has expired',
        visibilityTime: 2000,
      });
    } else {
      console.log('Link is still valid, navigate to the ResetPassword screen');
      // Check if the navigation prop is available before using it
      // dispatch(setURL(link)); // Set the deep link URL in Redux
      props.navigation.navigate('ResetPassword', {emailID, expirationTime});
    }
  };

  const handleLink2 = async (link: any) => {
    const userId = await fetccUserId();
    
    if (userId) return;
    const expirationTime = parseInt(link.split('expiration=')[1], 10);
    const emailID = link.split('email%3D')[1];

    if (isNaN(expirationTime) || expirationTime < Date.now()) {
      console.log('Link has expired, navigate to the Login screen');
      props.navigation.navigate('Login');
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Link has expired',
        visibilityTime: 3500,
      });
    } else {
      console.log('Link is still valid, navigate to the ResetPassword screen');

      props.navigation.navigate('ResetPassword', {emailID, expirationTime});
    }
  };

  useEffect(() => {
    const initialUrlHandler = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url && deepLinkUrl !== url) {
          // console.log('initial Url', url);
          dispatch(setURL(url)); // Set the deep link URL in Redux
          const link=await dynamicLinks().resolveLink(url)
          handleLink2(link.url);
          ``
        }
      } catch (err) {
        console.error('An error occurred', err);
      }
    };

    const sub = Linking.addEventListener('url', () => {
      console.log('open through link');
      dynamicLinks().onLink(handleLink);
    });

    initialUrlHandler();
    // Clean up the event listener when the component is unmounted
    return () => sub.remove();
  }, []);

  useEffect(() => {
    checksaveCredentials();
  }, []);

  // useEffect(() => {
  //     const fetchData = async () => {
  //         getToken_userId();

  //         if (token && userId) {
  //             try {
  //                 const userDetails = await get_user_details(token, parseInt(userId));
  //                 console.log("here userDetails",userDetails)
  //                 if (userDetails?.data.status===200) {
  //                     dispatch(setUser(userDetails.data))
  //                     props.navigation.navigate('landing');
  //                 } else {
  //                     Alert.alert("Somthing Wrong Contact to admin")
  //                     await AsyncStorage.removeItem('token');
  //                     await AsyncStorage.removeItem('userId');
  //                 }
  //             } catch (error) {
  //                 console.error("Error fetching user details:", error);
  //             }
  //         }
  //     };

  //     fetchData();

  // }, [token, userId]);

  useEffect(() => {
    const fetchData = async () => {
      const userToken = await fetchToken();
      const userUserId = await fetccUserId();

      if (userToken && userUserId) {
        // setToken(userToken);
        // setuserId(userUserId);

        try {
          const userDetails = await get_user_details(
            userToken,
            parseInt(userUserId),
          );
         
          if (
            userDetails &&
            userDetails.status === 200 &&
            userDetails.data.status !== 0
          ) {
            dispatch(setUser(userDetails.data));
            props.navigation.reset({
              index: 0,
              routes: [{name: 'landing'}],
            });

            // props.navigation.navigate('landing');
          } else {
            Alert.alert('Something Wrong. Contact admin');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('userId');
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchData();
  }, []);

  // const getToken_userId = async () => {
  //     const token = await fetchToken();
  //     const userId = await fetccUserId();
  //     if (token && userId) {
  //         setToken(token);
  //         setuserId(userId)
  //     }

  // };

  const checksaveCredentials = async () => {
    try {
      const saveCredentials = await AsyncStorage.getItem('saveCredentials');
      if (saveCredentials) {
        const {email, password} = JSON.parse(saveCredentials);
        setEmail(email);
        setPassword(password);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // here email validatioin code
  const isEmailValid = (email: string): boolean => {
    // Email validation regex pattern
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return pattern.test(email);
  };

  const handleLogin = async () => {
    if (email === '') {
      setModalMessage('Email is required');
      setModalVisible(true);
      return;
    } else if (!isEmailValid(email)) {
      setModalMessage('Invalid email format');
      setModalVisible(true);
      return;
    }

    if (password === '') {
      setModalMessage('Password is required');
      setModalVisible(true);
      return;
    }

    const credentials = {
      email: email,
      password: password,
    };

    try {
      setIsLoading(true);

      // here check remember auth
      if (remember) {
        const saveCredentials = JSON.stringify(credentials);
        await AsyncStorage.setItem('saveCredentials', saveCredentials);
      } else {
        await AsyncStorage.removeItem('saveCredentials');
      }

      // here check login credential
      const response = await api.login(credentials);
      // console.log("here login",response.data);

      if (response.data.success === true) {
        //    console.log("here login",response.data);

        const token = response.data.data.token;
        const userId = response.data.data.user.id;
        const userDetails = await get_user_details(token, userId);
        // console.log("here login",userDetails);
        if (userDetails) {
          setIsLoading(false);
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('userId', `${response?.data?.data?.user.id}`);
          dispatch(setUser(userDetails.data));

          Toast.show({
            type: 'success',
            text1: response.data.message,
            autoHide: false,
            visibilityTime: 2000,
            onShow: () => {
              setTimeout(() => {
                Toast.hide();
                props.navigation.reset({
                  index: 0,
                  routes: [{name: 'landing'}],
                });

                // props.navigation.navigate('landing');
              }, 1000); // Wait for 1 second before navigating
            },
          });
        } else {
          Alert.alert('Session Expire. Please Relogin to continue.');
        }
      }

      if (response.data.success === false) {
        setIsLoading(false);
        setModalMessage(response.data.message);
        setModalVisible(true);
        return;
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      const axioserror = error as AxiosError;
      if (axioserror.response && axioserror.response.status === 400) {
        Alert.alert(
          'Login Failed',
          'Email or Password incorrect. Please try again.',
          [
            {
              text: 'OK',
            },
          ],
          {cancelable: false},
        );
        return;
      } else {
        console.log('login error', error);
      }
    }
    // props.navigation.navigate('Dashbord');

    // console.log('form data:', { email, password })
  };

  const get_user_details = async (token: any, userId: any) => {
    try {
      const userDetails = await api.get_user(token, userId);
      // console.log("getting data of user ",userDetails)
      return userDetails;
    } catch (error) {
      console.log('userdetails error:', error);
    }
  };
  // here remember me function value set function
  const handleCheckboxChange = (value: boolean) => {
    setIsRemember(value);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <Image
            source={require('../../assets/images/logo_circle.png')}
            style={styles.logo}
          />

          <View style={styles.inputView}>
            <Text style={styles.textinputlabel}>Email</Text>

            <TextInput
              style={styles.inputText}
              placeholderTextColor={'#787a7c'}
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              placeholder="Enter Your Email"
              onChangeText={email => setEmail(email)}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.textinputlabel}>Password</Text>
            <TextInput
              placeholder="Enter Your Password"
              style={styles.psswordtextinput}
              placeholderTextColor={'#787a7c'}
              autoCapitalize="none"
              autoCorrect={false}
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={password => setPassword(password)}
            />
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#aaa"
              style={styles.icon}
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>
          <View style={styles.bottom}>
            <AgreeCheckbox
              label="Remember me"
              onChange={handleCheckboxChange}
            />
            <TouchableOpacity>
              <Text
                style={{color: '#000'}}
                onPress={() => props.navigation.navigate('ForgetPassword')}>
                Forgot Password
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 12,
              justifyContent: 'center',
              width: '100%',
            }}>
            <Text style={{color: '#000'}}>Not a member ?</Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Signup')}>
              <Text style={{color: '#4D2DB7', fontSize: 16}}>
                {' '}
                Create an account{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      <CutomWarning
        visible={modalVisible}
        message={modalMessage}
        closeModal={closeModal}
      />

      {isLoading ? <Loader Loading={isLoading} /> : null}
    </>
  );
};

export default Login;
