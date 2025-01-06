import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {
  clearHistory,
  deleteHistory,
  getHistory,
  saveHistory,
} from '../../Reducer/slices/SaveOrderHistory';
import Header from '../../Component/Common_Component/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {fetccUserId, fetchToken} from '../../Helpers/fetchDetails';
import api from '../../API/api';
import Loader from '../../Component/Common_Component/Loader';
import {
  decrementTotalItemCount,
  setTotalItemCount,
} from '../../Reducer/slices/OrderSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomTextInput from '../../Component/Common_Component/CustomTextInput';
import ImageSelectionModal from '../Report/Reimbursment';
import CutomWarning from '../../Component/Common_Component/CutomWarning';

const ViewOrder = ({navigation}) => {
  const [BookHistory, SetBookHistory] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>('');
  const [WarmodalVisible, setWarmodalVisible] = React.useState<boolean>(false);
  const [data, setData] = React.useState({
    transportName: '',
    transportAddress: '',
  });
  const [modal, SetModal] = React.useState<string>('');
  const [gr, setGR] = React.useState([]);
  const [otherBill, setOtherBill] = React.useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    getBookHistory();
  }, []);

  const getBookHistory = async () => {
    const HistoryData = await getHistory();
    console.log(HistoryData);
    SetBookHistory(HistoryData);
  };

  const handleDeleteBook = async (ClassId, SchoolId, SubjectId) => {
    try {
      // Delete the item from AsyncStorage
      await deleteHistory(ClassId, SchoolId, SubjectId);
      getBookHistory();
      Toast.show({
        type: 'success',
        text1: 'Record Delete Successfully',
        autoHide: false,
        visibilityTime: 1000,
        onShow: () => {
          setTimeout(() => {
            Toast.hide();

            dispatch(decrementTotalItemCount());
          }, 1000);
        },
      });
    } catch (error) {
      console.error('Error handling book deletion:', error);
    }
  };

  const showDeleteConfirmation = item => {
    Alert.alert(
      'Delete',
      'Are you sure want to delete this item?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            handleDeleteBook(
              item.ClassItem.value,
              item.SchoolItem.value,
              item.SubjecItem.value,
            ),
        },
      ],
      {cancelable: false},
    );
  };

  const handleIncreament = async item => {
    const updatedItem = {...item};
    updatedItem.quantity = parseInt(updatedItem.quantity) + 1;

    try {
      await saveHistory(updatedItem);
      getBookHistory();

      Toast.show({
        type: 'success',
        text1: 'Book Quantity Updated Successfully',
        autoHide: false,
        visibilityTime: 1000,
        onShow: () => {
          setTimeout(() => {
            Toast.hide();
          }, 1000);
        },
      });
    } catch (error) {
      console.log('increament value error:', error);
    }

    console.log(updatedItem);
  };

  const handleDecremant = async item => {
    const updatedItem = {...item};

    updatedItem.quantity = parseInt(updatedItem.quantity) - 1;

    try {
      await saveHistory(updatedItem);
      getBookHistory();

      Toast.show({
        type: 'success',
        text1: 'Book Quantity Updated Successfully',
        autoHide: false,
        visibilityTime: 1000,
        onShow: () => {
          setTimeout(() => {
            Toast.hide();
          }, 1000);
        },
      });
    } catch (error) {
      console.log('increament value error:', error);
    }

    console.log(updatedItem);
  };

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

      const parsedDiscount = parsedBaseDiscount + parsedAdditionDiscont+parsedDonation;
      // Calculate the subtotal without any discounts
      const calculatedSubtotal = mrp ? mrp.mrp : 0;

      // Calculate the discounted price after applying base discount
      const finalDiscountedPrice =
        calculatedSubtotal * (1 - parsedDiscount / 100);

      // Calculate the discounted price after applying additional discount to the discounted price
      // const finalDiscountedPrice =
      // discountedPrice * (1 - parsedAdditionDiscont / 100);

      // Calculate the final total price after subtracting any donation
      const TotalPrice = finalDiscountedPrice * parsedQuantity;
      const subtotal = TotalPrice;

      return subtotal.toFixed(2);
    } else {
      return 'N/A';
    }
  };

  // Calculate total MRP
  const calculateTotalMRP = () => {
    let totalMRP = 0;

    // Iterate through the array and sum up the individual subtotal values
    BookHistory.forEach(item => {
      if (item.mrp && item.mrp.mrp && item.quantity) {
        const parsedQuantity = item.quantity;
        const parsedBaseDiscount = parseInt(item.discount) || 0;
        const parsedAdditionDiscont = parseInt(item.additonaldisc) || 0;
        const parsedDonation = parseInt(item.donation) || 0;

        const parsedDiscount = parsedBaseDiscount + parsedAdditionDiscont+parsedDonation;
        // Calculate the subtotal without any discounts
        const calculatedSubtotal = item.mrp ? item.mrp.mrp : 0;

        // Calculate the discounted price after applying base discount
        const finalDiscountedPrice =
          calculatedSubtotal * (1 - parsedDiscount / 100);

        // Calculate the discounted price after applying additional discount to the discounted price
        // const finalDiscountedPrice =
        // discountedPrice * (1 - parsedAdditionDiscont / 100);

        // Calculate the final total price after subtracting any donation
        const TotalPrice = finalDiscountedPrice * parsedQuantity;
        const subtotal = TotalPrice ;

        totalMRP += parseFloat(subtotal);
      }
    });

    // console.log(totalMRP);
    return totalMRP.toFixed(2);
  };

  // Call calculateTotalMRP to get the total MRP value
  const totalMRP = calculateTotalMRP();

  const handleReportSubmit = async () => {

    if (data.transportName === '') {
      setModalMessage('Transport Name is required');
      setWarmodalVisible(true);
      return;
  }


  if (data.transportAddress === '') {
    setModalMessage('Transport Address is required');
    setWarmodalVisible(true);
    return;
}

    const userId = await fetccUserId();
    const token = await fetchToken();
    if (userId && token) {
      setIsLoading(true);
      const BookData =  new FormData();
      BookData.append('userId',parseInt(userId))
      BookData.append('BookHistory',JSON.stringify(BookHistory));
      BookData.append('totalMRP',parseInt(totalMRP));
      BookData.append('transport_name',data.transportName);
      BookData.append('transport_address',data.transportAddress);
      if(gr.length>0){
        BookData.append('gr_bill', {
          uri: gr[0],
          type: 'image/jpeg',
          name: 'gr.jpg',
        });
      }

      if(otherBill.length>0){
        BookData.append('other_bill', {
          uri: otherBill[0],
          type: 'image/jpeg',
          name: 'bill.jpg',
        });
      }

      // const BookData = {
        // userId: parseInt(userId),
        // BookHistory: BookHistory,
        // totalMRP: parseInt(totalMRP),
      // };

      // console.log("book history ",BookData)
      try {
        const response = await api.store_order(token, BookData);

        if (response.data.status === true) {
          Toast.show({
            type: 'success',
            text1: response.data.message,
            autoHide: false,
            visibilityTime: 1000,
            onShow: () => {
              setTimeout(() => {
                Toast.hide();

                setIsLoading(false);
                setData({
                  transportAddress:'',
                  transportName:''
                });
                setGR([]);
                setOtherBill([]);
                clearHistory();
                getBookHistory();
                dispatch(setTotalItemCount(0));
              }, 1000); // Wait for 1 second before navigating
            },
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.log('report confirm error:', error);
      }
    }
  };


  const closeModal = () => {
    setWarmodalVisible(false);
};

  return (
    <>
      <View style={styles.Container}>
        <Header
          title={'Order Details'}
          bg={'blue'}
          leftIcon={'arrow-back'}
          onLeftPress={() => navigation.goBack()}
        />

        <View style={styles.mainContainer}>
          <ScrollView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginHorizontal: 20,
                marginTop: 10,
              }}>
              {calculateTotalMRP() > 0 ? (
                <>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.2),
                      color: 'green',
                      fontWeight: 'bold',
                    }}>
                    Total Amount:{' '}
                  </Text>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.2),
                      color: 'green',
                      fontWeight: 'bold',
                    }}>
                    ₹{calculateTotalMRP()}
                  </Text>
                </>
              ) : (
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.2),
                    color: 'red',
                    fontWeight: 'bold',
                  }}>
                  No Order Details
                </Text>
              )}
            </View>
            
            {/* new changes of the transport name , address and attachment */}
            {BookHistory.length>0 && (<>
              <CustomTextInput
                placeholder="Enter Transport Name"
                value={data.transportName}
                onChangeText={transportName =>
                  setData({...data, transportName})
                }
                title="Transport Name"
              />

              <CustomTextInput
                placeholder="Transport Address"
                value={data.transportAddress}
                onChangeText={transportAddress =>
                  setData({...data, transportAddress})
                }
                title="Transport Address"
              />

              {/* make two button for attachment attach Gr and Attach other bill */}
              <View style={styles.attachButton}>
                <TouchableOpacity
                  style={styles.attachStyle}
                  onPress={() => SetModal('gr')}>
                  <Text style={styles.attachText}>Attach GR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.attachStyle}
                  onPress={() => SetModal('otherBill')}>
                  <Text style={styles.attachText}>Attach Other Bill</Text>
                </TouchableOpacity>
              </View>
            </>)}

            <FlatList
              data={BookHistory}
              renderItem={({item, index}) => (
                <>
                  <View style={styles.CardContainer}>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      <TouchableOpacity
                        onPress={() => showDeleteConfirmation(item)}>
                        {/* <Text style={{ flex: 1, justifyContent: "flex-end", color: "red", fontSize: 17 }}>Delete</Text> */}
                        <Icon name="delete" size={25} color="red" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.table}>
                      {/* here school name */}
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                              fontWeight: 'bold',
                            }}>
                            School Name :{' '}
                          </Text>
                        </View>
                        <View style={[styles.cell, {alignItems: 'flex-start'}]}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                            }}>
                            {item.SchoolItem
                              ? item.SchoolItem.label
                              : 'No School Name'}
                          </Text>
                        </View>
                      </View>

                      {/* here Class name */}
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                              fontWeight: 'bold',
                            }}>
                            Class Name :{' '}
                          </Text>
                        </View>
                        <View style={[styles.cell, {alignItems: 'flex-start'}]}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                            }}>
                            {item.ClassItem
                              ? item.ClassItem.label
                              : 'No Class Name'}
                          </Text>
                        </View>
                      </View>

                      {/* here Subject name */}
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                              fontWeight: 'bold',
                            }}>
                            Subject Name :{' '}
                          </Text>
                        </View>
                        <View style={[styles.cell, {alignItems: 'flex-start'}]}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.8),
                            }}
                            numberOfLines={2}>
                            {item.SubjecItem
                              ? item.SubjecItem.label
                              : 'No Subject Name'}
                          </Text>
                        </View>
                      </View>

                      {/* here price */}
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                              fontWeight: 'bold',
                            }}>
                            Actual Price (₹) :{' '}
                          </Text>
                        </View>
                        <View style={[styles.cell, {alignItems: 'flex-start'}]}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                            }}>
                            ₹{item.mrp ? item.mrp.mrp : 'No Price'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                              fontWeight: 'bold',
                            }}>
                            Quantity :{' '}
                          </Text>
                        </View>
                        <View style={[styles.cell, {alignItems: 'flex-start'}]}>
                          <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                              style={[
                                styles.plus_minusContainer,
                                {marginRight: '5%'},
                              ]}
                              onPress={() => {
                                if (item.quantity > 1) {
                                  handleDecremant(item);
                                }
                              }}>
                              <Entypo name="minus" size={15} color={'white'} />
                            </TouchableOpacity>
                            <Text
                              style={{
                                color: '#787a7c',
                                fontSize: responsiveFontSize(1.9),
                                color: 'black',
                              }}>
                              {' '}
                              {item.quantity}{' '}
                            </Text>

                            <TouchableOpacity
                              style={[
                                styles.plus_minusContainer,
                                {marginLeft: '5%'},
                              ]}
                              onPress={() => {
                                handleIncreament(item);
                              }}>
                              <Entypo name="plus" size={15} color={'white'} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      {/*Base Discout value */}

                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                              fontWeight: 'bold',
                            }}>
                            Base Discount (%) :{' '}
                          </Text>
                        </View>
                        <View style={[styles.cell, {alignItems: 'flex-start'}]}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                            }}>
                            {item.discount ? item.discount : 0}%
                          </Text>
                        </View>
                      </View>

                      {/*Additional Discout value */}

                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                              fontWeight: 'bold',
                              maxWidth: responsiveWidth(42),
                            }}>
                            Additonal Discount (%) :{' '}
                          </Text>
                        </View>
                        <View style={[styles.cell, {alignItems: 'flex-start'}]}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                            }}>
                            {item.additonaldisc ? item.additonaldisc : 0}%
                          </Text>
                        </View>
                      </View>

                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                              fontWeight: 'bold',
                            }}>
                            Donation (%) :{' '}
                          </Text>
                        </View>
                        <View style={[styles.cell, {alignItems: 'flex-start'}]}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                            }}>
                            {item.donation ? item.donation : 0}%
                          </Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                              fontWeight: 'bold',
                            }}>
                            Donation Name  :{' '}
                          </Text>
                        </View>
                        <View style={[styles.cell, {alignItems: 'flex-start'}]}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
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
                              fontSize: responsiveFontSize(1.9),
                              fontWeight: 'bold',
                            }}>
                            Donation Number :{' '}
                          </Text>
                        </View>
                        <View style={[styles.cell, {alignItems: 'flex-start'}]}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
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
                              fontSize: responsiveFontSize(1.9),
                              fontWeight: 'bold',
                            }}>
                            SubTotal (₹) :{' '}
                          </Text>
                        </View>
                        <View style={[styles.cell, {alignItems: 'flex-start'}]}>
                          <Text
                            style={{
                              color: '#787a7c',
                              fontSize: responsiveFontSize(1.9),
                            }}>
                            ₹
                            {calculateSubtotal(
                              item.mrp,
                              item.quantity,
                              item.discount,
                              item.additonaldisc,
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
        </View>

        {BookHistory.length !== 0 ? (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              handleReportSubmit();
            }}>
            <Text style={{color: 'white', fontSize: responsiveFontSize(2)}}>
              Confirmed Order
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <CutomWarning
                visible={WarmodalVisible}
                message={modalMessage}
                closeModal={closeModal}
            />
      <ImageSelectionModal
        isVisible={modal === 'gr' || modal === 'otherBill'}
        onClose={() => SetModal('')}
        images={modal === 'gr' ? gr : otherBill}
        setImages={modal === 'gr' ? setGR : setOtherBill}
      />
      {isLoading ? <Loader Loading={isLoading} /> : null}
    </>
  );
};

export default ViewOrder;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mainContainer: {
    flex: 1,
  },

  CardContainer: {
    width: responsiveWidth(95),

    marginVertical: responsiveHeight(1.5),
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
    // alignSelf: 'flex-start'
  },
  cell: {
    // flex: 1,
    // borderWidth: 0.5,
    borderColor: '#000',
    padding: 8,
    minWidth: responsiveWidth(46),
    maxWidth: responsiveWidth(50),
  },
  plus_minusContainer: {
    backgroundColor: 'blue',
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    // marginHorizontal: 10,
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
  attachText: {
    color: 'white',
    textAlign: 'center',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  attachStyle: {
    backgroundColor: 'green',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    width: responsiveWidth(40),
    alignSelf: 'center',
  },
  attachButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: responsiveHeight(1),
    width: responsiveWidth(80),
    alignSelf: 'center',
  },
});
