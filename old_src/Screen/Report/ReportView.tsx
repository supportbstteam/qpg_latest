import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Header from '../../Component/Common_Component/Header';
import {useRoute} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Image} from 'react-native';
import ImageView from 'react-native-image-viewing';

const ReportView: React.FC<{navigation: any}> = ({navigation}) => {
  const [imgVisible, setImgVisible] = React.useState(false);

  const route = useRoute();
  const {data} = route.params;
  console.log('data', data);

  const images = [{uri: 'https://bwptestpapers.com/' + data.reimbursement}];

  const RenderList = (label: any, value: any) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginVertical: responsiveScreenHeight(1),
        }}>
        <Text style={styles.label}>{label} :</Text>
        <Text style={styles.value} textBreakStrategy={'highQuality'}>
          {value}
        </Text>
      </View>
    );
  };

  const formateDate = (inputDate: any) => {
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Header
        title={'View Report'}
        bg={'blue'}
        leftIcon={'arrow-back'}
        onLeftPress={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.card}>
          {RenderList('School Name', data.school_name)}
          {RenderList('School Board', data.board)}
          {RenderList('Strength', data.strength)}
          {RenderList('School Code', data.code)}
          {RenderList('Address', data.address)}
          {RenderList('Pincode', data.pincode)}
          {/* {RenderList('reimbursement', data.reimbursement)}   need to work on this to show user img preview    */}
          {RenderList('Hotel Bill', data.h_bill)}
          {RenderList('GR Bill', data.gr_bill)}
          {RenderList('Other Bill', data.other_bill)}
          {RenderList('Vehicle Type', data.vehicle_type)}
          {RenderList('Remark', data.remark)}
          {RenderList('Date', formateDate(data.created_at))}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginVertical: responsiveScreenHeight(1),
            }}>
            <Text style={styles.label}>Reimbursment :</Text>
            <Pressable onPress={() => setImgVisible(true)}>
              <Image
                style={styles.image}
                source={{
                  uri: 'https://bwptestpapers.com/' + data.reimbursement,
                }}
              />
            </Pressable>
          </View>
          
          {/* show list of teacher details with name and contact  */}

          {/* Concern Person Details */}
          <View style={styles.cardSection}>
            <Text style={styles.cardHeader}>Concern Person Details</Text>

            <View style={styles.card2}>
              {data?.concerns.map((item: any, index: number) => (
                <View key={index} style={styles.concernItem}>
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Name:</Text>
                    <Text style={styles.fieldValue}>{item.name}</Text>
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Designation:</Text>
                    <Text style={styles.fieldValue}>{item.designation}</Text>
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Number:</Text>
                    <Text style={styles.fieldValue}>{item.number}</Text>
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Email:</Text>
                    <Text style={styles.fieldValue}>{item.email}</Text>
                  </View>
                  {<View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>

          {/* Teacher Details */}
          <View style={styles.cardSection}>
            <Text style={styles.cardHeader}>Teacher Details</Text>

            <View style={styles.card2}>
              {data?.teachers.map((item: any, index: number) => (
                <View key={index} style={styles.concernItem}>
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Name:</Text>
                    <Text style={styles.fieldValue}>{item.name}</Text>
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Designation:</Text>
                    <Text style={styles.fieldValue}>{item.designation}</Text>
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Subject:</Text>
                    <Text style={styles.fieldValue}>{item.subject}</Text>
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Email:</Text>
                    <Text style={styles.fieldValue}>{item.email}</Text>
                  </View>

                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Address:</Text>
                    <Text style={styles.fieldValue}>{item.address}</Text>
                  </View>
                  <View style={styles.field}>
                    <Text style={styles.fieldLabel}>Contact:</Text>
                    <Text style={styles.fieldValue}>{item.contact}</Text>
                  </View>
                  {<View style={styles.separator} />}
                </View>
              ))}
            </View>
          </View>

        </View>
      </ScrollView>
      <ImageView
        images={images}
        imageIndex={0}
        visible={imgVisible}
        onRequestClose={() => setImgVisible(false)}
      />
    </>
  );
};

export default ReportView;

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: 'grey',
    minWidth: responsiveScreenWidth(40),
    fontWeight: 'bold',
  },
  value: {
    fontSize: responsiveFontSize(1.8),
    color: 'black',
    maxWidth: responsiveScreenWidth(50),
    lineHeight: 22,
    fontWeight: 'bold',
  },
  image: {
    width: 50,
    height: 50,
  },
  card2: {
    backgroundColor: 'white',
    padding: responsiveHeight(1.5),
    // marginBottom: responsiveHeight(1),
    borderRadius: responsiveHeight(1),
    // elevation: 2,
    width: responsiveWidth(95),
    alignSelf: 'center',
  },
  cardSection: {
    // marginTop: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(1),
  },
  cardHeader: {
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    marginBottom: responsiveHeight(1),
    color: 'black',
  },
  concernItem: {
    marginBottom: responsiveHeight(1),
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    width: responsiveWidth(30),
    marginRight: responsiveWidth(2),
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
    color: 'black',
  },
  fieldValue: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    color: 'black',
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: responsiveHeight(1),
  },
});
