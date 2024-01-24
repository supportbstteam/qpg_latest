import {View, Text} from 'react-native';
import React, { useEffect } from 'react';
import Pdf from 'react-native-pdf';
import Loader from '../../Component/Common_Component/Loader';
import Header from '../../Component/Common_Component/Header';

const ViewBook = ({route,navigation}) => {
  const path = route.params.path;
  const screen = route.params.screen;

  return (
   <>
 <Header
        bg={'blue'}
        title={'Pdf View'}
        leftIcon={'arrowleft'}
        onLeftPress={() => navigation.goBack()}
      />
      <Pdf
      enablePaging={true} horizontal={true} 
        trustAllCerts={false}
        source={{uri: `https://bwptestpapers.com/public/${screen}/${path}`}}
        // source={{uri: `https://www.pdf995.com/samples/pdf.pdf`}}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        
        style={{flex: 1}}
        onLoadProgress={() => <Loader Loading={true}/>}
      />
   </>
  );
};

export default ViewBook;
