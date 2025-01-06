import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation, { GeoPosition } from 'react-native-geolocation-service';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import Header from '../../Component/Common_Component/Header';
import { fetchToken } from '../../Helpers/fetchDetails';
import api from '../../API/api';
import Loader from '../../Component/Common_Component/Loader';
import {
  background_permission,
  requestPermission,
} from '../../Helpers/CheckPermission';

import SendLocation from './SendLocation';
import Toast from 'react-native-toast-message';

type GeoCoordinates = {
  lat: number;
  lng: number;
};

const PunchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [checkTimer, setCheckTimer] = useState('false');
  const [startDateTime, setStartDateTime] = useState<Date | undefined>(
    undefined,
  );

  const [endDateTime, setendDateTime] = useState<Date | Number>(0);
  // const [coordinates, setCoordinates] = useState<GeoCoordinates[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [school, SetSchool] = useState<any>([]);
  const [schoolId, setSchoolid] = useState(null);

  const formatElapsedTime = (elapsedTime: any) => {
    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const second = elapsedTime % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(second).padStart(2, '0')}`;
  };

  const options = {
    taskName: 'Punch In',
    taskTitle: 'Best Way Learning',
    taskDesc: 'Your app running in background',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: '',
    parameters: {
      delay: 60000,
    },
  };

  const sleep = (time: any): Promise<void> =>
    new Promise<void>(resolve => setTimeout(() => resolve(), time));

  const trackLocation = async () => {
    await new Promise(async () => {
      for (let i = 1; BackgroundService.isRunning(); i++) {
      
        console.log(i);
        try {
          // depends on which lib you are using
          if (checkTimer) {
            const position = (await getAndUpdatePosition()) as GeoPosition;
            if (position) {
              const newCoordinates = [
                { lat: position.coords.latitude, lng: position.coords.longitude },
              ];

              // setCoordinates(coordinates => [
              //   ...coordinates,
              //   {
              //     lat: position.coords.latitude,
              //     lng: position.coords.longitude,
              //   },
              // ]);
              const startDateTime = new Date();

              try {
                // Fetch the token
                const Token = await fetchToken();
                const data = {
                  coors: JSON.stringify(newCoordinates),

                };
                // console.log("newCoordinates123", data)
                // Check if a valid token is available
                if (Token) {
                  const response = await api.coordinates(Token, data);
                  // console.log("here map in backgorun mode", response.data);

                }
              } catch (error) {
                console.log('maps Error:', error);
              }

              // await update_map(newCoordinates, startDateTime);
            }
          } else {
            console.log('not hit api of background');
          }
        } catch (error) {
          // console.log(error);
        }
        await sleep(60000);
      }
    });
  };

  const getAndUpdatePosition = async () => {
    try {
      const position = await new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position: Geolocation.GeoPosition) => {
            resolve(position);
          },
          (error: Geolocation.GeoError) => {
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 60000, maximumAge: 10000 },
        );
      });

      return position;
    } catch (error: any) {
      console.log(error.code, error.message);
    }
  };

  useEffect(() => {
    const checkTimerStatus = async () => {
      const timerStatus = await AsyncStorage.getItem('checkTimer');
      if (timerStatus === 'true') {
        setCheckTimer('true');
        const storedStartDateTime = await AsyncStorage.getItem('startDateTime');

        if (storedStartDateTime) {
          setStartDateTime(new Date(storedStartDateTime));
        }
        const currentTime = new Date();

        if (storedStartDateTime) {
          const start = new Date(storedStartDateTime) as Date;
          const current = currentTime;
          const durationInelapsedTime = Math.floor(
            (current.getTime() - start.getTime()) / 1000,
          );
          console.log('Duration:', durationInelapsedTime, 'elapsedTime');
          setElapsedTime(durationInelapsedTime);
        }
      }
    };

    checkTimerStatus();
  }, []);

  const start_Background = async () => {
    let timerInterval;
    try {
      timerInterval = await BackgroundService.start(trackLocation, options);
    } catch (error) {
      console.error('Error starting BackgroundService:', error);
    }
  };

  const punchIn = async () => {
    let granted = false;
    let background_granted = false;
    

    await requestPermission((permissionGranted: any) => {
      granted = permissionGranted;
    });

    await background_permission((permissionGranted: any) => {
      background_granted = permissionGranted;
    });

    if (granted && background_granted) {
      setIsLoading(true);

      const startDateTime = new Date();
      setStartDateTime(startDateTime);

      Geolocation.getCurrentPosition(
        async position => {
          
          const newCoordinates = [
            { lat: position.coords.latitude, lng: position.coords.longitude },
          ];

          // setCoordinates(newCoordinates);
          setElapsedTime(0);
          setendDateTime(0);
          setCheckTimer('true');

          await AsyncStorage.setItem('checkTimer', 'true');
          await AsyncStorage.setItem(
            'startDateTime',
            startDateTime.toISOString(),
          );
          start_map(newCoordinates, startDateTime);
          // Introduce a 1-minute delay before starting the background task
          // setTimeout(async () => {
           
          // }, 10000); // 60000 milliseconds = 1 minute

        },
        error => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    } else {
      Alert.alert('Not Granted Background location permission');
    }
  };


  const PunchOut = async () => {
  
    const EndTime = new Date();
    await setendDateTimes(EndTime, () => {
      try {
        BackgroundService.stop().then(() => {
          setTimeout(() => { }, 3000);
        });
      } catch (error) {
        console.error('Error stopping BackgroundService:', error);
      }
    });
    const position = (await getAndUpdatePosition()) as GeoPosition;
    if (position) {
      const newCoordinates = [
        { lat: position.coords.latitude, lng: position.coords.longitude },
      ];
    
      end_map(newCoordinates, EndTime);
    }
    setCheckTimer('false');
    await AsyncStorage.removeItem('checkTimer');
    await AsyncStorage.removeItem('startDateTime');
  };

  // ...

  const setendDateTimes = async (value: Date, callback: () => void) => {
    await setendDateTime(value);
    callback();
  };

  

  const start_map = async (
    newCoordinates: GeoCoordinates[],
    startDateTime: Date,
  ) => {
    // Create a new array of formatted coordinates

    const formattedCoordinates = newCoordinates.map(coord => ({
      lat: coord.lat,
      lng: coord.lng,
    }));
    // Create the data object
    const punchedIn = await AsyncStorage.getItem('checkTimer');

    const data = {
      coors: JSON.stringify(formattedCoordinates),
      inTime: formattedTime(startDateTime),
   
      // total_time: !punchedIn && elapsedTime,
    };

    console.log('start time data', data);
    try {
      // Fetch the token
      const Token = await fetchToken();

      // Check if a valid token is available
      if (Token) {
        const response = await api.user_map_pdate(Token, data);
        // console.log("here map response", response,data);
        await start_Background();
        setIsLoading(false);

        if (!punchedIn && response.data.success) {
          navigation.goBack();
        }
      }
    } catch (error) {
      console.log('maps Error:', error);
    }
  };

  const end_map = async (
    newCoordinates: GeoCoordinates[],
    endDateTime: Date,
  ) => {
    // Create a new array of formatted coordinates

    const formattedCoordinates = newCoordinates.map(coord => ({
      lat: coord.lat,
      lng: coord.lng,
    }));
    // Create the data object
    const punchedIn = await AsyncStorage.getItem('checkTimer');

    const data = {
      coors: JSON.stringify(formattedCoordinates),
    
      outTime: formattedTime(endDateTime),
      total_time:  elapsedTime,
    };

    console.log('endtime data', data);
    try {
      // Fetch the token
      const Token = await fetchToken();

      // Check if a valid token is available
      if (Token) {
        const response = await api.user_map_pdate(Token, data);
        // console.log("here map response", response);/
        if (!punchedIn && response.data.success) {
          navigation.goBack();
        }
      }
      else{
        console.log("token not found")
      }
    } catch (error) {
      console.log('maps Error:', error);
    }
  };


  const formattedTime = (time: Date | Number) => {
    if (!time) {
      return '0:00'; // or any default value you prefer
    } else {
      return new Date(time as string | number).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const formattedDateforview = (dateTime: Date): string => {
    if (!dateTime) {
      return 'N/A'; // or any default value you prefer
    } else {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      };
      return dateTime.toLocaleDateString(undefined, options);
    }
  };

  useEffect(() => {
    if (checkTimer === 'true') {
      const intervalId = setInterval(() => {
        setElapsedTime(prevElapsedTime => prevElapsedTime + 1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [checkTimer]);

  useEffect(() => {
    const get_school = async () => {
      const token = await fetchToken();
      if (token) {
        try {
          const respone = await api.get_school(token);
          if (respone.data.status === true) {
            SetSchool(respone.data.data);
          }
          // console.log(respone.data.data);
        } catch (error) {
          console.log('get school error:', error);
        }
      }
    };
    get_school();
  }, []);

  //function to send school location to user
  const sendLocation = async () => {
    if (schoolId === null) {
      Alert.alert('Please Select School');
      return;
    }
    try {
      const token = await fetchToken();
      const position = (await getAndUpdatePosition()) as GeoPosition;

      const data = {
        vendor_id: schoolId,
        location:
          `${position.coords.latitude},${position.coords.longitude}`.trim(),
      };
      console.log(token, '  ', data);

      const responce = await api.sendLocation(token, data);
      console.log(responce.data.status);
      if (responce.data.status) {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Location Added Successfully!',
          visibilityTime: 2000,
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'top',
          text1: 'Error',
          text2: 'Location not Added!',
          visibilityTime: 2000,
        });
      }
    } catch (error: any) {
      console.log(error.data);
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <>
      <Header
        title={'Report'}
        bg={'blue'}
        leftIcon={'arrow-back'}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
    

        <View style={{ alignItems: 'center' }}>
          {startDateTime ? (
            <Text style={styles.text}>
              Punch In: {formattedDateforview(startDateTime)} :{' '}
              {formattedTime(startDateTime)}{' '}
            </Text>
          ) : (
            ''
          )}

          {endDateTime ? (
            <Text style={styles.text}>
              Punch out: {formattedDateforview(endDateTime as Date)} :{' '}
              {formattedTime(endDateTime)}{' '}
            </Text>
          ) : (
            ''
          )}

          {elapsedTime ? (
            <Text style={styles.text}>
              Time {formatElapsedTime(elapsedTime)}
            </Text>
          ) : (
            ''
          )}

          <TouchableOpacity
            style={[
              styles.btn,
              checkTimer === 'true'
                ? { backgroundColor: 'lightgray' }
                : { backgroundColor: 'green' },
            ]}
            onPress={punchIn}
            disabled={checkTimer === 'true'}>
            <Text style={{ color: 'white', fontSize: 17 }}>Punch In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ReportSubmit')}
            style={[
              styles.btn,
              checkTimer === 'false'
                ? { backgroundColor: 'lightgray' }
                : { backgroundColor: 'green' },
            ]}
            disabled={checkTimer === 'false'}>
            <Text style={{ color: 'white', fontSize: 17 }}>Submit Report</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              checkTimer === 'false'
                ? { backgroundColor: 'lightgray' }
                : { backgroundColor: 'red' },
            ]}
            onPress={PunchOut}
            disabled={checkTimer === 'false'}>
            <Text style={{ color: 'white', fontSize: 17 }}>Punch Out</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.btn,
              checkTimer === 'false'
                ? { backgroundColor: 'lightgray' }
                : { backgroundColor: 'red' },
            ]}
            onPress={() => setModalVisible(true)}
            disabled={checkTimer === 'false'}>
            <Text style={{ color: 'white', fontSize: 17 }}>Send Location</Text>
          </TouchableOpacity>
        </View>
      </View>
      <SendLocation
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={sendLocation}
        list={school}
        setid={val => setSchoolid(val)}
      />

      {isLoading ? <Loader Loading={isLoading} /> : null}
    </>
  );
};

export default PunchScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 19,
    color: 'black',
    fontWeight: '600',
    marginBottom: 20,
    // marginTop:30
  },
  btn: {
    width: '80%',
    marginHorizontal: 10,
    marginBottom: 20,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addSchoolbnt: {
    fontSize: 18,
    color: 'white',
    backgroundColor: 'blue',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
});
