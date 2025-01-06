import { View, Text, TextInput, Image, TouchableOpacity, ScrollView} from 'react-native'
import React from 'react'
import Header from '../../Component/Common_Component/Header'
import styles from '../Signup/styles'
import CutomWarning from '../../Component/Common_Component/CutomWarning'
import Loader from '../../Component/Common_Component/Loader'
import { fetchToken } from '../../Helpers/fetchDetails'
import api from '../../API/api'
import Toast from 'react-native-toast-message';

const ChangePassword = (props:any) => {
    const [CurrentPassword, setCurrentPassword] = React.useState('');
    const [NewPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setconfirmPassword] = React.useState('');

    const [modalVisible, setModalVisible] = React.useState<boolean>(false);
    const [modalMessage, setModalMessage] =React. useState<string>('');
    const [isLoading, setIsLoading] = React.useState<boolean>(false);



    const changePassword=async()=>{
        if (CurrentPassword === '') {
            setModalMessage('Current Password is required');
            setModalVisible(true);
            return
        }
        if (NewPassword === '') {
            setModalMessage('New Password is required');
            setModalVisible(true);
            return
        }
        if (confirmPassword === '') {
            setModalMessage('Confirm Password is required');
            setModalVisible(true);
            return
        }

        if (NewPassword !== confirmPassword) {
            setModalMessage('New Password and Confirm Password does not match');
            setModalVisible(true);
            return
        }

        const Credentials={
            'current':CurrentPassword,
            'new':NewPassword
        }

        const Token = await fetchToken();
        if(Token){
            setIsLoading(true)
            try{

                const response = await api.change_password(Token,Credentials)

                if(response.data.status===true){
                    setIsLoading(false)
                    Toast.show({
                        type: "success",
                        text1: response.data.message,
                        autoHide: false,
                        visibilityTime: 2000,
                        onShow: () => {
                            setTimeout(() => {
                                Toast.hide();
                                props.navigation.navigate("Profile");
                            }, 2000); // Wait for 1 second before navigating
                        },
                      });
                }

                // if (response.data.status === false) {
                //     setIsLoading(false); // Stop the loading state
                
                //     // Show an error Toast notification
                //     Toast.show({
                //         type: "error",
                //         text1: response.data.message,
                //         autoHide: false,
                //         visibilityTime: 2000,
                //         onShow: () => {
                //             setTimeout(() => {
                //               Toast.hide();
              
                //             }, 1000); // Wait for 1 second before navigating
                //           },
                //     });
                // }
                
            }catch(error){
                setIsLoading(false)
                console.log("change password eror:",error)

        if (error.response && error.response.status === 401) {
            const errorMessage = error.response.data.message;
  
            if (errorMessage && errorMessage.length > 0) {
            //   setModalMessage(errorMessage);
            //   setModalVisible(true);
            //   return
                       
                    // Show an error Toast notification
                    Toast.show({
                        type: "error",
                        text1: errorMessage,
                        autoHide: false,
                        visibilityTime: 2000,
                        onShow: () => {
                            setTimeout(() => {
                              Toast.hide();
              
                            }, 2000); // Wait for 1 second before navigating
                          },
                    });
                
              // Display an error message to the user
            } else {
              console.log("Something went wrong. Please contact the admin.");
              // Display a generic error message
            }
          }

            }
        }
    }


    const closeModal = () => {
        setModalVisible(false);
    };
  
    return (
        <ScrollView contentContainerStyle={styles.changepasswordcontainer}>
          <Header
            bg={'blue'}
            title={'Change Password'}
            leftIcon={'arrow-back'}
            onLeftPress={() => props.navigation.goBack()}
          />
    
          <View style={styles.container}>
            <Image source={require('../../assets/images/logo_circle.png')} style={[styles.logo, { marginTop: 20 }]} />
    
            <View style={styles.inputView}>
              <Text style={styles.textinputlabel}>Current Password</Text>
              <TextInput
                style={styles.inputText}
                placeholderTextColor={"#787a7c"}
                autoCapitalize='none'
                autoCorrect={false}
                value={CurrentPassword}
                placeholder="Current Password"
                onChangeText={(CurrentPassword) => setCurrentPassword(CurrentPassword)}
              />
            </View>
    
            <View style={styles.inputView}>
              <Text style={styles.textinputlabel}>New Password</Text>
              <TextInput
                style={styles.inputText}
                placeholderTextColor={"#787a7c"}
                autoCapitalize='none'
                autoCorrect={false}
                value={NewPassword}
                placeholder="New Password"
                onChangeText={(NewPassword) => setNewPassword(NewPassword)}
              />
            </View>
    
            <View style={styles.inputView}>
              <Text style={styles.textinputlabel}>Confirm Password</Text>
              <TextInput
                style={styles.inputText}
                placeholderTextColor={"#787a7c"}
                autoCapitalize='none'
                autoCorrect={false}
                value={confirmPassword}
                placeholder="Confirm Password"
                onChangeText={(confirmPassword) => setconfirmPassword(confirmPassword)}
              />
            </View>
    
            <TouchableOpacity onPress={changePassword} style={styles.loginBtn}>
              <Text style={styles.loginText}>Change Password</Text>
            </TouchableOpacity>
          </View>
    
          <CutomWarning visible={modalVisible} message={modalMessage} closeModal={closeModal} />
    
          {isLoading ? <Loader Loading={isLoading} /> : null}
        </ScrollView>
      );
    };


export default ChangePassword