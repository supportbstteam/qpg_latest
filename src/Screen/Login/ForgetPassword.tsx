import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Toast from 'react-native-toast-message';
import api from '../../API/api';
import Loader from '../../Component/Common_Component/Loader';

const ForgotPasswordScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [email, setemail] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (val: any) => {
    // Regular expression for a valid email format
    const emailRegex = /^[^\s@]+@gmail\.com$/;

    if (emailRegex.test(val)) {
      // Email is valid
      return true;
    } else {
      return false;
    }
  };

  const handleSendLink = async () => {
    setIsLoading(true);
    try {
      if (email === '') {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'Email Cannot be Empty!',
          visibilityTime: 1000,
        });
        return;
      }
      if (!validateEmail(email)) {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Invalid Email Type',
          text2: 'Please Enter Valid Email',
          visibilityTime: 1500,
        });
        return;
      }

      const {link,expirationTime} = await genereteLink();
      // console.log(link,"valid",expirationTime)
      const response = await api.forget_password({email, link,expirationTime});
      console.log(response.data.msg);
      if (
        response.status === 200 &&
        response.data.msg === 'Mail Sent Succesfully!!'
      ) {
        // Link sent successfully
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Success',
          text2: 'Reset password link sent successfully!',
          visibilityTime: 2000,
        });
        navigation.navigate('Login');
      } else {
        // User does not exist or other error
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Invalid User Email',
          text2: response.data.msg,
          visibilityTime: 2000,
        });
      }
    } catch (error) {
      // Handle other errors
      console.error('Forget password error:', error);
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Retry again after some time!',
        visibilityTime: 2000,
      });
    } finally {
      setemail('');
      setIsLoading(false);
    }
  };

  const genereteLink = async () => {
    try {
      // Get the current time
      const currentTime = Date.now();

      // Set the link expiration time (e.g., 10mins from now)
      const expirationTime = currentTime + 10 * 60 * 1000; // 10 minutes in milliseconds
      console.log('expirytime',expirationTime);
      // Build the link with the expiration time as a parameter
      const link = await dynamicLinks().buildShortLink({
        link: `https://qpg.page.link/?expiration=${expirationTime}/?email=${email.trim()}`,
        domainUriPrefix: 'https://qpg.page.link',
        android: {
          packageName: 'com.qpg',
        },
      });

      console.log('link generated ', link);
      return {link,expirationTime};
    } catch (error) {
      console.log('Generate Link Error', error);
    }
  };

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="always" style={{flex: 1}}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo_circle.png')} // Add the path to your logo image
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <CustomTextInput
            placeholder="Please Enter Your Email..."
            value={email}
            title="Email ID"
            onChangeText={text => setemail(text)}
            keyboardType="default"
          />
          <TouchableOpacity
            style={styles.sendLinkButton}
            onPress={handleSendLink}>
            <Text style={styles.sendLinkButtonText}>Send Link</Text>
          </TouchableOpacity>

          <View style={styles.bottomContainer}>
            <View style={styles.rowContainer}>
              <Text style={styles.signInText}>Remember your password?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInButton}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      {isLoading ? <Loader Loading={isLoading} /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(10),
    marginBottom: responsiveHeight(10),
  },
  logo: {
    width: 150, // Adjust the width of the logo as needed
    height: 150, // Adjust the height of the logo as needed
  },
  label: {
    color: 'black',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  sendLinkButton: {
    width: responsiveWidth(95),
    backgroundColor: '#3498db',
    padding: responsiveHeight(2),
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3, // For Android
    marginTop: responsiveHeight(3),
    marginStart: responsiveWidth(2),
  },
  sendLinkButtonText: {
    color: 'white',
    fontSize: responsiveFontSize(2),
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bottomContainer: {
    marginTop: responsiveHeight(5),
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
    alignSelf: 'center',
  },
  signInText: {
    color: 'grey',
  },
  signInButton: {
    color: '#3498db',
    fontWeight: 'bold',
    marginStart: responsiveHeight(1),
    textTransform: 'uppercase',
  },
});

export default ForgotPasswordScreen;
