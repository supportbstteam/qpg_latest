import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import api from '../../API/api';
import {fetccUserId} from '../../Helpers/fetchDetails';

interface passwordprop {
  title: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secure: boolean;
  onEyePress: () => void;
}

const PasswordInput: React.FC<passwordprop> = ({
  title,
  placeholder,
  value,
  onChangeText,
  secure,
  onEyePress,
}) => (
  <View>
    <CustomTextInput
      title={title}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secure}
    />

    <MaterialCommunityIcons
      name={secure ? 'eye-off' : 'eye'}
      size={24}
      color="#aaa"
      style={styles.eyeicon}
      onPress={onEyePress}
    />
  </View>
);

const ResetPassword: React.FC<{navigation: any; route: any}> = ({
  navigation,
  route,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);

  const {emailID,expirationTime} = route.params;
  console.log(expirationTime);
  useEffect(() => {
    const checkLogin = async () => {
      const user_id = await fetccUserId();
      if (user_id) {
        navigation.navigate('landing');
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'User Already Logged In',
          text2: 'Please Logout to reset password!',
          visibilityTime: 2000,
        }); 
      }
    };

    checkLogin();
  }, []);

  const handleContinue = async () => {
    // Check if new password and confirm password are not empty
    if (!newPassword || !confirmPassword) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Password Cannot be Empty!',
        visibilityTime: 1000,
      });
      return;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Passwords do not match!',
        visibilityTime: 1000,
      });
      return;
    }

    // Perform API request to update password (replace with your actual API call)
    try {
      // Add your API request logic here
      // For example:
      // const response = await api.updatePassword(emailID, newPassword);

      // Assuming your API response structure has a 'success' property
      console.log('emailID', emailID);
      const response = await api.reset_password({
        email: emailID,
        password: newPassword,
        expire: expirationTime
      });
      console.log(response.data);
      if (response.data.status === true) {
        // Password reset successful
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Success',
          text2: response.data.message,
          visibilityTime: 2000,
        });
      } else {
        // Password reset failed
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: response.data.message,
          visibilityTime: 2000,
        });
      }
      navigation.navigate('Login'); // Navigate to login screen or any other screen
    } catch (error) {
      console.error('Password reset error:', error);
      // Handle error
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Error',
        text2: 'Password reset failed. Please try again.',
        visibilityTime: 2000,
      });
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="always" style={{flex: 1}}>
      <View style={styles.header}>
        <Icon
          name="arrow-back-circle-outline"
          size={35}
          color={'black'}
          style={styles.icon}
          onPress={() => {
            navigation.navigate('Login');
          }}
        />
        <Text style={styles.headerText}>Reset Password</Text>
      </View>

      <View style={styles.reset}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo_circle.png')} // Add the path to your logo image
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <CustomTextInput
          placeholder="Please Enter Your Email..."
          value={emailID}
          editable={false}
        />

        <PasswordInput
          title="New Password"
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secure={secure}
          onEyePress={() => setSecure(!secure)}
        />

        <PasswordInput
          title="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secure={secure2}
          onEyePress={() => setSecure2(!secure2)}
        />

        <TouchableOpacity
          style={styles.sendLinkButton}
          onPress={handleContinue}>
          <Text style={styles.sendLinkButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    textAlign: 'center',
    marginVertical: responsiveHeight(2),
  },
  headerText: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginVertical: responsiveHeight(2.2),
    color: 'black',
    opacity: 0.6,
    marginStart: responsiveWidth(5),
  },
  reset: {
    marginTop: responsiveHeight(5),
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 150, // Adjust the width of the logo as needed
    height: 150, // Adjust the height of the logo as needed
  },
  icon: {
    marginStart: responsiveWidth(3),
    marginTop: responsiveHeight(1.8),
    opacity: 0.4,
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
  eyeicon: {
    position: 'absolute',
    right: responsiveWidth(7),
    top: responsiveHeight(7),
  },
});

export default ResetPassword;
