import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import Header from '../../Component/Common_Component/Header'
import Icon from 'react-native-vector-icons/Entypo';
import styles from './styles';

import { useDispatch, useSelector } from 'react-redux';
import { setTotalItemCount } from '../../Reducer/slices/OrderSlice';
import { getTotalItemCount } from '../../Reducer/slices/SaveOrderHistory';

const Dashboard = (props) => {
  const dispatch = useDispatch();



  const userData = useSelector((state: any) => state.user.userData)
  const userRole = userData ? userData.role_id : 0;
  useEffect(() => {
    const fetchTotalItemCount = async () => {
      const existingTotalItemCount = await getTotalItemCount();
      dispatch(setTotalItemCount(existingTotalItemCount));
    };

    fetchTotalItemCount();
  }, [dispatch]);
  return (
    <>
      {userRole !== 3 && userRole !== 4 ? (
        <Header
          bg={'blue'}
          title={'Dashboard'}
          leftIcon={'menu-unfold'}
          ViewCardItem={() => props.navigation.navigate("ViewOrder")}
          onLeftPress={() => props.navigation.toggleDrawer()}
        />

      ) :
        <Header
          bg={'blue'}
          title={'Dashboard'}
          leftIcon={'menu-unfold'}

          onLeftPress={() => props.navigation.toggleDrawer()}
        />

      }

      <View style={{ flex: 1, alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => props.navigation.navigate('SelectClass')}>
          <Image
            source={require('../../assets/images/digital_content.png')}
            style={{
              width: 60, // Adjust the width as needed
              height: 60,// Adjust the height as needed


            }}
          />
          <View style={styles.line} />
          <Text style={styles.txt}>Digital Content</Text>
        </TouchableOpacity>

        {userRole !== 3 && userRole !== 4 ? (
          <TouchableOpacity
            style={styles.btn}
            onPress={() => props.navigation.navigate('PunchScreen')}>
            <Image
              source={require('../../assets/images/digital_content.png')}
              style={{
                width: 60,
                height: 60,
              }}
            />
            <View style={styles.line} />
            <Text style={styles.txt}>Report</Text>
          </TouchableOpacity>
        ) : null}


      </View>
    </>
  )
}

export default Dashboard