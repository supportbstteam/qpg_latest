import {View, Text, ActivityIndicator} from 'react-native';
import React, {useEffect} from 'react';
import Pdf from 'react-native-pdf';
import Loader from '../../Component/Common_Component/Loader';
import Header from '../../Component/Common_Component/Header';

const ViewBook: React.FC<{route: any; navigation: any}> = ({
  route,
  navigation,
}) => {
  const path = route.params.path;
  const screen = route.params.screen;
  const [loading, setLoading] = React.useState<boolean>(true);
  return (
    <>
      <Header
        bg={'blue'}
        title={'Pdf View'}
        leftIcon={'arrow-back'}
        onLeftPress={() => navigation.goBack()}
      />
      <Pdf
        enablePaging={true}
        horizontal={true}
        trustAllCerts={false}
        source={{uri: `https://bwptestpapers.com/public/${screen}/${path}`}}
        // source={{uri: `https://www.pdf995.com/samples/pdf.pdf`}}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
          setLoading(false);
        }}
        onError={error => {
          console.log(error);
          setLoading(false);
        }}
        style={{flex: 1}}
        renderActivityIndicator={() => {
          return <ActivityIndicator size="large" color="blue" />;
        }}
      />
    </>
  );
};

export default ViewBook;
