import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from 'react-native-geolocation-service';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import BackgroundService from 'react-native-background-actions';
import Header from '../../Component/Common_Component/Header';
import { fetchToken } from '../../Helpers/fetchDetails';
import api from '../../API/api';
import Loader from '../../Component/Common_Component/Loader';
import { background_permission, requestPermission } from '../../Helpers/CheckPermission';
import { Toast } from 'react-native-toast-message/lib/src/Toast';



const PunchScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [checkTimer, setCheckTimer] = useState('false');
  const [startDateTime, setStartDateTime] = useState<Date | undefined>(undefined);

  const [endDateTime, setendDateTime] = useState(0);
  const [coordinates, setCoordinates] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [BootomSheet, setBootomSheet] = useState(false);

  const formatElapsedTime = (elapsedTime) => {
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


  const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

  const trackLocation = async () => {
    await new Promise(async () => {
      for (let i = 1; BackgroundService.isRunning(); i++) {
        console.log(i)
        try {
          // depends on which lib you are using
          if (checkTimer) {
            const position = await getAndUpdatePosition();
            if (position) {


              const newCoordinates = [
                { lat: position.coords.latitude, lng: position.coords.longitude },
              ];

              setCoordinates(coordinates => [
                ...coordinates,
                {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
              ]);
              const startDateTime = new Date();
              await update_map(newCoordinates, startDateTime)
            }
          } else {
            console.log("not hit api of background");
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
          { enableHighAccuracy: true, timeout: 60000, maximumAge: 10000 }
        );
      });

      return position;

    } catch (error) {
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
          const start = new Date(storedStartDateTime);
          const current = currentTime;
          const durationInelapsedTime = Math.floor((current - start) / 1000);
          console.log("Duration:", durationInelapsedTime, "elapsedTime");
          setElapsedTime(durationInelapsedTime)
        }
      }
    };
    checkTimerStatus()
  }, [])


  const start_Background = async () => {

    let timerInterval
    try {
      timerInterval = await BackgroundService.start(trackLocation, options);
    } catch (error) {
      console.error('Error starting BackgroundService:', error);
    }
  }


  const punchIn = async () => {
    let granted = false; // Define granted in the scope of punchIn
    let background_granted = false; // Define granted in the scope of punchIn

    await requestPermission((permissionGranted) => {
      granted = permissionGranted;
    });

    await background_permission((permissionGranted) => {
      background_granted = permissionGranted;
    })
    if (granted && background_granted) {
      setIsLoading(true);

      const startDateTime = new Date();
      setStartDateTime(startDateTime);
      Geolocation.getCurrentPosition(
        async position => {

          setIsLoading(false);
          const newCoordinates = [
            { lat: position.coords.latitude, lng: position.coords.longitude },
          ];


          setCoordinates(newCoordinates);

          setElapsedTime(0);
          setendDateTime(0);
          setCheckTimer('true');

          await AsyncStorage.setItem('checkTimer', 'true');
          await AsyncStorage.setItem('startDateTime', startDateTime.toISOString());
          // update_map(newCoordinates,startDateTime);
          await start_Background()
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    }
    else {
      Alert.alert("Not Granted Background location permission  ")
    }
  };


  const PunchOut = async () => {
    setCheckTimer('false');
    const EndTime = new Date();
    await setendDateTimes(EndTime, () => {
      try {
        BackgroundService.stop().then(() => {

        });
      } catch (error) {
        console.error('Error stopping BackgroundService:', error);
      }
    });

    await AsyncStorage.removeItem('checkTimer');
    await AsyncStorage.removeItem('startDateTime');
  };

  // ...

  const setendDateTimes = async (value, callback) => {
    await setendDateTime(value);
    callback();
  };


  useEffect(() => {

    const punch_Time = async () => {
      if (endDateTime) {
        console.log("startDateTime before update_map", startDateTime);
        console.log("endDateTime before update_map", endDateTime);
        await getAndUpdatePosition()
        const position = await getAndUpdatePosition();
        if (position) {


          const newCoordinates = [
            { lat: position.coords.latitude, lng: position.coords.longitude },
          ];

          setCoordinates(coordinates => [
            ...coordinates,
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          ]);
          await update_map(newCoordinates, startDateTime)
        }
      }
    }
    punch_Time()
  }, [endDateTime])


  const update_map = async (newCoordinates, startDateTime) => {
    // Create a new array of formatted coordinates

    const formattedCoordinates = newCoordinates.map(coord => ({ lat: coord.lat, lng: coord.lng }));
    // Create the data object
    const data = {
      coors: JSON.stringify(formattedCoordinates),
      inTime: formattedTime(startDateTime),
      outTime: formattedTime(endDateTime)
    };

    console.log("send data", data)
    try {
      // Fetch the token
      const Token = await fetchToken();

      // Check if a valid token is available
      if (Token) {
        const response = await api.user_map_pdate(Token, data);
        // console.log("here map response", response);
      }
    } catch (error) {
      console.log("maps Error:", error);
    }
  };


  const formattedTime = time => {
    if (!time) {
      return '0:00'; // or any default value you prefer
    } else {
      return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };


  const formattedDateforview = dateTime => {
    if (!dateTime) {
      return 'N/A'; // or any default value you prefer
    } else {
      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
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



  return (
    <>
      <Header
        title={'Report'}
        bg={'blue'}
        leftIcon={'arrowleft'}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
{/* 
        <View style={{ alignItems: "flex-end", marginTop: 20, marginBottom: "20%" }}>
          <TouchableOpacity
            onPress={()=>navigation.navigate("Add School")}
          >
            <Text style={styles.addSchoolbnt}>Add School</Text>
          </TouchableOpacity>

          <TouchableOpacity
          style={{marginTop:10}}
            onPress={()=>navigation.navigate("Order Place")}
          >
            <Text style={styles.addSchoolbnt}>Order Place</Text>
          </TouchableOpacity>
        </View> */}
       

        <View style={{ alignItems: "center" }}>
          {startDateTime ? (
            <Text style={styles.text}>Punch In: {formattedDateforview(startDateTime)}  : {formattedTime(startDateTime)} </Text>
          ) : ''}

          {endDateTime ? (
            <Text style={styles.text}>Punch out: {formattedDateforview(endDateTime)}  : {formattedTime(endDateTime)} </Text>
          ) : ''}

          {elapsedTime ? (
            <Text style={styles.text}>
              Time {formatElapsedTime(elapsedTime)}
            </Text>
          ) : ""}


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
          onPress={()=>navigation.navigate("ReportSubmit")}
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

        </View>


      </View>
      {
        isLoading ? (
          <Loader Loading={isLoading} />
        ) : null
      }

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
    fontSize: 18, color: "white", backgroundColor: "blue", paddingVertical: 15, paddingHorizontal: 10, marginHorizontal: 10, borderRadius: 10
  }
});
