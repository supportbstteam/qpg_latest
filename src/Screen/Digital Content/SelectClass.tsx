import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import DataList from '../../Component/DigitalContent/DataList';

import Header from '../../Component/Common_Component/Header';
import api from '../../API/api';
import { fetchToken } from '../../Helpers/fetchDetails';

const SelectClass = (props) => {
  const [classes, setClasses] = useState(undefined);

  useEffect(() => {
    const getClasses = async () => {
      try {
      const token= await fetchToken()
  
        if(token){
            let response = await api.class(token);
            console.log(response.data)
            setClasses(response.data);
        }
     
      } catch (error) {
        console.log(error);
      }
    };
    getClasses();
  }, []);

  return (
    <>
      <Header
        title={'Classes'}
        bg={'blue'}
        leftIcon={'arrowleft'}
        onLeftPress={() => props.navigation.goBack()}
      />
      <View style={{flex: 1}}>
        <DataList
          iconName={'class'}
          data={classes}
          screenName={'SelectSubject'}
          label={'ClassName'}
        />
      </View>
    </>
  );
};

export default SelectClass;
