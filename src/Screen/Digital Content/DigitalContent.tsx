import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../Component/Common_Component/Header';
//   import Cards from '../components/DigitalContent/Cards';
//   import VideoPlayer from '../components/DigitalContent/VideoPlayer';
import { useSelector } from 'react-redux'

import { TouchEventType } from 'react-native-gesture-handler/lib/typescript/TouchEventType';
import { fetchToken } from '../../Helpers/fetchDetails';
import api from '../../API/api';

const DigitalContent = ({ route, navigation }) => {
  const [videos, setVideos] = useState(undefined);
  const [books, setBooks] = useState(undefined);
  const [pdfs, setPdfs] = useState(undefined);
  const userData = useSelector((state: any) => state.user.userData)
  const userRole = userData ? userData.role_id : 0;

  const classID = route.params.classId;
  const subjectID = route.params.subjectId;


  useEffect(() => {


    const getVideos = async () => {
      try {
        const token = await fetchToken()
        if (token) {
          let response = await api.video(token, classID, subjectID);

          setVideos(response.data);
        }

      } catch (error) {
        console.log(error);
      }
    };

    const getBooks = async () => {
      try {
        const token = await fetchToken()
        if (token) {
          let response = await api.book(token, classID, subjectID);

          setBooks(response.data);
        }

      } catch (error) {
        console.log(error);
      }
    };

    const getPDFs = async () => {
      try {
        const token = await fetchToken()
        if (token) {
          let response = await api.pdf(token, classID, subjectID);
          setPdfs(response.data);
        }

      } catch (error) {
        console.log(error);
      }
    };

    //   const getPDFs = async () => {
    //     await client.get(`/pdf/${classID}/${subjectID}`).then(
    //       response => {
    //         setPdfs(response.data);
    //       },
    //       error => {
    //         console.log(error);
    //       },
    //     );
    //   };
    getVideos();
    getBooks();
    getPDFs();
  }, [classID, subjectID]);
  return (
    <>
      <Header
        bg={'blue'}
        title={'Digital Content'}
        leftIcon={'arrowleft'}
        DashboardProps={()=>{navigation.navigate("Dashboard")}}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        style={{ backgroundColor: 'white' }}
        contentContainerStyle={{
          backgroundColor: 'white',
          marginHorizontal: 10,
          // paddingHorizontal:10,

        }}>
        <View style={{ width: '100%' }}>
        </View>
        <View style={{ width: '100%' }}>


          {userRole === 4 ? (
            <>
              <TouchableOpacity
                style={styles.btnn}
                onPress={() => {
                  navigation.navigate('Animations', videos);
                }}>
                <Image
                  source={require('../../assets/images/animated_videos.png')}
                  resizeMode="contain"
                  style={{
                    width: 60, // Adjust the width as needed
                    height: 60,// Adjust the height as needed


                  }}
                />
                <Text style={styles.txt}>Animations</Text>
                <Image
                  source={require('../../assets/images/Back.png')}
                  resizeMode="contain"
                  style={styles.nexticon}
                />
              </TouchableOpacity>

            </>
          ) : <>
            <TouchableOpacity
              style={styles.btnn}
              onPress={() => {
                navigation.navigate('Animations', videos);
              }}>
              <Image
                source={require('../../assets/images/animated_videos.png')}
                resizeMode="contain"
                style={{
                  width: 60, // Adjust the width as needed
                  height: 60,// Adjust the height as needed


                }}
              />
              <Text style={styles.txt}>Animations</Text>
              <Image
                source={require('../../assets/images/Back.png')}
                resizeMode="contain"
                style={styles.nexticon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Ebooks', books);
              }}
              style={styles.btnn}
            >
              <Image
                source={require('../../assets/images/e_book.png')}
                resizeMode="contain"
                style={{
                  width: 60, // Adjust the width as needed
                  height: 60, // Adjust the height as needed
                }}
              />
              <Text style={styles.txt}>E-Books</Text>
              <Image
                source={require('../../assets/images/Back.png')}
                resizeMode="contain"
                style={styles.nexticon}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Answerkey', pdfs);
              }}
              style={styles.btnn}
            >
              <Image
                source={require('../../assets/images/test_paper.png')}
                resizeMode="contain"
                style={{
                  width: 60, // Adjust the width as needed
                  height: 60,
                }}
              />
              <Text style={styles.txt}>Answer key</Text>
              <Image
                source={require('../../assets/images/Back.png')}
                resizeMode="contain"
                style={styles.nexticon}
              />
            </TouchableOpacity>
          </>}


        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  folder_icon: { width: 55, height: 55 },
  nexticon: { width: 35, position: 'absolute', right: 8, height: 35 },
  heading: {
    color: 'black',
    fontSize: 19,
    fontWeight: '700',
  },
  message: {
    color: 'darkgray',
    fontSize: 17,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 20,
  },
  btnn: {
    borderColor: '#ECECEC',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    marginVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 19,
    borderRadius: 20,
  },
  txt: {
    color: '#000000',
    fontFamily: 'Inter-SemiBold',
    marginLeft: 16,
    fontSize: 17,
  },
});

export default DigitalContent;