import { View, Text, StyleSheet, Pressable } from 'react-native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectOrderById } from '../../Reducer/slices/ConfirmOrderHistory';
import Header from '../../Component/Common_Component/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { FlatList } from 'react-native';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';
import { Image } from 'react-native';
import ImageView from 'react-native-image-viewing';
import { ScrollView } from 'react-native';

const ViewConfirmOrder: React.FC<{ navigation: any, route: any }> = ({ route, navigation }) => {
  const { orderId, item } = route.params;
  const [imgVisible, setImgVisible] = React.useState(false);
  const filterDatastate = useSelector(state => selectOrderById(state, orderId));
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  const Img_Base_Url = 'https://bwptestpapers.com/';
  // Function to calculate subtotal
  const calculateSubtotal = (
    mrp: [],
    quantity: string,
    discount: string,
    additionalDiscount: string,
    donation: string,
  ) => {
    if (mrp && mrp.mrp && quantity) {
      const parsedQuantity = quantity;
      const parsedBaseDiscount = parseInt(discount) || 0;
      const parsedAdditionDiscont = parseInt(additionalDiscount) || 0;
      const parsedDonation = parseInt(donation) || 0;

      const parsedDiscount = parsedBaseDiscount + parsedAdditionDiscont + parsedDonation;
      // Calculate the subtotal without any discounts
      const calculatedSubtotal = mrp ? mrp.mrp : 0;

      // Calculate the discounted price after applying base discount
      const finalDiscountedPrice =
        calculatedSubtotal * (1 - parsedDiscount / 100);

      const TotalPrice = finalDiscountedPrice * parsedQuantity;
      const subtotal = TotalPrice;

      return subtotal.toFixed(2);
    } else {
      return 'N/A';
    }
  };

  const filterData = orderId === null ? item : filterDatastate
  // useEffect(() => {
  //   console.log('here reducers dara', filterData);
  // }, []);

  const openImage = (imageUrl: string) => {
    const url = Img_Base_Url + imageUrl;
    setSelectedImage(url);
    setImgVisible(true);
  };

  return (
    <>
      <Header
        title={'View History'}
        bg={'blue'}
        leftIcon={'arrow-back'}
        DashboardProps={() => {
          navigation.navigate('Dashboard');
        }}
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={{ flex: 1, marginBottom: 20, backgroundColor: 'white' }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: 20,
            marginTop: 10,
          }}>
          <Text
            style={{
              fontSize: responsiveFontSize(2.2),
              color: 'green',
              fontWeight: 'bold',
            }}>
            Total Amount: ₹{filterData ? filterData.total_amount : ''}
          </Text>
        </View>

        <CustomTextInput
          title="Transport Name"
          value={filterData ? filterData.transport_name : ''}
          editable={false}
        />

        <CustomTextInput
          title="Transport Address"
          value={filterData ? filterData.transport_address : ''}
          editable={false}
        />

        {filterData.gr_bill && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginVertical: responsiveScreenHeight(1),
              marginHorizontal: responsiveScreenWidth(5),
            }}>
            {/* label */}
            <Text style={styles.label}>GR Bill :</Text>
            {/* value */}
            <Pressable onPress={() => openImage(filterData.gr_bill)}>
              <Image
                style={styles.image}
                source={{
                  uri: Img_Base_Url + filterData.gr_bill,
                }}
              />
            </Pressable>
          </View>
        )}

        {filterData.other_bill && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginVertical: responsiveScreenHeight(1),
              marginHorizontal: responsiveScreenWidth(5),
            }}>
            {/* label */}
            <Text style={styles.label}>Other Bill :</Text>
            {/* value */}
            <Pressable onPress={() => openImage(filterData.other_bill)}>
              <Image
                style={styles.image}
                source={{
                  uri: Img_Base_Url + filterData.other_bill,
                }}
              />
            </Pressable>
          </View>
        )}

        <FlatList
          data={filterData ? filterData.details : []}
          renderItem={({ item, index }) => (
            <>
              <View style={styles.CardContainer}>
                <View style={styles.table}>
                  {/* here school name */}
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                          fontWeight: 'bold',
                        }}>
                        School Name:{' '}
                      </Text>
                    </View>
                    <View style={[styles.cell, { alignItems: 'flex-start' }]}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                        }}>
                        {item.school ? item.school : 'No School Name'}
                      </Text>
                    </View>
                  </View>

                  {/* here Class name */}
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                          fontWeight: 'bold',
                        }}>
                        Class Name:{' '}
                      </Text>
                    </View>
                    <View style={[styles.cell, { alignItems: 'flex-start' }]}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                        }}>
                        {item.class ? item.class : 'No Class Name'}
                      </Text>
                    </View>
                  </View>

                  {/* here Subject name */}
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                          fontWeight: 'bold',
                        }}>
                        Subject Name:{' '}
                      </Text>
                    </View>
                    <View style={[styles.cell, { alignItems: 'flex-start' }]}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                        }}>
                        {item.subject ? item.subject : 'No Subject Name'}
                      </Text>
                    </View>
                  </View>

                  {/* here price */}
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                          fontWeight: 'bold',
                        }}>
                        Actual Price (₹):{' '}
                      </Text>
                    </View>
                    <View style={[styles.cell, { alignItems: 'flex-start' }]}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                        }}>
                        ₹{item.mrp ? item.mrp : 'No Price'}
                      </Text>
                    </View>
                  </View>

                  {/* here Quantity */}
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                          fontWeight: 'bold',
                        }}>
                        Quantity:{' '}
                      </Text>
                    </View>
                    <View style={[styles.cell, { alignItems: 'flex-start' }]}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                        }}>
                        {item.quantity ? item.quantity : 'No Price'}
                      </Text>
                    </View>
                  </View>

                  {/* Discout value */}

                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                          fontWeight: 'bold',
                        }}>
                        Discount (%):{' '}
                      </Text>
                    </View>
                    <View style={[styles.cell, { alignItems: 'flex-start' }]}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                        }}>
                        {item.discount ? item.discount : 0} %
                      </Text>
                    </View>
                  </View>

                  {/*Additional Discout value */}

                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                          fontWeight: 'bold',
                        }}>
                        Additional Discount (%):{' '}
                      </Text>
                    </View>
                    <View style={[styles.cell, { alignItems: 'flex-start' }]}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                        }}>
                        {item.additional_disc ? item.additional_disc : 0} %
                      </Text>
                    </View>
                  </View>

                  {/* Donation value */}
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                          fontWeight: 'bold',
                        }}>
                        Donation (%):{' '}
                      </Text>
                    </View>
                    <View style={[styles.cell, { alignItems: 'flex-start' }]}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                        }}>
                        {item.donation ? item.donation : 0}
                        {'%'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                          fontWeight: 'bold',
                        }}>
                        Donation Name :{' '}
                      </Text>
                    </View>
                    <View style={[styles.cell, { alignItems: 'flex-start' }]}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                        }}>
                        {item.donation_name ? item.donation_name : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                          fontWeight: 'bold',
                        }}>
                        Donation Number :{' '}
                      </Text>
                    </View>
                    <View style={[styles.cell, { alignItems: 'flex-start' }]}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                        }}>
                        {item.donation_number ? item.donation_number : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  {/* Subtotal */}
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                          fontWeight: 'bold',
                        }}>
                        SubTotal (₹):{' '}
                      </Text>
                    </View>
                    <View style={[styles.cell, { alignItems: 'flex-start' }]}>
                      <Text
                        numberOfLines={1}
                        style={{
                          color: '#787a7c',
                          fontSize: responsiveFontSize(2),
                        }}>
                        ₹
                        {calculateSubtotal(
                          item,
                          item.quantity,
                          item.discount,
                          item.additional_disc,
                          item.donation,
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          )}
        />
      </ScrollView>
      <ImageView
        images={[{ uri: selectedImage }]}
        imageIndex={0}
        visible={imgVisible}
        onRequestClose={() => setImgVisible(false)}
      />
    </>
  );
};

export default ViewConfirmOrder;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
  },

  CardContainer: {
    width: responsiveWidth(95),

    marginVertical: responsiveHeight(1),
    marginHorizontal: responsiveHeight(1.5),
    backgroundColor: 'white',
    borderRadius: responsiveHeight(1.5),
    padding: responsiveHeight(2.2),
    elevation: responsiveHeight(0.2),
  },
  table: {
    // borderWidth: 0.4,
    borderColor: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    // borderWidth: 0.5,
    borderColor: '#000',
    // padding: 8,
    marginBottom: 15,
  },
  plus_minusContainer: {
    backgroundColor: 'blue',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginHorizontal: 10,
  },
  loginBtn: {
    width: responsiveWidth(92),
    backgroundColor: '#4D2DB7',
    borderRadius: responsiveHeight(1),
    height: responsiveHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: responsiveHeight(5),
    marginBottom: responsiveHeight(1.4),
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
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
});
