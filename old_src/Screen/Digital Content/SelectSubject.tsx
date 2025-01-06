import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
// import {Subjects} from '../data/DigitalAssets';
import DataList from '../../Component/DigitalContent/DataList';
import Header from '../../Component/Common_Component/Header';
import { fetchToken } from '../../Helpers/fetchDetails';
import api from '../../API/api';


const SelectSubject = ({ route, navigation }) => {
  const [subjects, setSubjects] = useState(undefined);
  const ClassID = route.params.classId;

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const token = await fetchToken()
        if(token){
            let response = await api.subject(token,ClassID);
            setSubjects(response.data);
        }
   
      } catch (error) {
        console.log(error);
      }
    };
    getSubjects();
  }, [ClassID]);

  return (
    <>
      <Header
        bg={'blue'}
        title={'Subjects'}
        leftIcon={'arrow-back'}
        DashboardProps={()=>{navigation.navigate("Dashboard")}}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={{flex: 1}}>
        <DataList
          iconName={'subject'}
          data={subjects}
          screenName={'DigitalContent'}
        />
      </View>
    </>
  );
};

export default SelectSubject;
