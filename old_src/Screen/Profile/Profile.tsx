import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ScrollView, Platform, PermissionsAndroid } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Header from '../../Component/Common_Component/Header'
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import api, { Image_Base_Url } from '../../API/api';
import { fetchToken } from '../../Helpers/fetchDetails';
import Loader from '../../Component/Common_Component/Loader';
import { setUser } from '../../Reducer/slices/userSlice';
import { AxiosError } from 'axios';
import CutomWarning from '../../Component/Common_Component/CutomWarning';

const Profile = (props) => {
  const dispatch = useDispatch()
  const userData = useSelector((state: any) => state.user.userData)
  console.log("userdat", userData)

  const [name, setName] = React.useState(userData ? userData.name : '');
  const [editprofileimg, seteditprofileimg] = React.useState('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>('');

  const [email, setEmail] = React.useState('');
  const [contact_no, setcontact_no] = React.useState(userData ? userData.contact_no : '');
  const profileImage = userData ? userData.profile_pic : '';


  const handleProfile = async () => {

    const updateprofile = new FormData;
    updateprofile.append('name', name)
    if (email != '') {
      updateprofile.append('email', email)
    }

    updateprofile.append('contact_no', contact_no)

    if (editprofileimg) {
      updateprofile.append('profile_pic', {
        uri: editprofileimg,
        name: "profile_pic",
        type: "image/jpg"
      })
    }

    const userId = userData ? userData.id : 0;
    console.log("here update response", updateprofile)
    const Token = await fetchToken();
    if (userId && Token) {
      try {
        setIsLoading(true)
        const response = await api.user_update(userId, Token, updateprofile);
        if (response.data.status === true) {
          setIsLoading(false);


          const updatedUserData = {
            ...userData,
            ...response.data.data,
          };

          dispatch(setUser(updatedUserData));
          Toast.show({
            type: "success",
            text1: response.data.message,
            autoHide: false,
            visibilityTime: 2000,
            onShow: () => {
              setTimeout(() => {
                Toast.hide();

              }, 1000); // Wait for 1 second before navigating
            },
          });
          return;
        }


      } catch (error) {
        setIsLoading(false)
        console.log("update profile Error :", error)

        if (error.response && error.response.status === 500) {
          const errorMessages = error.response.data.error;

          if (errorMessages && errorMessages.email && errorMessages.email.length > 0) {
            const errorMessage = errorMessages.email[0];
            setModalMessage(errorMessage);
            setModalVisible(true);
            return
            // Display an error message to the user
          } else {
            console.log("Something went wrong. Please contact the admin.");
            // Display a generic error message
          }
        }
      }
    }

    console.log(updateprofile)
  }

  useEffect(() => {
    console.log(userData)
  }, [])

  const compressAndResizeImage = async (imagePath) => {
    const compressedImage = await ImageResizer.createResizedImage(
      imagePath,
      200, // Set your desired maximum width
      200, // Set your desired maximum height
      'JPEG', // Image format
      50, // Image quality (adjust as needed)
      0 // Image rotation (0, 90, 180, or 270)
    );

    return compressedImage;
  };
  // here img picker code
  const Camera = async () => {
    try {
      const cameraPermission = Platform.OS === 'android' ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA;

      const permissionResult = await request(cameraPermission);

      if (permissionResult === RESULTS.GRANTED) {
        console.log('Camera permission granted');

        const response = await ImagePicker.openCamera({
          width: 300,
          height: 400,
          cropping: true,
        });

        console.log('Image picker response:', response);
        const compressedImage = await compressAndResizeImage(response.path);
        seteditprofileimg(compressedImage.uri)


      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.error('Camera Error:', error);
    }
  };


  const Gallery = async () => {

    try {
      const androidVersion = Platform.OS === 'android' ? Platform.Version : null;

      let granted = PermissionsAndroid.RESULTS.DENIED;
      if (androidVersion >= 33) {
        granted = PermissionsAndroid.RESULTS.GRANTED;
      } else {
        granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      }
      console.log(granted)
      if (granted) {
        console.log('Gallery permission granted');

        const response = await ImagePicker.openPicker({
          width: 300,
          height: 400,
          cropping: true,
        });

        const compressedImage = await compressAndResizeImage(response.path);
        seteditprofileimg(compressedImage.uri);
      } else {
        console.log('Gallery permission denied');
      }
    } catch (error) {
      console.error('Gallery Permission Error:', error);
    }
  };


  const closeModal = () => {
    setModalVisible(false);
  };

  const changePassword = () => {
    props.navigation.navigate("ChangePassword")
  }
  return (
    <>
      <Header
        bg={'blue'}
        title={'Complete Your Profile'}
        leftIcon={'arrow-back'}
        onLeftPress={() => props.navigation.goBack()}
      />
      <ScrollView style={styles.container}>
        <View style={styles.profilePicker}>
          <TouchableOpacity onPress={Gallery}>


            {editprofileimg || profileImage ? (
              <Image
                source={editprofileimg ? { uri: editprofileimg } : { uri: `${Image_Base_Url}/${profileImage}` }}
                style={styles.profileIcon}
              />
            ) : (
              <Image
                source={require('../../assets/images/profile.png')}
                style={styles.profileIcon}
              />)}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cameraView} onPress={Camera}>
            <Image
              source={require('../../assets/images/camera.png')}
              style={styles.cameraIcon}
            />
          </TouchableOpacity>

        </View>


        <TouchableOpacity style={{ alignItems: "flex-end", marginHorizontal: 21 }} onPress={changePassword}>
          <Text style={{ color: "#4D2DB7", fontSize: 16 }}>Change Password</Text>
        </TouchableOpacity>


        <View style={styles.inputView}>

          <Text style={styles.textinputlabel}>Name</Text>
          <TextInput
            style={styles.inputText}
            placeholderTextColor={"#787a7c"}
            autoCapitalize='none'
            autoCorrect={false}
            value={name}
            placeholder="Enter Your Name"
            onChangeText={(name) => setName(name)} />
        </View>



        <View style={styles.inputView}>

          <Text style={styles.textinputlabel}>Email</Text>
          <TextInput
            style={styles.inputText}
            editable={false}
            placeholderTextColor={"#787a7c"}
            autoCapitalize='none'
            autoCorrect={false}
            value={email ? email : userData ? userData.email : ''}
            placeholder="Enter Your Email"
            onChangeText={(email) => setEmail(email)} />
        </View>

       <View style={styles.inputView}>

          <Text style={styles.textinputlabel}>Contact No</Text>
          <TextInput
            style={styles.inputText}
            placeholderTextColor={"#787a7c"}
            editable={false}
            autoCapitalize='none'
            autoCorrect={false}
            value={contact_no}
            keyboardType='phone-pad'
            maxLength={10}
            placeholder="Enter Your Contact No"
            onChangeText={(contact_no) => setcontact_no(contact_no)} />
        </View>

        {/* 
        <View style={styles.inputView}>

          <Text style={styles.textinputlabel}>Designation</Text>
          <TextInput
            style={styles.inputText}
            autoCapitalize='none'
            autoCorrect={false}
            editable={false}
            value={userData.designation ? userData.designation.toString() : ''}
          />
        </View> */}


        <View style={styles.inputView}>

          <Text style={styles.textinputlabel}>Role</Text>
          <TextInput
            style={styles.inputText}
            placeholderTextColor={"#787a7c"}
            autoCapitalize='none'
            autoCorrect={false}
            editable={false}
            value={userData.role ? userData.role.toString() : ''}
          />
        </View>

        {/* <Text style={styles.text}>{userData.name ? userData.name : ''}</Text> */}
        {/* <Text style={styles.text}>{userData.email ? userData.email : ''}</Text> */}
        {/* <Text style={styles.text}>{}</Text>
        <Text style={styles.text}>{}</Text> */}

        {/* <Text style={styles.text}>{userData.contact_no ? userData.contact_no : ''}</Text> */}
      </ScrollView>
      <TouchableOpacity
        onPress={handleProfile}
        style={styles.loginBtn}>
        <Text style={styles.loginText}>Update Profile</Text>
      </TouchableOpacity>
      {
        isLoading ? (
          <Loader Loading={isLoading} />
        ) : null
      }
      <CutomWarning
        visible={modalVisible}
        message={modalMessage}
        closeModal={closeModal}
      />
    </>
  );
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    // paddingHorizontal: 10,
    // backgroundColor: 'white',
  },
  profilePicker: {
    alignSelf: 'center',
  },
  profileIcon: {

    resizeMode: 'contain',
    width: responsiveHeight(15), height: responsiveHeight(15), borderRadius: responsiveWidth(15)
  },
  cameraView: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: 'blue',
  },
  detailView: {
    marginTop: 100,
    flexDirection: 'row',
    gap: 20,
    marginHorizontal: 20,
  },
  labelView: {
    flexDirection: 'column',
    gap: 20,
  },
  labelText: {
    fontSize: 17,
    color: 'black',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
    color: 'black',
    paddingTop: 2,
  },
  inputText: {
    width: responsiveWidth(95),
    height: responsiveHeight(8),

    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
    backgroundColor: 'white',
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(1.5),

    elevation: 2,
    color: "#000"
  },

  inputView: {
    width: responsiveWidth(95),
    marginRight: 20,
    position: "relative",

  },
  textinputlabel: {
    marginLeft: responsiveHeight(2.2), fontSize: responsiveFontSize(2), color: "#1A1A18"
  },
  loginBtn: {
    width: responsiveWidth(92),
    backgroundColor: "#4D2DB7",
    borderRadius: responsiveHeight(1),
    height: responsiveHeight(7),
    alignItems: "center",
    justifyContent: "center",
    // marginTop:responsiveHeight(3),
    marginBottom: responsiveHeight(1.4),
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
  },
  loginText: {
    color: "#FFF",
    fontSize: responsiveFontSize(2.3),
    fontWeight: "bold",
  },
});