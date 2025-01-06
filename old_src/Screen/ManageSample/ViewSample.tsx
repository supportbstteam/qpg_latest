import React, {useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import api from '../../API/api';
import {fetchToken} from '../../Helpers/fetchDetails';
import Header from '../../Component/Common_Component/Header';
import {ScrollView} from 'react-native';
import {RefreshControl} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const ViewSample: React.FC<{navigation: any}> = ({navigation}) => {
  const [list, setList] = React.useState<any>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (list.length === 0) {
      console.log('here sample details');
      fetchReportDetails();
    }
  }, []);

  const fetchReportDetails = async () => {
    setLoading(true);
    try {
      const token = await fetchToken();
      if (token) {
        const response = await api.getSample(token);
        
        // if (response.data.status ) {
          
          setList(response.data.data);
          
        // }
      }
    } catch (error) {
      console.log('error in report details', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchReportDetails();
    } finally {
      setRefreshing(false);
    }
  };

  const DetailItem: React.FC<{label: string; value: string}> = ({
    label,
    value,
  }) => (
    <View style={styles.items}>
      <Text style={styles.label}>{label} :</Text>
      <Text style={styles.value} textBreakStrategy={'highQuality'}>
        {value}
      </Text>
    </View>
  );

  return (
    <>
      <Header
        title={'View Samples'}
        bg={'blue'}
        leftIcon={'arrow-back'}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
     

        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: responsiveHeight(40),
            }}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : (
          <View style={{flex: 1, marginTop: 10}}>
            {list?.map((item: any, index: any) => (
              <View key={index} style={styles.card}>
                <DetailItem label="Class Name" value={item?.class?.ClassName} />
                <DetailItem
                  label="Subject Name"
                  value={item?.subject?.SubjectName}
                />
                <DetailItem label="Quantity" value={item?.qty} />
                <DetailItem label='Status' value={item?.status===0?'Inactive':'Active'} />
                <DetailItem label="Date" value={item?.date} />
              </View>
            ))}
          </View>
        )}
        {list.length === 0 && !loading && (
          <View style={styles.emptyView}>
            <Text
              style={{
                fontSize: responsiveFontSize(2),
                color: 'black',
                fontWeight: 'bold',
              }}>
              No Samples Found
            </Text>
          </View>
        )}
      </ScrollView>
    
    </>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: responsiveWidth(5),
    backgroundColor: 'white',
    borderRadius: 10,
    padding: responsiveHeight(2),
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  titleText: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'black',
  },
  schoolSelector: {
    //add any styles if needed
  },
  card: {
    marginHorizontal: responsiveWidth(5),
    marginVertical: responsiveHeight(1),
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    padding: responsiveHeight(2),
    borderWidth:3,
  },
  items: {
    flexDirection: 'row',
    // justifyContent:"space-between"
    marginVertical: responsiveHeight(0.5),
  },
  label: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'black',
    minWidth: responsiveScreenWidth(35),
    opacity: 0.6,
  },
  value: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    color: 'black',
    maxWidth: responsiveScreenWidth(50),
    lineHeight: 22,
    // textAlign: 'justify',
    // android_hyphenationFrequency : 'normal'
  },
  heading: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    color: 'black',
    alignSelf: 'flex-start',
    marginLeft: responsiveWidth(5),
  },
  searchBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveHeight(1.2),
    minHeight: responsiveHeight(4),
    marginHorizontal: responsiveWidth(3),
    marginTop: responsiveHeight(2),
  },
  searchInput: {
    flex: 1,
    height: responsiveHeight(5),
    borderColor: 'gray',
    borderWidth: 1,
    // paddingHorizontal: 10,
    minHeight: responsiveHeight(5),
    maxHeight: responsiveHeight(5),
    color: 'black',
    fontSize: responsiveFontSize(1.9),
    borderRadius: 5,
    paddingLeft: responsiveWidth(9),
    paddingVertical: 0,
    backgroundColor: 'white',
  },
  searchIcon: {
    position: 'absolute',
    left: responsiveWidth(5),
    top: responsiveHeight(1.5),
  },
  emptyView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(35),
  },
});

export default ViewSample;
