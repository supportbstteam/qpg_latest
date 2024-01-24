import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearHistory, deleteHistory, getHistory, saveHistory } from '../../Reducer/slices/SaveOrderHistory';
import Header from '../../Component/Common_Component/Header';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Entypo from "react-native-vector-icons/Entypo"
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { fetccUserId, fetchToken } from '../../Helpers/fetchDetails';
import api from '../../API/api';
import Loader from '../../Component/Common_Component/Loader';
import { decrementTotalItemCount, setTotalItemCount } from '../../Reducer/slices/OrderSlice';

const ViewOrder = ({ navigation }) => {

  const [BookHistory, SetBookHistory] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const dispatch = useDispatch()
  useEffect(() => {

    getBookHistory()
  }, []);

  const getBookHistory = async () => {
    const HistoryData = await getHistory();
    console.log(HistoryData.length)
    SetBookHistory(HistoryData)

  }

  const handleDeleteBook = async (ClassId, SchoolId, SubjectId) => {

    try {
      // Delete the item from AsyncStorage
      await deleteHistory(ClassId, SchoolId, SubjectId);
      getBookHistory()
      Toast.show({
        type: "success",
        text1: "Record Delete Successfully",
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
      console.error("Error handling book deletion:", error);
    }

  }

  const showDeleteConfirmation = (item) => {
    Alert.alert(
      "Delete",
      "Are you sure want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => handleDeleteBook(item.ClassItem.value,
            item.SchoolItem.value,
            item.SubjecItem.value)
        },
      ],
      { cancelable: false }
    );
  };

  const handleIncreament = async (item) => {

    const updatedItem = { ...item };
    updatedItem.quantity = parseInt(updatedItem.quantity) + 1;

    try {

      await saveHistory(updatedItem)
      getBookHistory()

      Toast.show({
        type: "success",
        text1: "Book Quantity Updated Successfully",
        autoHide: false,
        visibilityTime: 1000,
        onShow: () => {
          setTimeout(() => {
            Toast.hide();

          }, 1000);
        },
      });
    } catch (error) {
      console.log("increament value error:", error)
    }

    console.log(updatedItem)

  }

  const handleDecremant = async (item) => {
    const updatedItem = { ...item };
  
    updatedItem.quantity = parseInt(updatedItem.quantity) - 1;

    try {

      await saveHistory(updatedItem)
      getBookHistory()

      Toast.show({
        type: "success",
        text1: "Book Quantity Updated Successfully",
        autoHide: false,
        visibilityTime: 1000,
        onShow: () => {
          setTimeout(() => {
            Toast.hide();

          }, 1000);
        },
      });
    } catch (error) {
      console.log("increament value error:", error)
    }

    console.log(updatedItem)

  }



  // Calculate total MRP
  const calculateTotalMRP = () => {
    let totalMRP = 0;

    // Iterate through the array and sum up the individual subtotal values
    BookHistory.forEach((item) => {
      if (item.mrp && item.mrp.mrp && item.quantity) {
        const subtotal = item.discount && parseFloat(item.discount) !== 0
          ? (parseFloat(item.mrp.mrp) * item.quantity * (1 - parseFloat(item.discount) / 100))
          : (parseFloat(item.mrp.mrp) * item.quantity);

        totalMRP += subtotal;
      }
    });

    return totalMRP.toFixed(2);
  };

  // Call calculateTotalMRP to get the total MRP value
  const totalMRP = calculateTotalMRP();


  const handleReportSubmit = async () => {
  

    const userId = await fetccUserId();
    const token = await fetchToken();
    if (userId && token) {
      setIsLoading(true)
      const BookData = {
        userId: parseInt(userId),
        BookHistory: BookHistory,
        totalMRP:parseInt(totalMRP)
      }

      console.log("book history ",BookData)
      try {

        const response = await api.store_order(token, BookData);

        if (response.data.status === true) {
          Toast.show({
            type: "success",
            text1: response.data.message,
            autoHide: false,
            visibilityTime: 1000,
            onShow: () => {
              setTimeout(() => {
                Toast.hide();

                setIsLoading(false)
                clearHistory()
                getBookHistory()
                dispatch(setTotalItemCount(0));

              }, 1000); // Wait for 1 second before navigating
            },
          });
        }

      } catch (error) {
        setIsLoading(false)
        console.log("report confirm error:", error)
      }
    }





  };


  return (
    <>
      <View style={styles.Container}>
        <Header
          title={"Order Details"}
          bg={"blue"}
          leftIcon={'arrowleft'}
          onLeftPress={() => navigation.goBack()}

        />

        <View style={styles.mainContainer}>

          <View>

            <View style={{ flexDirection: "row", justifyContent: "center", marginHorizontal: 20, marginTop: 10 }}>
              {calculateTotalMRP() > 0 ? (
                <>
                  <Text style={{ fontSize: 22, color: "green" }}>Total Amount: </Text>
                  <Text style={{ fontSize: 22, color: "green" }}>₹{calculateTotalMRP()}</Text>
                </>
              ) : (
                <Text style={{ fontSize: 22, color: "red" }}>No Order Details</Text>
              )}
            </View>


            <FlatList
              data={BookHistory}
              renderItem={({ item, index }) => (
                <>

                  <View style={styles.CardContainer}>
                    <View style={{ flex: 1, alignItems: "flex-end", marginBottom: 10 }}>
                      <TouchableOpacity onPress={() => showDeleteConfirmation(item)} >
                        <Text style={{ flex: 1, justifyContent: "flex-end", color: "red", fontSize: 17 }}>Delete</Text>
                      </TouchableOpacity>
                    </View>


                    <View style={styles.table}>
                      {/* here school name */}
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text style={{color:"#787a7c", fontSize: 18, fontWeight: 'bold' }}>School Name:  </Text>
                        </View>
                        <View style={[styles.cell, { alignItems: 'center' }]}>
                          <Text style={{color:"#787a7c", fontSize: 16 }}>{item.SchoolItem ? item.SchoolItem.label : "No School Name"}</Text>
                        </View>
                      </View>


                      {/* here Class name */}
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text style={{color:"#787a7c", fontSize: 18, fontWeight: 'bold' }}>Class Name:  </Text>
                        </View>
                        <View style={[styles.cell, { alignItems: 'center' }]}>
                          <Text style={{color:"#787a7c", fontSize: 16 }}>{item.ClassItem ? item.ClassItem.label : "No Class Name"}</Text>
                        </View>
                      </View>

                      {/* here Subject name */}
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text style={{color:"#787a7c", fontSize: 18, fontWeight: 'bold' }}>Subject Name:  </Text>
                        </View>
                        <View style={[styles.cell,]}>
                          <Text  style={{color:"#787a7c", fontSize: 16 }}>{item.SubjecItem ? item.SubjecItem.label : "No Subject Name"}</Text>
                        </View>
                      </View>


                      {/* here price */}
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text style={{color:"#787a7c", fontSize: 18, fontWeight: 'bold' }}>Actual Price:  </Text>
                        </View>
                        <View style={[styles.cell, { alignItems: 'center' }]}>
                          <Text style={{color:"#787a7c", fontSize: 18 }}>₹{item.mrp ? item.mrp.mrp : "No Price"}</Text>
                        </View>
                      </View>
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text style={{color:"#787a7c", fontSize: 18, fontWeight: 'bold' }}>Quantity:  </Text>
                        </View>
                        <View style={[styles.cell, { alignItems: 'center' }]}>
                          <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={styles.plus_minusContainer} onPress={() => {
                              if (item.quantity > 1) {
                                handleDecremant(item)
                              }

                            }}>
                              <Entypo name="minus" size={15} color={'white'} />
                            </TouchableOpacity>
                            <Text style={{color:"#787a7c", fontSize: 18, color: 'black' }}> {item.quantity} </Text>

                            <TouchableOpacity style={styles.plus_minusContainer} onPress={() => {
                              handleIncreament(item)
                            }}>
                              <Entypo name="plus" size={15} color={'white'} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      {/* Discout value */}

                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text style={{color:"#787a7c", fontSize: 18, fontWeight: 'bold' }}>Discount (%): </Text>
                        </View>
                        <View style={[styles.cell, { alignItems: 'center' }]}>
                          <Text  style={{color:"#787a7c", fontSize: 18 }}>{item.discount ? item.discount : 0} %</Text>

                        </View>
                      </View>

                      {/* Subtotal */}
                      <View style={styles.row}>
                        <View style={styles.cell}>
                          <Text style={{color:"#787a7c", fontSize: 18, fontWeight: 'bold' }}>SubTotal: </Text>
                        </View>
                        <View style={[styles.cell, { alignItems: 'center' }]}>
                          <Text  style={{color:"#787a7c", fontSize: 18 }}>₹
                            {item.mrp && item.mrp.mrp && item.quantity
                              ? item.discount && parseFloat(item.discount) !== 0
                                ? ((parseFloat(item.mrp.mrp) * item.quantity) * (1 - parseFloat(item.discount) / 100)).toFixed(2)
                                : (parseFloat(item.mrp.mrp) * item.quantity).toFixed(2)
                              : "N/A"}
                          </Text>
                        </View>
                      </View>



                    </View>
                  </View>
                </>

              )}
            />



          </View>



        </View>

        {BookHistory.length !== 0 ? (
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              handleReportSubmit()
            }}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Confirmed Order</Text>
          </TouchableOpacity>
        ) : null}

      </View>

      {
        isLoading ? (
          <Loader Loading={isLoading} />
        ) : null
      }

    </>
  )
}

export default ViewOrder


const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: "white"
  },
  mainContainer: {
    flex: 1
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
  },
  cell: {
    flex: 1,
    // borderWidth: 0.5,
    borderColor: '#000',
    padding: 8,
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
    backgroundColor: "#4D2DB7",
    borderRadius: responsiveHeight(1),
    height: responsiveHeight(7),
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsiveHeight(5),
    marginBottom: responsiveHeight(1.4),
    marginVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveHeight(1.5),
  },
})
