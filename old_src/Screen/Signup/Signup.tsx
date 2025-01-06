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
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import api from '../../API/api';
import {AxiosError} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AgreeCheckbox from '../../Component/Common_Component/AgreeCheckbox';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loader from '../../Component/Common_Component/Loader';
import CutomWarning from '../../Component/Common_Component/CutomWarning';
import {setUser} from '../../Reducer/slices/userSlice';
import {fetccUserId, fetchToken} from '../../Helpers/fetchDetails';
import CustomDropdown from '../../Component/Common_Component/CustomDropdown';
import Toast from 'react-native-toast-message';
import {Button} from '@rneui/base';

const Signup = props => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [contact, setContact] = useState('');

  // here required error
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const isEmailValid = (email: string): boolean => {
    // Email validation regex pattern
    const pattern = /^[^\s@]+@gmail\.com$/;
    return pattern.test(email);
  };
  const handleSignup = async () => {
    if (name === '') {
      setModalMessage('Name is required');
      setModalVisible(true);
      return;
    }
    if (contact === '' || contact.length !== 10) {
      console.log(contact);
      setModalMessage('Contact No. Should Valid!');
      setModalVisible(true);
      return;
    }
    if (email === '') {
      setModalMessage('Email is required');
      setModalVisible(true);
      return;
    } else if (!isEmailValid(email)) {
      setModalMessage('Invalid email format');
      setModalVisible(true);
      return;
    }
    if (role === '') {
      setModalMessage('Role is required');
      setModalVisible(true);
      return;
    }
    if (password === '') {
      setModalMessage('Password is required');
      setModalVisible(true);
      return;
    }
    const credentials = {
      name: name,
      email: email,
      contact_no: contact,
      role: role,
      password: password,
    };

    console.log('here regisf', credentials);

    try {
      setIsLoading(true);
      const response = await api.register(credentials);
      if (response.data.status === true) {
        setIsLoading(false);
        Toast.show({
          type: 'success',
          text1: response.data.message,
          autoHide: false,
          visibilityTime: 2000,
          onShow: () => {
            setTimeout(() => {
              Toast.hide();
              props.navigation.navigate('Login');
            }, 2000); // Wait for 1 second before navigating
          },
        });
      }

      console.log(response);
    } catch (error) {
      setIsLoading(false);
      console.log('sign up error:', error);

      if (error.response && error.response.status === 500) {
        const errorMessages = error.response.data.errors;

        if (
          errorMessages &&
          errorMessages.email &&
          errorMessages.email.length > 0
        ) {
          const errorMessage = errorMessages.email[0];
          setModalMessage(errorMessage);
          setModalVisible(true);
          return;
          // Display an error message to the user
        } else {
          console.log('Something went wrong. Please contact the admin.');
          // Display a generic error message
        }
      }
    }

    // console.log(credentials)
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const roles = [
    {label: 'Teacher', value: 3},
    {label: 'Student', value: 4},
  ];

  const handleroles = item => {
    setRole(item.value);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo_circle.png')}
          style={styles.logo}
        />

        <View style={styles.inputView}>
          <Text style={styles.textinputlabel}>Name</Text>

          <TextInput
            style={styles.inputText}
            placeholderTextColor={'#787a7c'}
            autoCapitalize="none"
            autoCorrect={false}
            value={name}
            placeholder="Enter Your Name"
            onChangeText={name => setName(name)}
          />
        </View>

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
          <Text style={styles.textinputlabel}>Contact No.</Text>

          <TextInput
            style={styles.inputText}
            placeholderTextColor={'#787a7c'}
            autoCapitalize="none"
            autoCorrect={false}
            value={contact}
            placeholder="Enter Your Contact No."
            onChangeText={contact => setContact(contact)}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View style={styles.inputView}>
          <Text style={styles.textinputlabel}>Role</Text>
          {/* <View style={{marginLeft:16}}> */}
          <CustomDropdown
            data={roles.map(roles => ({
              label: roles.label,
              value: roles.value,
            }))}
            placeholder="Select Role"
            onSelect={handleroles}
          />
          {/* </View> */}
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

        <TouchableOpacity onPress={handleSignup} style={styles.loginBtn}>
          <Text style={styles.loginText}>Register Now</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 12,
            justifyContent: 'center',
            width: '100%',
          }}>
          <Text style={{color: '#000'}}>Already have an account ? </Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
            <Text style={{color: '#4D2DB7', fontSize: 17}}>Sign In </Text>
          </TouchableOpacity>
        </View>
      </View>

      <CutomWarning
        visible={modalVisible}
        message={modalMessage}
        closeModal={closeModal}
      />

      {isLoading ? <Loader Loading={isLoading} /> : null}
    </ScrollView>
  );
};

export default Signup;
